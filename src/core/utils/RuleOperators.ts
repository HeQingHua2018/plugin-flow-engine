/*
 * @File: RuleOperators.ts
 * @desc: 自定义规则操作符注册与扩展（基于 json-rules-engine 的 Engine.addOperator）
 * @author: heqinghua
 * @date: 2025年10月22日
 */
import _ from 'lodash';
import { Engine, OperatorEvaluator } from 'json-rules-engine';


// 全局自定义操作符注册表（供外部注入）
const customOperatorRegistry = new Map<string, OperatorEvaluator<any,any>>();

/**
 * 外部注入自定义操作符（在每次创建引擎时统一注册）
 */
export function injectOperator(name: string, fn: OperatorEvaluator<any,any>): void {
  if (!name || typeof fn !== 'function') return;
  customOperatorRegistry.set(name, fn);
}
/**
 * 内置的常用增强操作符集合
 * 可用于字符串、数组与数值范围等场景
 */
const operators:Record<string, OperatorEvaluator<any,any>>  = {
  // 字符串前缀匹配
  start_with: (factValue,compareValue)=>{
    if (_.isString(factValue) && _.isString(compareValue)) {
      return _.startsWith(factValue, compareValue);
    }
    if (!_.isNil(factValue) && !_.isNil(compareValue)) {
      return _.startsWith(_.toString(factValue), _.toString(compareValue));
    }
    return false;
  },
  // 字符串后缀匹配
  end_with: (factValue,compareValue)=>{
    if (_.isString(factValue) && _.isString(compareValue)) {
      return _.endsWith(factValue, compareValue);
    }
    if (!_.isNil(factValue) && !_.isNil(compareValue)) {
      return _.endsWith(_.toString(factValue), _.toString(compareValue));
    }
    return false;
  },
  // 数组包含元素
  include: (factValue,compareValue)=>{
    if (_.isArray(factValue)) {
      if (_.isArray(compareValue)) {
        return _.every(compareValue, v => _.includes(factValue, v));
      }
      return _.includes(factValue, compareValue);
    }
    if (_.isString(factValue) && _.isString(compareValue)) {
      return _.includes(factValue, compareValue);
    }
    return false;
  },
  // 数组不包含元素
  not_include: (factValue,compareValue)=>{
    if (_.isArray(factValue)) {
      if (_.isArray(compareValue)) {
        return !_.every(compareValue, v => _.includes(factValue, v));
      }
      return !_.includes(factValue, compareValue);
    }
    if (_.isString(factValue) && _.isString(compareValue)) {
      return !_.includes(factValue, compareValue);
    }
    return false;
  },
  // 正则匹配
  regex: (factValue,compareValue)=>{
    let re: RegExp | null = null;
    if (compareValue instanceof RegExp) {
      re = compareValue;
    } else if (_.isString(compareValue)) {
      try {
        re = new RegExp(compareValue);
      } catch {
        return false;
      }
    } else {
      return false;
    }
    return re.test(_.toString(factValue));
  },
  // 数值范围包含
  between: (factValue,compareValue)=>{
    if (!_.isArray(compareValue) || compareValue.length < 2) return false;
    const [min, max] = compareValue;
    const n = _.toNumber(factValue);
    const nMin = _.toNumber(min);
    const nMax = _.toNumber(max);
    if (!_.isFinite(n) || !_.isFinite(nMin) || !_.isFinite(nMax)) return false;
    return n >= nMin && n <= nMax;
  },
  // 数值范围不包含
  not_between: (factValue,compareValue)=>{
    if (!_.isArray(compareValue) || compareValue.length < 2) return false;
    const [min, max] = compareValue;
    const n = _.toNumber(factValue);
    const nMin = _.toNumber(min);
    const nMax = _.toNumber(max);
    if (!_.isFinite(n) || !_.isFinite(nMin) || !_.isFinite(nMax)) return false;
    return n < nMin || n > nMax;
  },
  // 对象是否包含指定键
  has_key: (factValue,compareValue)=>{
    if (_.isArray(compareValue)) {
      return _.every(compareValue, (k) => _.isString(k) && _.has(factValue as any, k));
    }
    if (_.isString(compareValue)) {
      return _.has(factValue as any, compareValue);
    }
    return false;
  },
  // 检查值是否为空（null、undefined、空字符串、空数组、空对象）
  is_empty: (factValue)=>{
    return _.isEmpty(factValue);
  },
  // 检查值是否不为空
  not_empty: (factValue)=>{
    return !_.isEmpty(factValue);
  },
}

/**
 * 内置的常用增强操作符集合
 * 可用于字符串、数组与数值范围等场景
 */
function registerBuiltInOperators(engine: Engine): void {
  // 注册所有内置操作符
  Object.entries(operators).forEach(([name, fn]) => {
    try {
      engine.addOperator(name, fn);
    } catch (err) {
      const msg = `[RuleOperators] 注册操作符失败: ${name} - ${err instanceof Error ? err.message : String(err)}`;
      console.log(msg);
      throw new Error(msg);
    }
  });
}

/**
 * 在引擎实例上注册所有操作符（内置 + 外部注入）
 */
export function registerAllOperators(engine: Engine): void {
  // 内置增强
  registerBuiltInOperators(engine);
  // 外部注入的自定义操作符
  customOperatorRegistry.forEach((fn, name) => {
    try {
      engine.addOperator(name, fn);
    } catch (err) {
      const msg = `[RuleOperators] 注册操作符失败: ${name} - ${err instanceof Error ? err.message : String(err)}`;
      console.log(msg);
      throw new Error(msg);
    }
  });
}