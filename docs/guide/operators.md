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
injectOperator('hasKey', (factValue, jsonValue) => {
  if (!factValue || typeof factValue !== 'object') return false;
  const key = String(jsonValue);
  return Object.prototype.hasOwnProperty.call(factValue, key);
});
```
- 签名：`(factValue, jsonValue, almanac?) => boolean`（同步返回 `boolean`）
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
    { fact: 'username', operator: 'startsWith', value: { value: 'he', caseInsensitive: true } },
  ],
};

const scoreBetween = {
  all: [
    { fact: 'score', operator: 'between', value: { min: 60, max: 100, inclusive: true } },
  ],
};
```

## 内置增强操作符
- 已自动注册，开箱可用：
  - `startsWith`：字符串前缀匹配，支持 `{ value, caseInsensitive }`
  - `endsWith`：字符串后缀匹配，支持 `{ value, caseInsensitive }`
  - `contains`：字符串或数组包含判断
  - `regex`：正则匹配，支持 `{ pattern, flags }`
  - `between`：数值区间判断，支持 `{ min, max, inclusive }`
  - `isEmpty`：为空（null/undefined/空串/空数组/空对象）
  - `notEmpty`：非空判断
  - `hasKey`：对象是否包含指定键

## 最佳实践
- 操作符保持纯函数，避免副作用；外部数据通过 `fact` 动态提供。
- 在应用启动或插件注册阶段统一调用 `injectOperator`，避免运行时频繁更新。
- 操作符键名语义清晰，与团队约定统一。
- 对复杂逻辑优先封装为可复用 `fact`（变量）或插件逻辑，操作符侧仅做布尔判断。

## 相关类型速查
- [TopLevelCondition](http://localhost:8003/guide/types#toplevelcondition)
- [OperatorFn](http://localhost:8003/guide/types#operatorfn)
- [FlowDefinition](http://localhost:8003/guide/types#flowdefinition)
- [Node](http://localhost:8003/guide/types#node)、[Edge](http://localhost:8003/guide/types#edge)

## 参考
- 类型速查：[类型速查](http://localhost:8003/guide/types)
- 流程数据定义（示例与最佳实践）：[流程数据定义](http://localhost:8003/guide/flow)