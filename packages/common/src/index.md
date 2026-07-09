# 快速上手

## 概述

插件流程引擎公共库，提供通用工具、错误处理、操作符、事件系统、数据管理等基础功能、以及插件流程引擎的公共类型定义。

## 安装

```bash
npm install @chloehe/logic-engine-common
yarn add @chloehe/logic-engine-common
pnpm add @chloehe/logic-engine-common
```

## 主要模块

- **types**: 流程数据结构类型定义（FlowData, Node, Edge, ContextConfig, GlobalConfig 等）
- **constants**: 常量定义（NodeStatus, EdgeType, ParallelStrategy, IterationMode, BuiltInPluginNodeTypes）
- **operators**: 操作符注册与管理（基于 json-rules-engine 的扩展操作符）
- **managers**: ComponentManager（组件实例管理）、ContextManager（上下文管理）
- **errors**: FlowExecutionError 错误类与 errorHandler
- **utils/ReadWriteLock**: 读写锁与操作序列号生成器
