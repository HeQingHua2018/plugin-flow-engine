/*
 * @File: RuleOperators.ts
 * @desc: 自定义规则操作符注册与扩展（基于 json-rules-engine 的 Engine.addOperator）
 * @author: heqinghua
 * @date: 2025年10月22日
 */
import { Engine } from 'json-rules-engine';

// 操作符函数签名：与 json-rules-engine 的 addOperator 兼容
export type OperatorFn = (
  factValue: any,
  jsonValue: any,
  almanac?: any
) => boolean;

// 全局自定义操作符注册表（供外部注入）
const customOperatorRegistry = new Map<string, OperatorFn>();

/**
 * 外部注入自定义操作符（在每次创建引擎时统一注册）
 */
export function injectOperator(name: string, fn: OperatorFn): void {
  if (!name || typeof fn !== 'function') return;
  customOperatorRegistry.set(name, fn);
}

/**
 * 内置的常用增强操作符集合
 * 可用于字符串、数组与数值范围等场景
 */
function registerBuiltInOperators(engine: Engine): void {
  // 字符串前缀匹配：支持 { value, caseInsensitive }
  engine.addOperator('startsWith', (factValue: any, jsonValue: any) => {
    if (typeof factValue !== 'string' || !jsonValue) return false;
    const val = String(factValue);
    const cfg =
      typeof jsonValue === 'object' && jsonValue !== null
        ? jsonValue
        : { value: String(jsonValue), caseInsensitive: false };
    const compareA = cfg.caseInsensitive ? val.toLowerCase() : val;
    const compareB = cfg.caseInsensitive
      ? String(cfg.value).toLowerCase()
      : String(cfg.value);
    return compareA.startsWith(compareB);
  });

  // 字符串后缀匹配：支持 { value, caseInsensitive }
  engine.addOperator('endsWith', (factValue: any, jsonValue: any) => {
    if (typeof factValue !== 'string' || !jsonValue) return false;
    const val = String(factValue);
    const cfg =
      typeof jsonValue === 'object' && jsonValue !== null
        ? jsonValue
        : { value: String(jsonValue), caseInsensitive: false };
    const compareA = cfg.caseInsensitive ? val.toLowerCase() : val;
    const compareB = cfg.caseInsensitive
      ? String(cfg.value).toLowerCase()
      : String(cfg.value);
    return compareA.endsWith(compareB);
  });

  // 包含判断：字符串包含或数组包含
  engine.addOperator('contains', (factValue: any, jsonValue: any) => {
    if (Array.isArray(factValue)) {
      return factValue.includes(jsonValue);
    }
    if (typeof factValue === 'string') {
      const search = String(jsonValue);
      return factValue.includes(search);
    }
    return false;
  });

  // 正则匹配：支持字符串或 { pattern, flags }
  engine.addOperator('regex', (factValue: any, jsonValue: any) => {
    if (typeof factValue !== 'string' || !jsonValue) return false;
    let pattern = '';
    let flags = '';
    if (typeof jsonValue === 'string') {
      pattern = jsonValue;
    } else if (jsonValue && typeof jsonValue === 'object') {
      pattern = String(jsonValue.pattern || '');
      flags = String(jsonValue.flags || '');
    }
    try {
      const reg = new RegExp(pattern, flags);
      return reg.test(factValue);
    } catch {
      return false;
    }
  });

  // 数值区间：{ min, max, inclusive? }
  engine.addOperator('between', (factValue: any, jsonValue: any) => {
    const num = Number(factValue);
    if (Number.isNaN(num) || !jsonValue) return false;
    const min = Number(jsonValue.min);
    const max = Number(jsonValue.max);
    const inclusive = Boolean(jsonValue.inclusive);
    if (Number.isNaN(min) || Number.isNaN(max)) return false;
    return inclusive ? num >= min && num <= max : num > min && num < max;
  });

  // 为空判断：null/undefined/空字符串/空数组/空对象
  engine.addOperator('isEmpty', (factValue: any) => {
    if (factValue === null || factValue === undefined) return true;
    if (typeof factValue === 'string') return factValue.trim().length === 0;
    if (Array.isArray(factValue)) return factValue.length === 0;
    if (typeof factValue === 'object') return Object.keys(factValue).length === 0;
    return false;
  });

  // 非空判断
  engine.addOperator('notEmpty', (factValue: any) => {
    return !(
      factValue === null ||
      factValue === undefined ||
      (typeof factValue === 'string' && factValue.trim().length === 0) ||
      (Array.isArray(factValue) && factValue.length === 0) ||
      (typeof factValue === 'object' && Object.keys(factValue).length === 0)
    );
  });

  // 对象是否包含某键
  engine.addOperator('hasKey', (factValue: any, jsonValue: any) => {
    if (!factValue || typeof factValue !== 'object') return false;
    const key = String(jsonValue);
    return Object.prototype.hasOwnProperty.call(factValue, key);
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
      if (process.env.NODE_ENV === 'development') {
        console.warn(`[RuleOperators] 注册操作符失败: ${name}`, err);
      }
    }
  });
}