---
category: utils
title: 校验 # 组件的标题，会在菜单侧边栏展示
group: # 分组
  title: 工具函数 # 所在分组的名称
  order: 3 # 分组排序，值越小越靠前
---

| 名称                     | 描述                                  | 参数                     | 返回值    |
| ------------------------ | ------------------------------------- | ------------------------ | --------- |
| isMatchRegex             | 判断指定值是否匹配正则                | `(reg:RegExp,value:any)` | `boolean` |
| isUrl                    | 判断值是否为一个 url 地址             | `(value: string)`        | `boolean` |
| isEmail                  | 判断值是否为一个邮箱地址              | `(value: string)`        | `boolean` |
| isPhone                  | 判断值是否为一个联系电话              | `(value: string)`        | `boolean` |
| isIdNumber               | 判断值是否为一个身份证号              | `(value: string)`        | `boolean` |
| isTrue                   | 判断是否为 true                       | `(value: boolean)`       | `boolean` |
| isFalse                  | 判断值是否为 false                    | `(value: boolean)`       | `boolean` |
| isNumber                 | 判断值是否为数字                      | `(value: any)`           | `boolean` |
| isPositiveInteger        | 判断值是否为非零整数                  | `(value: any)`           | `boolean` |
| isPositiveIntegerAndZero | 判断值是否非负整数（包含 0）          | `(value: any)`           | `boolean` |
| isGeneral                | 判断值是否包含英文字母 、数字和下划线 | `(value: string)`        | `boolean` |
| isIncludeHtml            | 判断字符串是否包含 HTML 代码          | `(value: string)`        | `boolean` |
