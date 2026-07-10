---
category: Components
title: RuleEditor 条件规则编辑器 # 组件的标题，会在菜单侧边栏展示
toc: content # 在页面右侧展示锚点链接
group: # 分组
  title: 基础组件 # 所在分组的名称
  order: 1 # 分组排序，值越小越靠前
---

# RuleEditor 条件规则编辑器

RuleEditor是一个功能强大的条件规则编辑器，支持复杂规则的创建、编辑和展示。它基于json-rules-engine实现，提供了丰富的操作符和灵活的规则组合能力，可用于构建复杂的业务规则配置界面。

## 特点

- 支持嵌套规则组（AND/OR关系）
- 提供丰富的操作符集合（等于、不等于、大于、小于、包含、匹配等）
- 支持多种数据类型（字符串、数字、布尔值、日期、数组、对象）
- 灵活的字段配置和自定义规则
- 编辑/显示两种模式切换
- 自动规则格式化和转换

## 代码演示

### 基础使用

<code src="./demo/basic.tsx"></code>

### 显示模式

<code src="./demo/show.tsx"></code>

## API

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| fields | 字段数据 | [RuleFieldDataType[]](#rulefielddatatype) | `[]` |
| rules | 规则数据 | [RuleItemType](#ruleitemtype) | |
| mode | 渲染模式 | `edit \| show` | `edit` |
| onChange | 值变更事件 | `(all: RuleItemType, current: RuleItemType) => void` | |

### RuleFieldDataType

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| key | 唯一标识 | `string` | |
| type | 字段类型([FieldType](#fieldtype)) | `string` | |
| label | 显示名称 | `string` | |
| fieldName | 字段名称 | `string` | |
| props | 不同类型字段配置 | `object` | |
| rules | 指定展示规则 | `Array<RuleType>` | `["eq", "ne", "is_null", "is_not_null"]` |

### RuleItemType

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| key | 唯一标识 | `string` | |
| type | 规则类别 | `group \| rule` | |
| link | 关系(仅type为group时生效) | `and \| or` | |
| rule | 规则([RuleType](#ruletype)) | `string` | |
| fieldName | 字段名 | `string` | |
| fieldType | 字段类型([FieldType](#fieldtype)) | `string` | |
| value | 值 | `any[]` | |
| children | 子项(规则类别为group时才存在) | [RuleItemType](#ruleitemtype) | |
| desc | 规则语义化描述 | `string` | |

### RuleType

RuleType是RuleEditor支持的所有操作符类型，基于json-rules-engine实现，包含以下几类操作符：

| 类别     | 操作符                | 说明                 | 示例                                       |
| -------- | --------------------- | -------------------- | ------------------------------------------ |
| 基础比较 | `eq`                  | 等于                 | `{ fieldName: 'status', rule: 'eq', value: ['active'] }` |
|          | `ne`                  | 不等于               | `{ fieldName: 'status', rule: 'ne', value: ['inactive'] }` |
| 布尔判断 | `is`                  | 为真值               | `{ fieldName: 'isActive', rule: 'is' }`    |
|          | `is_not`              | 为假值               | `{ fieldName: 'isDeleted', rule: 'is_not' }` |
| 数值比较 | `gt`                  | 大于                 | `{ fieldName: 'age', rule: 'gt', value: [18] }` |
|          | `ge`                  | 大于等于             | `{ fieldName: 'age', rule: 'ge', value: [18] }` |
|          | `lt`                  | 小于                 | `{ fieldName: 'score', rule: 'lt', value: [60] }` |
|          | `le`                  | 小于等于             | `{ fieldName: 'score', rule: 'le', value: [100] }` |
|          | `between`             | 在区间内（包含边界） | `{ fieldName: 'age', rule: 'between', value: [18, 65] }` |
|          | `not_between`         | 不在区间内           | `{ fieldName: 'age', rule: 'not_between', value: [0, 17] }` |
| 字符串操作 | `start_with`          | 开头是               | `{ fieldName: 'name', rule: 'start_with', value: ['Mr.'] }` |
|          | `end_with`            | 结尾是               | `{ fieldName: 'name', rule: 'end_with', value: ['Jr.'] }` |
|          | `like`                | 包含                 | `{ fieldName: 'name', rule: 'like', value: ['test'] }` |
|          | `not_like`            | 不包含               | `{ fieldName: 'name', rule: 'not_like', value: ['admin'] }` |
|          | `not_start_with`      | 不是以...开头        | `{ fieldName: 'name', rule: 'not_start_with', value: ['Guest'] }` |
|          | `not_end_with`        | 不是以...结尾        | `{ fieldName: 'name', rule: 'not_end_with', value: ['_test'] }` |
| 集合操作 | `in`                  | 在集合中             | `{ fieldName: 'role', rule: 'in', value: ['admin', 'editor'] }` |
|          | `not_in`              | 不在集合中           | `{ fieldName: 'role', rule: 'not_in', value: ['guest'] }` |
|          | `isoneof`             | 等于集合中任一值     | `{ fieldName: 'status', rule: 'isoneof', value: ['active', 'pending'] }` |
|          | `isnoneof`            | 不等于集合中任何值   | `{ fieldName: 'role', rule: 'isnoneof', value: ['guest'] }` |
| 正则匹配 | `is_match`/`matchAny` | 匹配任一正则表达式   | `{ fieldName: 'email', rule: 'is_match', value: ['^[^@]+@[^@]+\.[^@]+$'] }` |
|          | `is_not_match`        | 不匹配任何正则表达式 | `{ fieldName: 'username', rule: 'is_not_match', value: ['^admin$'] }` |
| 空值检查 | `is_null`             | 为空（null/undefined/空字符串） | `{ fieldName: 'middleName', rule: 'is_null' }` |
|          | `is_not_null`         | 不为空               | `{ fieldName: 'email', rule: 'is_not_null' }` |

### FieldType

FieldType定义了支持的字段数据类型：

```ts
type FieldType = 'string' | 'number' | 'boolean' | 'date' | 'array' | 'object';
```

| 类型     | 说明     | 示例值               |
| -------- | -------- | -------------------- |
| string   | 字符串   | 'Hello World'        |
| number   | 数字     | 42                   |
| boolean  | 布尔值   | true/false           |
| date     | 日期     | '2023-01-01'         |
| array    | 数组     | [1, 2, 3]            |
| object   | 对象     | { name: 'John' }     |

## ref 方法

RuleEditor组件通过ref暴露以下方法：

| 名称             | 描述                 | 参数                                            | 返回值                        |
| ---------------- | -------------------- | ----------------------------------------------- | ----------------------------- |
| getValue         | 获取规则数据         |                                                 | [RuleItemType](#ruleitemtype) |
| getFormattedRules | 获取格式化后的规则数据 |                                                 | `TopLevelCondition`           |
| setValue         | 设置规则数据         | (values: [RuleItemType](#ruleitemtype)) => void |                               |

## 规则评估

RuleEditor内置了规则评估功能，可以使用`evaluateRule`函数来评估规则是否匹配事实数据：

```ts
import { RuleEditor } from '@chloehe/logic-engine-ui';
const { evaluateRule } = RuleEditor.Util;

// 示例：评估规则
const rules = {
  type: 'group',
  link: 'and',
  children: [
    {
      type: 'rule',
      fieldName: 'age',
      rule: 'gt',
      value: [18]
    },
    {
      type: 'rule',
      fieldName: 'status',
      rule: 'eq',
      value: ['active']
    }
  ]
};

const facts = {
  age: 25,
  status: 'active'
};

// 评估规则是否匹配
const result = await evaluateRule(rules, facts); // true

// 也可以直接使用组件的getFormattedRules方法获取格式化后的规则进行评估
const formattedRules = ruleEditorRef.current.getFormattedRules();
// 然后使用json-rules-engine进行评估
```

## 注意事项

1. **规则结构**：顶级规则必须是`group`类型
2. **值类型**：规则中的`value`必须是数组类型
3. **错误处理**：规则评估过程中如遇到错误，会抛出异常，使用时请确保适当处理
4. **性能考虑**：对于复杂的嵌套规则，评估性能可能会受到影响，请合理设计规则结构
5. **正则表达式**：使用正则表达式操作符时，请确保提供有效的正则表达式模式
