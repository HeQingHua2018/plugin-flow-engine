---
title: 介绍
order: 1
toc: menu
---

## 快速上手

1. 安装

```bash
npm install plugin-flow-engine
```

2. 使用

```ts
import { PluginManagerInstance } from 'plugin-flow-engine';

// 在应用启动时注册自定义插件（示例）
PluginManagerInstance().registerAllPlugin([
  // new MyNodePlugin(),
  // new MyOtherPlugin(),
]);
```

## 特别说明

- 📦 开箱即用，将注意力集中在组件开发和文档编写上
- 📋 丰富的 Markdown 扩展，不止于渲染组件 demo
- 🏷 基于 TypeScript 类型定义，自动生成组件 API
- 🎨 主题轻松自定义，还可创建自己的 Markdown 组件
- 📱 支持移动端组件库研发，内置移动端高清渲染方案
- 📡 一行命令将组件资产数据化，与下游生产力工具串联
