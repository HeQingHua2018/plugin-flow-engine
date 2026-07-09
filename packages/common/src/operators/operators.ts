/* eslint-disable @typescript-eslint/no-use-before-define */
/*
 * @File: operators.ts
 * @desc: 定义规则引擎的各种内置操作符实现，用于动态规则引擎的表达式计算
 * @author: heqinghua
 * @date: 2025年09月15日
 */

import * as _ from 'lodash';
import type { OperatorEvaluator } from 'json-rules-engine';

// ==========================================
// 值处理工具函数
// ==========================================

/**
 * 提取值的实际内容
 * 用于处理可能包装在对象中的值，支持以下格式：
 * - 普通值：直接返回
 * - 包装对象：如 { value: '实际值' } 返回 '实际值'
 * - Date对象：保持原样返回，避免被当作普通对象处理
 */
export function extractRealValue(value: any): any {
  if (_.isPlainObject(value) && 'value' in value) {
    return value.value;
  }
  return value instanceof Date ? value : value;
}

/**
 * 标准化值为数组形式
 * 将任意类型的值转换为数组，便于统一处理
 */
export function normalizeToArray(value: any): any[] {
  return _.isArray(value) 
    ? value.map(extractRealValue)
    : [extractRealValue(value)];
}

// ==========================================
// 比较工具函数
// ==========================================

// 使用函数表达式和类型注解来解决循环引用问题
// 使用函数声明，它们会被提升到作用域顶部
function compareObjects(objA: Record<string, any>, objB: Record<string, any>): boolean {
  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);
  
  // 键的数量必须相同
  if (keysA.length !== keysB.length) return false;
  
  // 递归比较每个键对应的值
  return keysA.every(key => 
    deepEqual(extractRealValue(objA[key]), extractRealValue(objB[key]))
  );
}

function compareArraysUnordered(arrA: any[], arrB: any[]): boolean {
  if (arrA.length !== arrB.length) return false;
  if (arrA.length === 0) return true;

  const normalizedA = arrA.map(extractRealValue);
  const normalizedB = arrB.map(extractRealValue);

  // 创建副本进行匹配，避免修改原数组
  const remainingB = [...normalizedB];
  
  // 贪心算法：为每个元素找到第一个匹配的对应元素
  for (const itemA of normalizedA) {
    const matchIndex = remainingB.findIndex(itemB => deepEqual(itemA, itemB));
    if (matchIndex === -1) return false;
    remainingB.splice(matchIndex, 1); // 移除已匹配的元素
  }
  
  return remainingB.length === 0;
}

export function deepEqual(a: any, b: any): boolean {
  // 处理null/undefined：两者都为null/undefined时视为相等
  if (_.isNil(a)) return _.isNil(b);
  if (_.isNil(b)) return false;

  // 处理Date：比较时间戳
  if (a instanceof Date && b instanceof Date) {
    return a.getTime() === b.getTime();
  }

  // 处理数组（无序比较）
  if (_.isArray(a) && _.isArray(b)) {
    return compareArraysUnordered(a, b);
  }

  // 处理数组与非数组的比较：将非数组包装为单元素数组
  if (_.isArray(a) || _.isArray(b)) {
    const arrA = _.isArray(a) ? a : [a];
    const arrB = _.isArray(b) ? b : [b];
    return compareArraysUnordered(arrA, arrB);
  }

  // 处理对象：深度比较所有属性
  if (_.isPlainObject(a) && _.isPlainObject(b)) {
    return compareObjects(a, b);
  }

  // 基础类型比较：提取实际值后比较
  return extractRealValue(a) === extractRealValue(b);
}

// ==========================================
// 数值比较工具函数
// ==========================================

/**
 * 将任意类型的值转换为可比较的数值
 */
export function parseComparableValue(value: any): number | null {
  const realValue = extractRealValue(value);
  
  if (_.isNil(realValue)) return null;
  
  // Date对象转换为时间戳
  if (realValue instanceof Date) {
    return realValue.getTime();
  }
  
  // 字符串处理：尝试解析为日期或数字
  if (_.isString(realValue)) {
    const trimmed = _.trim(realValue);
    if (_.isEmpty(trimmed)) return null;
    
    // 优先尝试解析为日期
    const date = new Date(trimmed);
    if (!isNaN(date.getTime())) {
      return date.getTime();
    }
    
    // 然后尝试解析为数字
    const num = _.toNumber(trimmed);
    return _.isNaN(num) ? null : num;
  }
  
  // 数字直接使用
  if (_.isNumber(realValue)) {
    return realValue;
  }
  
  // 其他类型无法转换
  return null;
}

