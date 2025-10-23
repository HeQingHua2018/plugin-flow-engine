---
title: 规则操作符
order: 5
toc: menu
---

# 规则操作符

## 总览
- 基于 `json-rules-engine` 的 `Engine.addOperator` 扩展规则表达能力。
- 支持“内置增强操作符”与“外部自定义操作符”两类。
- 在流程的 `Node.config.conditions` 或 `Edge.conditions` 中直接使用操作符。
- 相关类型：[TopLevelCondition](./types.md#toplevelcondition)（规则结构），详见 [类型速查](./types.md)。

## 注入 API
```ts
import { injectOperator } from 'plugin-flow-engine';

// 示例：注入一个“是否为手机号”的操作符
injectOperator('isMobile', (factValue) => {
  return typeof factValue === 'string' && /^1[3-9]\d{9}$/.test(factValue);
});

// 示例：注入一个“对象是否包含某键”的操作符
injectOperator('hasKey', (factValue, compareValue) => {
  if (!factValue || typeof factValue !== 'object') return false;
  const key = String(compareValue);
  return Object.prototype.hasOwnProperty.call(factValue, key);
});
```
- 签名：`(factValue, compareValue) => boolean`（同步返回 `boolean`）
- 作用域：注入一次后，在后续规则评估中生效；每次评估都会创建新的引擎并统一注册。

## 使用示例
- 在节点或边上配置条件：
```ts
const isVipBranch = {
  all: [
    { fact: 'isVip', operator: 'equal', value: true },
  ],
};

const usernameStartsWith = {
  all: [
    { fact: 'username', operator: 'start_with', value: 'he' },
  ],
};

const scoreBetween = {
  all: [
    { fact: 'score', operator: 'between', value: [60, 100] },
  ],
};

const arrInclude = {
  all: [
    { fact: 'tags', operator: 'include', value: ['vip', 'paid'] },
  ],
};

const regexMatch = {
  all: [
    { fact: 'email', operator: 'regex', value: '^\\w+@example\\.com$' },
  ],
};
```

## 内置增强操作符
- 已自动注册，开箱可用（与当前实现保持一致）：
  - `start_with`：字符串前缀匹配。`value` 为字符串；非字符串会转为字符串比较。
  - `end_with`：字符串后缀匹配。`value` 为字符串；非字符串会转为字符串比较。
  - `include`：包含判断。支持两种场景：
    - 字符串包含子串：`fact`、`value` 都为字符串。
    - 数组包含元素：`fact` 为数组；`value` 可为单值或数组（数组时要求全部包含）。
  - `not_include`：不包含判断，对应 `include` 的逻辑取反。
  - `regex`：正则匹配。`value` 支持 `RegExp` 或正则字符串（如 `"^abc$"`）。
  - `between`：数值区间判断。`value` 为 `[min, max]` 数组；包含边界。
  - `not_between`：数值不在区间。`value` 为 `[min, max]` 数组；排除边界。
  - `is_empty`：为空（null/undefined/空串/空数组/空对象）。
  - `not_empty`：非空判断。
  - `has_key`：对象是否包含指定键。`value` 为字符串或字符串数组（数组时要求全部包含）。

> 注：当前内置操作符不支持大小写不敏感或 `inclusive` 等扩展配置；如需此类能力，可通过 `injectOperator` 注入自定义操作符实现。

## 最佳实践
- 操作符保持纯函数，避免副作用；外部数据通过 `fact` 动态提供。
- 在应用启动或插件注册阶段统一调用 `injectOperator`，避免运行时频繁更新。
- 操作符键名语义清晰，与团队约定统一。
- 对复杂逻辑优先封装为可复用 `fact`（变量）或插件逻辑，操作符侧仅做布尔判断。

## 相关类型速查
- [TopLevelCondition](./types.md#toplevelcondition)
- [OperatorFn](./types.md#operatorfn)
- [FlowDefinition](./types.md#flowdefinition)
- [Node](./types.md#node)、[Edge](./types.md#edge)

## 参考
- 类型速查：[类型速查](./types.md)
- 流程数据定义（示例与最佳实践）：[流程数据定义](./flow.md)