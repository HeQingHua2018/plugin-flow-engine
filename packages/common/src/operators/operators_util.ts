/*
 * @File: operators_util.ts
 * @desc: 操作符工具函数，提供简单直接的操作符管理功能
 * @author: heqinghua
 * @date: 2025年11月07日
 */

import type { OperatorEvaluator } from 'json-rules-engine';
import { Engine } from 'json-rules-engine';
import operators from './operators';

/**
 * json-rules-engine 默认内置的操作符列表
 */
const DEFAULT_JSON_RULES_ENGINE_OPERATORS = [
  'equal',
  'notEqual',
  'contains',
  'doesNotContain',
  'in',
  'notIn',
  'greaterThan',
  'greaterThanInclusive',
  'lessThan',
  'lessThanInclusive',
  'between',
  'notBetween',
  'exists',
  'doesNotExist',
];

let externalOperators: Record<string, OperatorEvaluator<any, any>> = {};

/**
* 注入自定义操作符
* 允许外部包扩展规则引擎的操作符功能
*/
export function injectOperator(
  name: string,
  evaluator: OperatorEvaluator<any, any>,
): void {
  externalOperators[name] = evaluator;
}

/**
* 清除所有外部注入的操作符
*/
export function clearExternalOperators(): void {
  externalOperators = {};
}
/**
 * 清除json-rules-engine内置操作符
 */
export function clearEngineOperators(engine: Engine): void {
  DEFAULT_JSON_RULES_ENGINE_OPERATORS.forEach((name) => {
    engine.removeOperator(name);
  });
}
/**
 * 清除框架自带的操作符
 * @param engine 规则引擎实例
 */
export function clearBuiltInOperators(engine: Engine): void {
  Object.keys(operators).forEach((name) => {
    engine.removeOperator(name);
  });
}
/**
 * 清除所有操作符（内置+外部注入+json-rules-engine默认操作符）
 * @param engine 规则引擎实例
 */
export function clearAllOperators(engine: Engine): void {
  clearBuiltInOperators(engine);
  clearEngineOperators(engine);
  clearExternalOperators();
}

/**
 * 注册框架自带的操作符
 * @param engine 规则引擎实例
 */
export function registerBuiltInOperators(engine: Engine): void {
  Object.entries(operators).forEach(([name, evaluator]) => {
    engine.addOperator(name, evaluator);
  });
}

/**
 * 注册外部注入的操作符
 * @param engine 规则引擎实例
 */
export function registerExternalOperators(engine: Engine): void {
  Object.entries(externalOperators).forEach(([name, evaluator]) => {
    engine.addOperator(name, evaluator);
  });
}


/**
 * 在规则引擎实例上注册所有操作符（内置+外部注入）
 */
export function registerAllOperators(engine: Engine): void {
  // 注册内置操作符
  Object.entries(operators).forEach(([name, evaluator]) => {
    engine.addOperator(name, evaluator);
  });

  // 注册外部注入的操作符
  Object.entries(externalOperators).forEach(([name, evaluator]) => {
    engine.addOperator(name, evaluator);
  });
}
/**
 * 获取框架自带的操作符列表
 * @returns 操作符名称数组
 */
export function getBuiltInOperators (){
  return Object.keys(operators);
}
/**
 * 获取外部注入的操作符列表
 * @returns 操作符名称数组
 */
export function getExternalOperators (){
  return Object.keys(externalOperators);
}



const operatorsUtil = {
  clearBuiltInOperators,
  clearEngineOperators,
  clearExternalOperators,
  clearAllOperators,
  registerBuiltInOperators,
  registerExternalOperators,
  registerAllOperators,
};

export default operatorsUtil;
