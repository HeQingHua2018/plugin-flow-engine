/* eslint-disable @typescript-eslint/no-explicit-any */
/*
 * @File: 规则评估器
 * @desc: 转换数据格式为json-rules-engine可识别的规则格式，并使用规则引擎评估规则是否匹配返回true/false
 * @author: heqinghua
 * @date: 2025年09月03日 09:03:00
 */
import { Engine } from "json-rules-engine";
import type {
  TopLevelCondition,
  Event,
  OperatorEvaluator,
} from "json-rules-engine";
import { RuleFieldData, RuleItemData } from "../types";
import { registerAllOperators } from "@chloehe/logic-engine-common";

import _ from "lodash";
import { RuleTypeOptions } from "../utils";
/**
 * 将自定义规则结构转换为 json-rules-engine 可识别的条件结构
 * @param {Object} customRule - 自定义规则（包含group/rule嵌套结构）
 * @returns {Object} 引擎可识别的条件结构
 */
function transformToEngineConditions(
  customRule: RuleItemData,
): TopLevelCondition {
  // 校验必要属性
  if (!customRule.key) {
    throw new Error("规则节点缺少key属性");
  }

  // 1. 规则节点（type: rule）→ 转换为基础条件（必须包含fact）
  if (customRule.type === "rule") {
    // 严格校验规则节点的必要属性
    if (!customRule.fieldName) {
      throw new Error(`规则 ${customRule.key} 缺少fieldName属性（fact来源）`);
    }
    if (!customRule.rule) {
      throw new Error(`规则 ${customRule.key} 缺少rule属性（操作符）`);
    }
    if (!Array.isArray(customRule.value)) {
      throw new Error(`规则 ${customRule.key} 的value必须是数组`);
    }

    return {
      fact: customRule.fieldName,
      operator: customRule.rule,
      value: customRule.value,
    } as unknown as TopLevelCondition;
  }

  // 2. 分组节点（type: group）→ 转换为嵌套条件（all/any）
  if (customRule.type === "group") {
    // 校验分组属性
    if (!customRule.link || !["and", "or"].includes(customRule.link)) {
      throw new Error(`分组 ${customRule.key} 的link必须是"and"或"or"`);
    }
    if (
      !Array.isArray(customRule.children) ||
      customRule.children.length === 0
    ) {
      throw new Error(`分组 ${customRule.key} 的children必须是非空数组`);
    }
    const conditionKey = customRule.link === "and" ? "all" : "any";
    return {
      [conditionKey]: customRule.children.map(
        (child: RuleItemData) => transformToEngineConditions(child), // 递归转换子节点（规则或分组）
      ),
    } as unknown as TopLevelCondition;
  }

  throw new Error(
    `不支持的节点类型: ${customRule.type}（节点key: ${customRule.key}）`,
  );
}


/**
 * 收集规则中所有必需的字段名（fieldName）
 * @param rules 自定义规则结构
 * @returns 必需字段名的数组
 */
function collectRequiredFields(rules: RuleItemData): string[] {
  const fields = new Set<string>();

  function traverse(node: RuleItemData) {
    if (
      node.type === "rule" &&
      typeof node.fieldName === "string" &&
      node.fieldName.trim() !== ""
    ) {
      fields.add(node.fieldName);
    }

    if (node.type === "group" && Array.isArray(node.children)) {
      node.children.forEach(child => traverse(child));
    }
  }

  traverse(rules);
  return Array.from(fields);
}

/**
 * 检查事实数据是否包含所有必需的字段
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function hasAllRequiredFields(
  rules: RuleItemData,
  facts: Record<string, any>,
): boolean {
  const requiredFields = collectRequiredFields(rules);
  return requiredFields.every(field => field in facts);
}

/**
 * 评估自定义规则是否匹配事实数据
 * @param {Object} customRules - 自定义规则结构（顶级必须是group）
 * @param {Object} facts - 事实数据（键为field，值为实际数据）
 * @returns {Promise<boolean>} 是否匹配
 */
