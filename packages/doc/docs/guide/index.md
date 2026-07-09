---
title: 快速上手
order: 1
toc: menu
---

# 简介

Plugin Flow Engine 是一套插件化流程引擎解决方案，采用分层架构设计，支持跨框架使用：

- **插件化**：自定义每个节点的执行方式，内置多种节点插件（触发、动作、分支、并行、迭代、合并、结束）
- **流程引擎**：负责流程运行、状态维护、规则评估
- **上下文管理**：统一管理流程变量、组件实例、全局方法
- **操作符系统**：内置操作符支持，支持自定义扩展
- **调试与重放**：完整的流程调试和历史重放能力
- **模板管理**：流程模板定义、实例化和版本控制
- **完整类型定义**：提供 TypeScript 类型支持

## 安装

```bash
# 核心引擎（纯 TS，无框架依赖）
pnpm add @chloehe/logic-engine-core

# 公共库（类型定义、管理器、操作符）
pnpm add @chloehe/logic-engine-common

# UI 组件库（React + Ant Design）
pnpm add @chloehe/logic-engine-ui

# React 适配层（Hooks 封装）
pnpm add @chloehe/logic-engine-react
```

### 安装说明

- 安装 `@chloehe/logic-engine-core` 会自动安装 `@chloehe/logic-engine-common`
- 安装 `@chloehe/logic-engine-react` 会自动安装 core 和 common
- 安装 `@chloehe/logic-engine-ui` 会自动安装 core 和 common

## 架构分层

### 依赖关系

```
@chloehe/logic-engine-ui
    ├── @chloehe/logic-engine-core
    │       └── @chloehe/logic-engine-common
    └── @chloehe/logic-engine-common

@chloehe/logic-engine-react
    ├── @chloehe/logic-engine-core
    │       └── @chloehe/logic-engine-common
    └── @chloehe/logic-engine-common
```

### 各包职责

#### `@chloehe/logic-engine-common` — 公共库

**纯 TS，无框架依赖**，提供基础能力：

- **类型定义**：FlowData、ExecutionContext、PluginNodeType 等核心类型
- **操作符管理**：内置操作符注册、自定义操作符扩展
- **组件管理**：ComponentManager（组件实例注册、全局方法管理）
- **上下文管理**：ContextManager（变量存储、监听器机制）
- **错误处理**：FlowError 错误类
- **并发控制**：ReadWriteLock 工具

#### `@chloehe/logic-engine-core` — 核心引擎

**纯 TS，无框架依赖**，提供流程执行核心能力：

- **流程引擎**：PluginExecutionEngine（流程初始化、执行、状态管理）
- **插件系统**：PluginManager（插件注册、查找、生命周期管理）
- **节点插件**：BaseNodePlugin、内置插件（Trigger、Action、Branch、Parallel、Iteration、Merge、End）
- **规则引擎**：RuleEnginePool（规则引擎对象池）、RuleEngineCache（规则缓存）


#### `@chloehe/logic-engine-react` — React 适配层

**React 框架适配**，提供 Hooks 封装：

- **流程引擎 Hooks**：`useFlowEngine`（流程引擎初始化、执行、状态管理）
- **组件注册 Hooks**：`useExpose`（业务组件暴露方法）、`useComponentManager`（组件管理器）
- **上下文 Hooks**：`useContextManager`（上下文管理）、`useContextVariables`（变量订阅）
- **实例操作 Hooks**：`useInstance`、`useInstanceMethod`、`useGlobalMethod`

#### `@chloehe/logic-engine-ui` — UI 组件库

**React + Ant Design**，提供可视化组件：

- **流程设计器**：FlowView（基于 @xyflow/react）
- **规则编辑器**：RuleEditor（规则条件配置）
- **动态表单**：DynamicConfigForm（基于 schema 的表单渲染）
- **控制台**：FlowConsole（流程执行日志）
- **性能面板**：PerformancePanel（执行性能监控）
- **插件 UI 注册**：PluginUIRegistry（自定义节点组件注册，表单 schema 与插件类型绑定）
- **表单控件注入器**：FormWidgetInjector（控件注册与查找）

## 引用说明

### 核心依赖

| 依赖 | 用途 | 引入包 |
|------|------|-------|
| `json-rules-engine` | 规则评估引擎 | core, common, ui |
| `lodash` | 工具函数库 | common, ui |
| `moment` | 日期处理 | ui |
| `classnames` | CSS 类名拼接 | ui |

### React 生态依赖

| 依赖 | 用途 | 引入包 |
|------|------|-------|
| `react` / `react-dom` | React 框架 | react, ui |
| `antd` | UI 组件库 | ui |
| `@ant-design/icons` | 图标库 | ui |
| `@xyflow/react` | 流程图渲染 | ui |

### 开发工具

| 工具 | 用途 |
|------|------|
| `father` | 库构建工具 |
| `dumi` | 文档生成 |
| `jest` | 测试框架 |
| `eslint` | 代码检查 |
| `prettier` | 代码格式化 |

### 跨框架使用

**Vue / Svelte / 其他框架**：
- 直接使用 `@chloehe/logic-engine-core` + `@chloehe/logic-engine-common`
- 自行封装框架适配层（composables / hooks）
- 注册组件使用 `getGlobalComponentManager().registerInstance()`

**React 项目**：
- 使用 `@chloehe/logic-engine-react` 获得 Hooks 封装
- 使用 `@chloehe/logic-engine-ui` 获得可视化组件