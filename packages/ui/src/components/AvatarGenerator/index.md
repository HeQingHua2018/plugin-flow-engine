---
category: Components
title: 头像生成 # 组件的标题，会在菜单侧边栏展示
toc: content # 在页面右侧展示锚点链接
group: # 分组
  title: 小功能 # 所在分组的名称
  order: 4 # 分组排序，值越小越靠前
---

# AvatarGenerator 头像生成

## 介绍

传入图片数组，融合上传的图片、生成新的图片

## 示例

<code src="./demo/base.tsx">基础用法</code>

## API

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| hatArr | 帽子图片数组 | `string[]` | 默认帽子数组 |
| width | 画布宽度 | `number` | `200` |
| height | 画布高度 | `number` | `200` |
| fileName | 合成图片的文件名 | `string` | `'avatar-xxx'` |