/**
 * 数值比较的通用实现
 */
export function compareNumbers(
  factValue: any, 
  compareToValue: any[], 
  comparator: (factNum: number, targetNum: number) => boolean
): boolean {
  if (!_.isArray(compareToValue)) return false;
  
  // 转换事实值为数值
  const factNum = parseComparableValue(factValue);
  if (factNum === null) return false; // 无法转换时直接返回false
  
  // 只要有一个目标值满足比较条件即可
  return compareToValue.some(target => {
    const targetNum = parseComparableValue(target);
    return targetNum !== null && comparator(factNum, targetNum);
  });
}

// ==========================================
// 字符串操作工具函数
// ==========================================

/**
 * 字符串操作符工厂函数
 */
export function createStringOperator(
  predicate: (factStr: string, targetStr: string) => boolean,
  mode: 'some' | 'every' = 'some'
): OperatorEvaluator<any,any[]> {
  return (factValue: any, compareToValue: any[]) => {
    const realFact = extractRealValue(factValue);
    
    // 类型检查：确保事实值为字符串，目标值为数组
    if (!_.isString(realFact) || !_.isArray(compareToValue)) {
      // 对于every模式，默认返回true（空集合的普遍量化）
      // 对于some模式，默认返回false（空集合的存在量化）
      return mode === 'every';
    }
    
    // 根据模式选择适当的数组方法
    const predicateFn = mode === 'some' ? 'some' : 'every';
    
    return compareToValue[predicateFn](target => {
      const strTarget = String(extractRealValue(target));
      return predicate(realFact, strTarget);
    });
  };
}

// ==========================================
// 操作符定义
// ==========================================

/**
 * 规则操作符集合
 */
