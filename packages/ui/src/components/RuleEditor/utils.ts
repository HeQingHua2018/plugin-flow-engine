import { Key } from "react";
import { RuleItemData } from "./types";
import { cloneDeep, remove, set } from "lodash";

// 原生数据类型定义
export type NativeType = 'string' | 'number' | 'boolean' | 'date' | 'array' | 'object';

export const getUUID = ():string => {
  return Math.random().toString(36).substring(2, 10);
}

/**
 * 生成日期控件属性，主要生成format、picker两个属性
 * @param format 
 * @param picker 
 * @returns 
 */
export function getDatePickerProps(format = 'YYYY-MM-DD', picker?: "time" | "date" | "month" | "week" | "quarter" | "year") {
    // 避免传入格式为java日期格式（yyyy-MM-dd）
    const fmt = (format || 'YYYY-MM-DD').replace(/y/gi, 'Y').replace(/d/gi, 'D');
    const result = { format: fmt, picker: picker || 'date' };
    if (picker && ['week', 'quarter'].includes(picker)) {
        set(result, 'format', '');
    } else {
        if (!RegExp(/D+|H+|m+|s+|M+/).test(fmt)) {
            //显示年份
            set(result, 'picker', 'year');
        } else if (!RegExp(/D+|H+|m+|s+/).test(fmt)) {
            //显示月份
            set(result, 'picker', 'month');
        } else if (!RegExp(/Y+|M+|D+/g).test(fmt)) { // 仅限时间选择
            set(result, 'picker', 'time');
        }
        if (fmt.length > 11) {
            set(result, 'showTime', true);
            // set(result, 'picker', 'date');
        }
    }
    return result;
}

export const RuleTypeOptions = [
  // 基础比较操作
  { value: "eq", label: "等于" },
  { value: "ne", label: "不等于" },
  // 布尔判断操作
  { value: "is", label: "为真" },
  { value: "is_not", label: "为假" },
  // 数值比较操作
  { value: "gt", label: "大于" },
  { value: "ge", label: "大于等于" },
  { value: "lt", label: "小于" },
  { value: "le", label: "小于等于" },
  { value: "between", label: "范围内" },
  { value: "not_between", label: "不在范围内" },
  // 字符串操作
  { value: "start_with", label: "开头是" },
  { value: "end_with", label: "结尾是" },
  { value: "like", label: "包含" },
  { value: "not_like", label: "不包含" },
  { value: "not_start_with", label: "不是以...开头" },
  { value: "not_end_with", label: "不是以...结尾" },
  // 集合操作
  { value: "in", label: "在集合中" },
  { value: "not_in", label: "不在集合中" },
  { value: "is_oneof", label: "是其中之一" },
  { value: "is_n_oneof", label: "不是其中之一" },
  // 正则匹配操作
  { value: "is_match", label: "匹配正则" },
  { value: "match_any", label: "匹配任一正则" },
  { value: "is_not_match", label: "不匹配正则" },
  { value: "match_all", label: "匹配所有正则" },
  // 空值检查
  { value: "is_null", label: "为空" },
  { value: "is_not_null", label: "不为空" },
];

// 规则定义
export const RULES = {
  // 基础比较操作
  basic: ["eq", "ne", "is_null", "is_not_null"],
  // 字符串操作
  string: ["like", "start_with", "end_with", "not_like", "not_start_with", "not_end_with"],
  // 数值比较操作
  number: ["gt", "lt", "le", "ge", "between", "not_between"],
  // 集合操作
  collection: ["in", "not_in", "is_oneof", "is_n_oneof"],
  // 正则匹配操作
  regex: ["is_match", "match_any", "is_not_match", "match_all"],
  // 针对布尔类型
  boolean: ["is", "is_not"],
};

// 字段类型与规则的映射关系
export const FieldTypeRules = {
  string: [...new Set([...RULES.basic, ...RULES.string, ...RULES.regex])], // 字符串类型
  number: [...new Set([...RULES.basic, ...RULES.number])], // 数字类型
  boolean: RULES.boolean, // 布尔类型
  date: [...new Set([...RULES.basic, ...RULES.number])], // 日期类型
  array: [...new Set([...RULES.basic, ...RULES.collection])], // 数组类型（多选、复选框组等）
  object: [...new Set([...RULES.basic, ...RULES.string])], // 对象类型
};

const getItem = (
  data: Array<RuleItemData>,
  key: Key,
): RuleItemData | undefined => {
  let result: RuleItemData | undefined;
  for (let i = 0; i < data.length; i++) {
    if (data[i].key === key) {
      result = data[i];
      break;
    }
    result = getItem(data[i]?.children || [], key);
    if (result) break;
  }

  return result;
};