async function evaluateRule(
  customRules: RuleItemData,
  facts: Record<string, any>,
): Promise<boolean> {
  try {
    // 1. 校验顶级节点必须是group
    if (customRules.type !== "group") {
      throw new Error('顶级规则必须是type: "group"');
    }
    // // 2. 检查事实数据是否包含所有必需字段
    // if (!hasAllRequiredFields(customRules, facts)) {
    //   return false;
    // }
    // 2. 收集所有必需的字段
    const requiredFields = collectRequiredFields(customRules);
    // console.log("evaluateRule必需字段：", requiredFields);
    // 3. 转换规则为引擎可识别的条件结构（仅条件部分）
    const engineConditions = transformToEngineConditions(customRules);
    // console.log("evaluateRule转换后的规则数据：", engineConditions);

    // 4. 构建完整的引擎规则（条件 + 事件）
    const engineRule = {
      conditions: engineConditions, // 顶级条件（由分组转换而来）
      event: { type: "match" }, // 用于标记匹配成功的事件
    };

    // 5. 初始化引擎并注册自定义操作符
    const engine = new Engine();
    registerAllOperators(engine);
    
    // 6. 添加事实处理器处理可能的缺失字段
    requiredFields.forEach(field => {
      engine.addFact(field, async (params, almanac) => {
        try {
          return await almanac.factValue(field);
        } catch (error) {
          return undefined; // 统一返回 undefined
        }
      });
    });

    // 7. 评估规则
    engine.addRule(engineRule);
    const results = await engine.run(facts);
    const result = results.events.some(
      (event: Event) => event.type === "match",
    );
    // console.log("evaluateRule评估结果：", result);
    // 6. 根据事件判断是否匹配
    return result;
  } catch (error: any) {
    // console.error("规则评估失败:", error.message);
    return false;
    // throw error instanceof Error ? error : new Error(error);
  }
}

// ---- 规则语义化描述 start ----

/**
 * 递归查找树形结构中的节点标签
 * @param treeData 树形数据
 * @param value 要查找的值
 * @returns 找到的标签文本，未找到返回空字符串
 */
function findLabelInTree(treeData: any[], value: any): string {
  if (!Array.isArray(treeData)) return "";
  
  for (const node of treeData) {
    if (node?.value === value) {
      return node.label || "";
    }
    if (Array.isArray(node?.children)) {
      const label = findLabelInTree(node.children, value);
      if (label) return label;
    }
  }
  return "";
}

/**
 * 格式化规则值显示文本
 * @param rules 规则数据
 * @param field 字段配置
 * @returns 格式化后的显示文本
 */
function formatRuleValue(rules: RuleItemData, field?: RuleFieldData): string {
  // 处理空值规则（无需显示值）
  if (rules.rule === "is_null" || rules.rule === "is_not_null") {
    return "";
  }
  
  // 处理范围类型规则（between）
  if (rules.rule === "between" && Array.isArray(rules.value) && rules.value.length >= 2) {
    return `${rules.value[0]}~${rules.value[1]}`;
  }
  
  // 处理其他规则类型的值显示
  if (!Array.isArray(rules.value) || rules.value.length === 0) {
    return "";
  }
  
  if (rules.value[0] !== null && typeof rules.value[0] === 'object') {
    // 对于对象值（如浏览按钮），直接提取label属性
    return rules.value
      .map((v: any) => v?.label || '')
      .filter((text: string) => text)
      .join(",");
  }
  
  // 对于有选项的字段类型
  if (field?.type && ['select', 'checkbox', 'radio', 'checkboxs'].includes(field.type)) {
    return rules.value
      .map((v: string) => {
        const optionLabel = field.props?.options?.find(
          (i: { value: string; label: string }) => i.value === v,
        )?.label;
        return optionLabel || String(v);
      })
      .filter((text: string) => text)
      .join(",");
  }
  
  // 对于树形选择器
  if (field?.type === 'treeselect') {
    return rules.value
      .map((v: any) => findLabelInTree(field.props?.options || [], v))
      .filter((label: string) => label)
      .join(",");
  }
  // 其他情况
  // 对于多值规则，显示所有值
  if (rules.rule &&rules.value.length > 1 && ['in', 'not_in'].includes(rules.rule)) {
    return rules.value.map(v => String(v)).join(",");
  }
  
  // 单值规则只显示第一个值
  return rules.value[0]?.toString() || "";
}

