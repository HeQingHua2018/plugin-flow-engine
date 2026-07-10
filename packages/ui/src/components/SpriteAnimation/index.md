---
category: Components
title: 雪碧图序列帧 # 组件的标题，会在菜单侧边栏展示
toc: content # 在页面右侧展示锚点链接
group: # 分组
  title: 小功能 # 所在分组的名称
  order: 3 # 分组排序，值越小越靠前
---

# SpriteAnimation 雪碧图序列帧动画组件

## 介绍

雪碧图序列帧动画组件

## 示例

<code src="./demo/base.tsx">基础用法</code>

## API

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| spriteImageUrl | 图片地址 | `string` | |
| frameCount | 总帧数 | `number` | |
| frameWidth | 每一帧图片宽度 | `number` | |
| frameHeight | 每一帧图片高度 | `number` | |
| animationSpeed | 动画速度，控制帧更新的频率（毫秒/帧） | `number` | `30` |
