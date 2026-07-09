
# 规则操作符

操作符是规则引擎中的核心概念，它们决定了如何评估规则条件。本模块提供了一系列内置操作符，并支持自定义操作符的注入。

## 操作符管理工具方法

`operators_util.ts` 文件提供了完整的操作符管理API，以下是所有可用的工具方法，按功能分类：

### 1. 操作符注册方法

| 方法名 | 功能描述 | 参数 | 返回值 |
|-------|---------|------|-------|
| `registerBuiltInOperators` | 注册框架自带的操作符 | engine: Engine | void |
| `registerExternalOperators` | 注册外部注入的操作符 | engine: Engine | void |
| `registerAllOperators` | 注册所有操作符（内置+外部注入） | engine: Engine | void |

### 2. 操作符清除方法

| 方法名 | 功能描述 | 参数 | 返回值 |
|-------|---------|------|-------|
| `clearExternalOperators` | 清除所有外部注入的操作符 | 无 | void |
| `clearEngineOperators` | 清除json-rules-engine内置操作符 | engine: Engine | void |
| `clearBuiltInOperators` | 清除框架自带的操作符 | engine: Engine | void |
| `clearAllOperators` | 清除所有操作符（内置+外部注入+json-rules-engine默认操作符） | engine: Engine | void |

### 3. 操作符扩展方法

| 方法名 | 功能描述 | 参数 | 返回值 |
|-------|---------|------|-------|
| `injectOperator` | 注入自定义操作符 | name: string, evaluator: OperatorEvaluator<any, any> | void |

### 4. 操作符查询方法

| 方法名 | 功能描述 | 参数 | 返回值 |
|-------|---------|------|-------|
| `getBuiltInOperators` | 获取框架自带的操作符列表 | 无 | string[] |
| `getExternalOperators` | 获取外部注入的操作符列表 | 无 | string[] |

## 使用示例

### 基本使用示例

```javascript
import { Engine } from 'json-rules-engine';
import { operatorUtil, getBuiltInOperators, getExternalOperators } from '@chloehe/logic-engine-common';

// 创建规则引擎实例
const engine = new Engine();

// 注册所有操作符（内置+外部注入）
operatorUtil.registerAllOperators(engine);

// 或者选择性注册
operatorUtil.registerBuiltInOperators(engine); // 只注册内置操作符
operatorUtil.registerExternalOperators(engine); // 只注册外部注入的操作符

// 清除操作符
operatorUtil.clearExternalOperators(); // 清除外部注入的操作符
operatorUtil.clearBuiltInOperators(engine); // 清除框架自带的操作符
operatorUtil.clearEngineOperators(engine); // 清除json-rules-engine默认操作符
operatorUtil.clearAllOperators(engine); // 清除所有操作符

// 注入自定义操作符
operatorUtil.injectOperator('customOperator', (factValue, jsonValue) => {
  // 自定义操作符逻辑
  return factValue === jsonValue[0];
});

// 获取操作符列表（独立导出的方法）
const builtInOps = getBuiltInOperators(); // 获取所有内置操作符名称
const externalOps = getExternalOperators(); // 获取所有外部注入的操作符名称
console.log('内置操作符:', builtInOps);
console.log('外部操作符:', externalOps);
```

### 高级使用示例

```javascript
import { Engine } from 'json-rules-engine';
import { operatorUtil } from '@chloehe/logic-engine-common';

// 创建规则引擎实例
const engine = new Engine();

// 清除默认操作符，只使用自定义操作符
operatorUtil.clearEngineOperators(engine);

// 注入自定义操作符
operatorUtil.injectOperator('isEven', (factValue) => {
  return typeof factValue === 'number' && factValue % 2 === 0;
});

// 注册外部注入的操作符
operatorUtil.registerExternalOperators(engine);

// 定义规则
const rule = {
  conditions: {
    any: [
      {
        fact: 'number',
        operator: 'isEven',
        value: []
      }
    ]
  },
  event: {
    type: 'evenNumberDetected'
  }
};

engine.addRule(rule);

// 运行引擎
const facts = { number: 4 };
engine.run(facts).then(results => {
  console.log(results.events); // [{ type: 'evenNumberDetected' }]
});
```

## 内置操作符

以下是规则引擎提供的所有内置操作符，按功能分类列出：

> [!NOTE]
> **关于数组参数的说明**
>
> 1. **多值匹配支持**：数组形式允许操作符同时支持单值和多值匹配场景，例如，`eq` 操作符不仅可以检查单个值是否相等，还可以检查一个值是否与数组中的任何一个值相等
> 2. **统一参数格式**：统一采用数组格式作为比较值参数，简化了API设计和使用体验
> 3. **灵活区间定义**：对于 `between` 等需要多个边界值的操作符，数组形式提供了天然的容器
> 4. **扩展性考虑**：数组形式为未来可能的多条件组合提供了基础

> [!IMPORTANT]
> **value 参数格式注意事项**
>
> | 操作符类型 | value 格式要求 | 示例 |
> |-----------|--------------|------|
> | 框架自定义操作符（`eq`、`ne`、`like`、`gt`、`lt`、`in`、`between` 等） | **必须是数组** | `{ "fact": "username", "operator": "eq", "value": ["admin"] }` |
> | json-rules-engine 内置操作符（`equal`、`notEqual`、`contains`、`lessThan`、`greaterThan` 等） | 字符串/数字/数组均可 | `{ "fact": "username", "operator": "equal", "value": "admin" }` |
> | 特殊操作符（`is`、`is_null`、`is_not`、`is_not_null`） | **不需要 value** | `{ "fact": "isActive", "operator": "is", "value": [] }` |
>
> 使用 rule-editor 组件配置规则时，会自动将 value 转换为数组格式，与框架自定义操作符兼容。



