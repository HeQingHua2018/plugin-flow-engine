---
category: Components
title: 文字跟随背景纹理 # 组件的标题，会在菜单侧边栏展示
toc: content # 在页面右侧展示锚点链接
group: # 分组
  title: 小功能 # 所在分组的名称
  order: 4 # 分组排序，值越小越靠前
---

# TextForBg 文字跟随背景纹理

## 介绍

文字跟随背景纹理变化

## 示例

<code src="./demo/base.tsx">基础用法</code>

## API

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| imageUrl | 图片地址 | `string` | |
| text | 文本 | `string` | `'TEXT'` |
| textColor | 文本颜色 | `string` | `'#00f'` |
| textOpacity | 透明度 | `number` | `0.9` |
| fontSize | 文本大小 | `string \| number \| undefined` | `'10em'` |
| fontWeight | 文本粗细 | `string \| number \| undefined` | `'bold'` |
| textAnchor | 文本对齐方式 | `"start" \| "middle" \| "end" \| "inherit" \| undefined` | `'middle'` |
| alignmentBaseline | 文本基线对齐方式 | `'auto' \| 'baseline' \| 'before-edge' \| 'text-before-edge' \| 'middle' \| 'central' \| 'after-edge' \| 'text-after-edge' \| 'ideographic' \| 'alphabetic' \| 'hanging' \| 'mathematical' \| 'inherit' \| undefined` | `'middle'` |
| x | 文本位置横坐标 | `number \| string \| undefined` | `'50%'` |
| y | 文本位置纵坐标 | `number \| string \| undefined` | `'50%'` |
