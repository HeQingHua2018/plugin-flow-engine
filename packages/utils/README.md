# @chloehe/utils

TypeScript 工具函数库，提供字符串处理、时间格式化、数组分组、树形数据操作、数据校验等功能。纯 TypeScript 实现，零依赖，可单独使用。

## 安装

```bash
npm install @chloehe/utils
yarn add @chloehe/utils
pnpm add @chloehe/utils
```

## 特性

- 📦 零依赖，纯 TypeScript 实现
- 📝 完整的类型定义
- 🎯 按需导入，支持 Tree Shaking
- 🔧 包含字符串、时间、数组、树形、校验等常用工具

## 模块

| 模块 | 功能 | 导出方式 |
|------|------|----------|
| `string` | 字符串处理（随机字符串、UUID、换行） | 命名导出 |
| `formatTime` | 时间格式化 | 默认导出 |
| `groupBy` | 数组分组 | 默认导出 |
| `tree` | 树形数据操作（转换、查找、扁平化） | 命名导出 |
| `validation` | 数据校验（邮箱、电话、身份证等） | 命名导出 |

## 使用示例

### 字符串处理

```typescript
import { generateRandomString, getUUID, linefeed } from '@chloehe/utils';

// 生成随机字符串（默认 32 位）
generateRandomString(); // 'xYkM2pQr8TzW4aS6dF9hJ2kL5nP7qR'

// 生成指定长度随机字符串
generateRandomString(16); // 'aB3cD5eF7gH9jK'

// 生成 UUID
getUUID(); // 'a1b2c3d4e5f67890'

// 按长度添加换行
linefeed('这是一段很长的文字需要换行显示', 10);
```

### 时间格式化

```typescript
import formatTime from '@chloehe/utils';

formatTime(Date.now()); // '2026-07-06 14:30:00'
formatTime(Date.now(), 'YYYY-MM-DD'); // '2026-07-06'
formatTime(Date.now(), 'hh:mm:ss'); // '14:30:00'
```

### 数组分组

```typescript
import groupBy from '@chloehe/utils';

const data = [
  { name: '张三', sex: 'F', age: 20 },
  { name: '李四', sex: 'M', age: 22 },
  { name: '王五', sex: 'F', age: 30 },
];

// 按属性名分组
groupBy(data, 'sex');
// { F: [{ name: '张三', ... }, { name: '王五', ... }], M: [{ name: '李四', ... }] }

// 按函数分组
groupBy(data, (p) => p.age);
// { 20: [...], 22: [...], 30: [...] }

// 按组合键分组
groupBy(data, (p) => `${p.sex}-${p.age}` as const);
```

### 树形数据操作

```typescript
import { list2Tree, findNode, flatTreeData, getParent } from '@chloehe/utils';

// 数组转树形
const tree = list2Tree([
  { key: '1', title: '根节点', parent: '' },
  { key: '1-1', title: '子节点', parent: '1' },
]);

// 查找节点
findNode(tree, '1-1');

// 扁平化树形
flatTreeData(tree);

// 获取父节点
getParent('1-1', tree);
```

### 数据校验

```typescript
import { isEmail, isPhone, isIdNumber, isUrl } from '@chloehe/utils';

isEmail('test@example.com'); // true
isPhone('13812345678'); // true
isIdNumber('110101199003077777'); // true
isUrl('https://example.com'); // true
```

## API 参考

详细 API 文档请查看 [文档站点](https://flow.chloehe.cn)。

## 许可证

MIT