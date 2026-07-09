---
category: utils
title: 时间格式化 # 组件的标题，会在菜单侧边栏展示
group: # 分组
  title: 工具函数 # 所在分组的名称
  order: 1 # 分组排序，值越小越靠前
---

### 概述

`formatTime`：将时间戳格式化成指定的日期时间格式。

### 参数

| 参数名    | 类型   | 是否必填 | 默认值                  | 说明                                                       |
| --------- | ------ | -------- | ----------------------- | ---------------------------------------------------------- |
| timestamp | number | 是       | -                       | 要格式化的时间戳，单位为秒                                 |
| format    | string | 否       | `'YYYY-MM-DD hh:mm:ss'` | 要格式化成的日期时间格式，默认为 `'YYYY-MM-DD hh:mm:ss'`。 |

### 返回值

| 类型   | 描述                       |
| ------ | -------------------------- |
| string | 格式化后的日期时间字符串。 |

### 示例

```ts
import { formatTime } from '@chloehe/utils';
const datetime = new Date('2025-04-18 11:16:32').getTime();
const dateStr = formatTime(datetime, 'YYYY年MM月DD日 hh:mm:ss');
console.log(dateStr); // 2025年04月18日 11:16:32
const dateStr1 = formatTime(datetime, 'YYYY-MM-DD');
console.log(dateStr1); // 2025-04-18
const dateStr2 = formatTime(datetime, 'YYYY/MM/DD');
console.log(dateStr2); // 2025/04/18
```