const getItemParent = (
  data: Array<RuleItemData>,
  key: Key,
): RuleItemData | undefined => {
  let result: RuleItemData | undefined;
  for (let i = 0; i < data.length; i++) {
    if (
      data[i].children &&
      data[i].children?.findIndex(item => {
        return item.key === key;
      }) !== -1
    ) {
      result = data[i];
      break;
    }
    result = getItemParent(data[i].children || [], key);
    if (result) break;
  }

  return result;
};

/**
 * 根据传入数据转换成真是rules数据
 * @param data
 * @return 组件实际实用的数据结构
 */
export const getConversionRules = (
  data: Array<RuleItemData>,
): Array<RuleItemData> => {
  const rules = cloneDeep(data);
  const loopData = (rules: RuleItemData[]): RuleItemData[] => {
    // 结束递归的条件
    if (!rules?.length) {
      return [];
    }
    (rules || []).forEach(rule => {
      rule.key = getUUID();
      rule.type = rule.children?.length ? "group" : "rule";
      if (rule.children?.length) {
        return loopData(rule.children || []);
      }
    });
    return data;
  };
  loopData(rules);
  return rules;
};

export function reducerRules(
  state: {
    editKey?: string;
    rules?: Array<RuleItemData>;
    realRules?: Array<RuleItemData>;
  },
  action: any,
) {
  const {
    type,
    values,
    fieldType = "",
    valueType = "",
    fieldName = "",
  } = action;
  switch (type) {
    case "Init":
      return {
        ...state,
        realRules: cloneDeep(values?.rules),
        ...values,
      };
    case "EditKey":
      return {
        ...state,
        editKey: values?.editKey,
      };
    case "Remove": {
      let { editKey } = state;
      const rules = cloneDeep(state?.rules || []);
      const { key } = values;
      const parentRule = getItemParent(rules, values?.key);
      const item = getItem(rules, key);
      // 删除数据是否未当前可编辑数据
      if (values?.ruleType === "group") {
        if (item?.children?.find(v => v.key === editKey)) {
          editKey = "";
        }
      }
      if (key === editKey) {
        editKey = "";
      }
      if (parentRule) {
        const pParent = getItemParent(rules, parentRule.key);
        // 仅剩余一条数据时，连同父级一起删除
        if (pParent && parentRule.children?.length === 1) {
          remove(pParent.children || [], item => {
            return item.key === parentRule?.key;
          });
        } else {
          remove(parentRule.children || [], item => {
            return item.key === key;
          });
        }
      } else {
        // 根
        remove(rules?.[0]?.children || [], item => {
          return !!item.key;
        });
        editKey = "";
      }
      return {
        ...state,
        editKey: editKey,
        realRules: cloneDeep(rules),
        rules: cloneDeep(rules),
        currentRule: item,
        lastAction: getUUID(),
      };
      break;
    }
    case "Add": {
      const { group, ruleType, index } = values;
      const parentRule = getItem(state?.rules || [], group);

      const ruleKey = getUUID();
      let editKey = ruleKey;

      if (parentRule) {
        const newItem = {
          key: ruleKey,
          type: ruleType,
        };
        if (ruleType === "group") {
          editKey = "_add" + getUUID();
          Object.assign(newItem, {
            link: "and",
            children: [
              {
                key: editKey,
                type: "rule",
              },
            ],
          });
        } else {
          editKey = "_add" + newItem.key;

          Object.assign(newItem, {
            key: "_add" + newItem.key,
          });
        }

        if (index === undefined) {
          parentRule.children?.push(newItem);
        } else {
          parentRule.children?.splice(index + 1, 0, newItem);
        }
      }
      return {
        ...state,
        rules: cloneDeep(state?.rules || []),
        editKey: editKey,
      };
      break;
    }
    case "Change": {
      const { key } = values;
      // 找到对应元素进行替换
      const item = getItem(state?.rules || [], key);
      if (item) {
        Object.assign(item, {
          ...values,
          key: key.substring(4),
          fieldType: fieldType,
          valueType: valueType,
          fieldName: fieldName,
        });
      }
      return {
        ...state,
        realRules: cloneDeep(state?.rules || []),
        rules: cloneDeep(state?.rules || []),
        currentRule: item,
        lastAction: getUUID(),
      };
      break;
    }
    case "SetValue": {
      const _values = getConversionRules([values]);
      return {
        ...state,
        rules: _values,
        realRules: _values,
        currentRule: _values?.[0],
        lastAction: getUUID(),
      };
      break;
    }
  }
  throw Error("Unknown action: " + action.type);
}
