# @chloehe/logic-engine-common

插件流程引擎公共库，提供通用类型定义、操作符、错误处理、组件/上下文管理器等基础功能。

## 目录结构

```
src/
├── constants/          # 常量定义
├── errors/             # 错误处理类
├── hooks/              # React Hooks
├── managers/           # 管理器（组件、上下文）
├── operators/          # 规则引擎操作符
├── types/              # 类型定义
├── utils/              # 工具类
└── index.ts            # 聚合导出
```

## 核心模块

### types

核心类型定义，包括：

- `FlowData` - 流程数据结构
- `Node` - 节点定义
- `Edge` - 边定义
- `PluginNodeType` - 插件节点类型
- `events` - 事件类型定义

### operators

基于 json-rules-engine 的 26 个扩展操作符，包含常用的比较、逻辑、集合操作。

### managers

#### ComponentManager
组件实例和全局方法管理，支持组件注册、查询和方法调用。

#### ContextManager
线程安全的上下文管理器，支持事务、快照和回滚功能。

### hooks

- `useComponentManager` - 组件管理器 Hook
- `useContextManager` - 上下文管理器 Hook

### utils

- `ReadWriteLock` - 读写锁实现
- 操作序列号生成器

### errors

- `FlowExecutionError` - 流程执行错误类

## 安装

```bash
pnpm add @chloehe/logic-engine-common
```

## 使用示例

```ts
import { ContextManager, ComponentManager, useContextManager } from '@chloehe/logic-engine-common';

const ctxManager = new ContextManager();
ctxManager.set('userId', '123');

const compManager = new ComponentManager();
compManager.register('demo', { name: 'Demo', ref: demoRef });
```