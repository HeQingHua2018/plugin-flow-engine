# 快速上手

## 概述

插件流程引擎核心库，提供流程引擎、插件系统、事件系统、数据管理（上下文、变量、状态）等基础功能。

> `事件系统`：业务组件通过 `useExpose` 注册事件到 `ComponentManager`，引擎自动发现并调用组件暴露的方法。<br/>
> `数据管理`：提供上下文、变量、状态等数据管理功能，支持插件在流程执行过程中读写数据。

## 安装

```bash
# 使用 npm
npm install @chloehe/logic-engine-core @chloehe/logic-engine-react

# 使用 yarn
yarn add @chloehe/logic-engine-core @chloehe/logic-engine-react

# 使用 pnpm
pnpm add @chloehe/logic-engine-core @chloehe/logic-engine-react
```

## 核心模块

| 模块 | 包 | 描述 |
|------|------|------|
| [PluginExecutionEngine](./PluginExecutionEngine.md) | `@chloehe/logic-engine-core` | 插件执行引擎核心类，负责流程的执行与状态管理 |
| [PluginManager](./pluginManager.md) | `@chloehe/logic-engine-core` | 插件管理器，负责插件的注册、查询、卸载、热加载和生命周期管理 |
| [Hooks](./hooks.md) | `@chloehe/logic-engine-react` | React 自定义 Hook，提供流程引擎集成和组件方法注册能力 |

## 基础用法

### 创建流程引擎

```typescript
import { PluginExecutionEngine } from '@chloehe/logic-engine-core';

const engine = new PluginExecutionEngine();

engine.initialize(flowData);

const result = await engine.executeFlow();
```

### 注册插件

```typescript
import { createPluginManager } from '@chloehe/logic-engine-core';

const pluginManager = createPluginManager();
pluginManager.registerPlugin(new MyCustomPlugin());
```

### React 集成

```typescript
import { useFlowEngine } from '@chloehe/logic-engine-react';

const { executeFlow, executionResult, isExecuting } = useFlowEngine({ flowData });
```