export const operators: Record<string, OperatorEvaluator<any,any[]>> = {
  /**
   * 等于操作符
   */
  eq: (factValue, compareToValue) => {
    if (!_.isArray(compareToValue)) return false;
    return deepEqual(
      normalizeToArray(factValue),
      compareToValue.map(extractRealValue)
    );
  },
  
  /**
   * 不等于操作符
   */
  ne: (factValue, compareToValue) => {
    return !operators.eq(factValue, compareToValue);
  },

  /**
   * 字符串包含操作符
   */
  like: createStringOperator((fact, target) => fact.includes(target)),
  
  /**
   * 字符串不包含操作符
   */
  not_like: createStringOperator((fact, target) => !fact.includes(target), 'every'),

  /**
   * 字符串前缀匹配操作符
   */
  start_with: createStringOperator((fact, target) => fact.startsWith(target)),
  
  /**
   * 字符串非前缀匹配操作符
   */
  not_start_with: createStringOperator((fact, target) => !fact.startsWith(target), 'every'),
  
  /**
   * 字符串后缀匹配操作符
   */
  end_with: createStringOperator((fact, target) => fact.endsWith(target)),
  
  /**
   * 字符串非后缀匹配操作符
   */
  not_end_with: createStringOperator((fact, target) => !fact.endsWith(target), 'every'),

  /**
   * 集合包含操作符
   */
  in: (factValue, compareToValue) => {
    if (!_.isArray(compareToValue)) return false;
    
    const factArray = normalizeToArray(factValue);
    const targetArray = compareToValue.map(extractRealValue);
    
    // 任一事实值存在于目标集合中即可
    return factArray.some(factItem => 
      targetArray.some(targetItem => deepEqual(factItem, targetItem))
    );
  },
  
  /**
   * 集合不包含操作符
   */
  not_in: (factValue, compareToValue) => {
    return !operators.in(factValue, compareToValue);
  },

  /**
   * 数值比较操作符
   */
  
  /**
   * 大于操作符
   */
  gt: (factValue, compareToValue) => 
    compareNumbers(factValue, compareToValue, (a, b) => a > b),
  
  /**
   * 小于操作符
   */
  lt: (factValue, compareToValue) => 
    compareNumbers(factValue, compareToValue, (a, b) => a < b),
  
  /**
   * 大于等于操作符
   */
  ge: (factValue, compareToValue) => 
    compareNumbers(factValue, compareToValue, (a, b) => a >= b),
  
  /**
   * 小于等于操作符
   */
  le: (factValue, compareToValue) => 
    compareNumbers(factValue, compareToValue, (a, b) => a <= b),

  /**
   * 区间包含操作符
   */
  between: (factValue, compareToValue) => {
    if (!_.isArray(compareToValue) || compareToValue.length < 2) return false;
    
    const factNum = parseComparableValue(factValue);
    if (factNum === null) return false;
    
    // 提取区间边界并排序
    const bounds = compareToValue
      .slice(0, 2)
      .map(parseComparableValue)
      .filter(num => num !== null) as number[];
    
    if (bounds.length !== 2) return false;
    
    const [min, max] = _.sortBy(bounds);
    return _.gte(factNum, min) && _.lte(factNum, max);
  },
  
  /**
   * 区间不包含操作符
   */
  not_between: (factValue, compareToValue) => {
    return !operators.between(factValue, compareToValue);
  },

  /**
   * 布尔判断操作符
   */
  
  /**
   * 真值判断操作符
   */
  is: (factValue) => {
    const realFact = extractRealValue(factValue);
    return realFact;
  },
  
  /**
   * 假值判断操作符
   */
  is_not: (factValue) => {
    const realFact = extractRealValue(factValue);
    return !realFact;
  },

  /**
   * 枚举匹配操作符
   */
  
  /**
   * 枚举包含操作符
   */
  is_oneof: (factValue, compareToValue) => {
    if (!_.isArray(compareToValue)) return false;
    const realFact = extractRealValue(factValue);
    return compareToValue.some(target => deepEqual(realFact, extractRealValue(target)));
  },
  
  /**
   * 枚举不包含操作符
   */
  is_n_oneof: (factValue, compareToValue) => {
    return !operators.is_oneof(factValue, compareToValue);
  },

  /**
   * 空值判断操作符
   */
  
  /**
   * 空值判断操作符
   */
  is_null: (factValue) => {
    const realFact = extractRealValue(factValue);
    return _.isNil(realFact) || realFact === '';
  },
  
  /**
   * 非空判断操作符
   */
  is_not_null: (factValue) => {
    const realFact = extractRealValue(factValue);
    return !_.isNil(realFact) && realFact !== '';
  },

  /**
   * 正则匹配操作符
   */
  
  /**
   * 正则匹配任一操作符
   */
  is_match: (factValue, compareToValue) => {
    if (!_.isArray(compareToValue) || compareToValue.length === 0) return false;
    
    const realFact = extractRealValue(factValue);
    
    return compareToValue.some(target => {
      const pattern = extractRealValue(target);
      if (!_.isString(pattern)) return false;
      
      try {
        const regex = new RegExp(pattern);
        return regex.test(realFact);
      } catch (error) {
        // 正则表达式语法错误时返回false
        return false;
      }
    });
  },
  
  /**
   * 正则匹配任一操作符（is_match的语义化别名）
   */
  match_any: (factValue, compareToValue) => {
    return operators.is_match(factValue, compareToValue);
  },
  
  /**
   * 正则不匹配操作符
   */
  is_not_match: (factValue, compareToValue) => {
    return !operators.is_match(factValue, compareToValue);
  },
  
  /**
   * 正则匹配全部操作符
   */
  match_all: (factValue, compareToValue) => {
    if (!_.isArray(compareToValue) || compareToValue.length === 0) return false;
    
    const realFact = extractRealValue(factValue);
    
    return compareToValue.every(target => {
      const pattern = extractRealValue(target);
      if (!_.isString(pattern)) return false;
      
      try {
        const regex = new RegExp(pattern);
        return regex.test(realFact);
      } catch (error) {
        // 正则表达式语法错误时返回false
        return false;
      }
    });
  },
};

// 导出操作符类型
export type OperatorType = keyof typeof operators;

// 默认导出操作符集合
export default operators;