### 1. 字符串操作符

| 操作符名称 | 功能描述 | 参数类型 | JSON 格式示例 |
|-----------|---------|---------|------------|
| `like` | 字符串包含，检查字符串是否包含指定子串 | string | `{ "fact": "name", "operator": "like", "value": ["张"] }` |
| `not_like` | 字符串不包含，检查字符串是否不包含指定子串 | string | `{ "fact": "description", "operator": "not_like", "value": ["敏感"] }` |
| `start_with` | 字符串前缀匹配，检查字符串是否以指定前缀开始 | string | `{ "fact": "email", "operator": "start_with", "value": ["admin@"] }` |
| `not_start_with` | 字符串非前缀匹配，检查字符串是否不以指定前缀开始 | string | `{ "fact": "phone", "operator": "not_start_with", "value": ["139"] }` |
| `end_with` | 字符串后缀匹配，检查字符串是否以指定后缀结束 | string | `{ "fact": "filename", "operator": "end_with", "value": [".pdf", ".doc"] }` |
| `not_end_with` | 字符串非后缀匹配，检查字符串是否不以指定后缀结束 | string | `{ "fact": "url", "operator": "not_end_with", "value": [".exe", ".zip"] }` |

### 2. 集合操作符

| 操作符名称 | 功能描述 | 参数类型 | JSON 格式示例 |
|-----------|---------|---------|------------|
| `in` | 集合包含，检查值是否在指定集合中 | 任意类型 | `{ "fact": "role", "operator": "in", "value": ["admin", "editor"] }` |
| `not_in` | 集合不包含，检查值是否不在指定集合中 | 任意类型 | `{ "fact": "status", "operator": "not_in", "value": ["blocked", "deleted"] }` |

### 3. 数值比较操作符

| 操作符名称 | 功能描述 | 参数类型 | JSON 格式示例 |
|-----------|---------|---------|------------|
| `gt` | 大于，检查数值是否大于指定值 | number/date | `{ "fact": "score", "operator": "gt", "value": [60] }` |
| `lt` | 小于，检查数值是否小于指定值 | number/date | `{ "fact": "age", "operator": "lt", "value": [18] }` |
| `ge` | 大于等于，检查数值是否大于等于指定值 | number/date | `{ "fact": "salary", "operator": "ge", "value": [10000] }` |
| `le` | 小于等于，检查数值是否小于等于指定值 | number/date | `{ "fact": "temperature", "operator": "le", "value": [37.5] }` |

### 4. 布尔判断操作符

| 操作符名称 | 功能描述 | 参数类型 | JSON 格式示例 |
|-----------|---------|---------|------------|
| `is` | 真值判断，检查值是否为真 | boolean | `{ "fact": "isActive", "operator": "is", "value": [] }` |
| `is_not` | 假值判断，检查值是否为假 | boolean | `{ "fact": "isBlocked", "operator": "is_not", "value": [] }` |

### 5. 枚举匹配操作符

| 操作符名称 | 功能描述 | 参数类型 | JSON 格式示例 |
|-----------|---------|---------|------------|
| `is_oneof` | 枚举包含，检查值是否匹配枚举中的任一值 | 任意类型 | `{ "fact": "color", "operator": "is_oneof", "value": ["red", "blue", "green"] }` |
| `is_n_oneof` | 枚举不包含，检查值是否不匹配枚举中的任一值 | 任意类型 | `{ "fact": "status", "operator": "is_n_oneof", "value": ["pending", "cancelled"] }` |

### 6. 空值判断操作符

| 操作符名称 | 功能描述 | 参数类型 | JSON 格式示例 |
|-----------|---------|---------|------------|
| `is_null` | 空值判断，检查值是否为 null、undefined 或空字符串 | 任意类型 | `{ "fact": "email", "operator": "is_null", "value": [] }` |
| `is_not_null` | 非空判断，检查值是否不为 null、undefined 和空字符串 | 任意类型 | `{ "fact": "name", "operator": "is_not_null", "value": [] }` |

### 7. 正则匹配操作符

| 操作符名称 | 功能描述 | 参数类型 | JSON 格式示例 |
|-----------|---------|---------|------------|
| `is_match` | 正则匹配任一，检查值是否匹配任一正则表达式 | string | `{ "fact": "phone", "operator": "is_match", "value": ["^1[3-9]\\d{9}$"] }` |
| `match_any` | 正则匹配任一（is_match 的别名） | string | `{ "fact": "email", "operator": "match_any", "value": ["@gmail\\.com$", "@hotmail\\.com$"] }` |
| `is_not_match` | 正则不匹配，检查值是否不匹配任何正则表达式 | string | `{ "fact": "password", "operator": "is_not_match", "value": ["^\\d+$", "^[a-zA-Z]+$"] }` |
| `match_all` | 正则匹配全部，检查值是否匹配所有正则表达式 | string | `{ "fact": "password", "operator": "match_all", "value": ["^.{8,}$", "[A-Z]", "[0-9]"] }` |

### 8. 区间比较操作符

| 操作符名称 | 功能描述 | 参数类型 | JSON 格式示例 |
|-----------|---------|---------|------------|
| `between` | 区间包含，检查值是否在指定区间内（闭区间） | number/date | `{ "fact": "score", "operator": "between", "value": [60, 100] }` |
| `not_between` | 区间不包含，检查值是否不在指定区间内 | number/date | `{ "fact": "age", "operator": "not_between", "value": [18, 65] }` |