/**
 * 获取规则语义化描述
 * @param rules 规则数据
 * @param fields 字段数据
 * @param isRoot 是否为根规则 默认true
 * @returns 规则描述字符串
 */
function getRuleDesc(rules: RuleItemData, fields: RuleFieldData[], isRoot = true): string {
  // 输入参数校验 
  if (!rules || typeof rules !== 'object' || Object.keys(rules).length === 0) return "暂无规则";
  if (!fields || !Array.isArray(fields) || fields.length === 0) return "暂无规则";
  
  // 处理规则节点
  if (rules.type === "rule") {
    // 提取字段标签的辅助函数
    const getFieldLabel = (fieldKey?: string): string => {
      if (!fieldKey) return "-";
      const field = fields.find(item => item.key === fieldKey);
      return field?.label || "-";
    };
    
    // 提取规则标签的辅助函数
    const getRuleLabel = (ruleValue?: string): string => {
      if (!ruleValue || !RuleTypeOptions || !Array.isArray(RuleTypeOptions)) return "-";
      const ruleOption = RuleTypeOptions.find(item => item.value === ruleValue);
      return ruleOption?.label || "-";
    };
    
    // 使用辅助函数获取标签文本
    const fieldText = getFieldLabel(rules.field);
    const ruleText = getRuleLabel(rules.rule);
    
    // 使用提取的函数格式化值
    const valueText = formatRuleValue(rules, fields.find(item => item.key === rules.field));
    
    // 组合成完整的描述
    return `${fieldText}${ruleText}${valueText}`.trim();
  }
  
  // 处理分组节点
  if (rules.type === "group") {
    // 验证link值的有效性
    const linkWord = (rules.link && ['and', 'or'].includes(rules.link)) 
      ? (rules.link === "and" ? "且" : "或") 
      : "且"; // 默认使用"且"
    
    // 优化：合并map和filter操作，减少数组迭代次数
    const childDescs: string[] = [];
    if (Array.isArray(rules.children)) {
      for (const child of rules.children) {
        if (!child) continue;
        const desc = getRuleDesc(child, fields, false);
        if (desc && desc.trim() !== "") {
          childDescs.push(desc);
        }
      }
    }
    
    // 处理空分组情况
    if (childDescs.length === 0) return "";
    
    // 组合子描述
    const joined = childDescs.join(` ${linkWord} `);
    return isRoot ? joined : `(${joined})`;
  }
  
  // 处理未知类型
  return "";
}
  
// ----- 规则语义化描述 end ----

export default evaluateRule;

/**
 * 将 json-rules-engine 条件 (TopLevelCondition) 反向转换为 RuleEditor 可编辑的节点结构
 * 用于在编辑器中回显已保存到流程中的 engine 条件
 */
function transformFromEngineConditions(condition: any, fields: RuleFieldData[] = []): RuleItemData {
  if (!condition || typeof condition !== 'object') {
    throw new Error('Invalid engine condition for transformFromEngineConditions');
  }

  const makeKey = () => Math.random().toString(36).substring(2, 12);

  const resolveFieldKey = (fact: string) => {
    const field = fields.find(
      item => item.fieldName === fact || item.key === fact,
    );
    return field?.key || fact;
  };

  // 分组节点（all/any）
  if (Array.isArray(condition.all) || Array.isArray(condition.any)) {
    const link = Array.isArray(condition.all) ? 'and' : 'or';
    const children = (condition.all || condition.any || []).map((child: any) => transformFromEngineConditions(child, fields));
    return {
      key: makeKey(),
      type: 'group',
      link,
      children,
    } as RuleItemData;
  }

  // 规则节点（fact/operator/value）
  if (condition.fact && condition.operator) {
    const value = condition.value;
    return {
      key: makeKey(),
      type: 'rule',
      field: resolveFieldKey(condition.fact),
      fieldName: condition.fact,
      rule: condition.operator,
      value: Array.isArray(value) ? value : (value === undefined ? [] : [value]),
    } as RuleItemData;
  }

  // 未知结构——抛出以便上层处理
  throw new Error('Unsupported engine condition structure');
}

export { evaluateRule, getRuleDesc, transformToEngineConditions, transformFromEngineConditions };
