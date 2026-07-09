# @chloehe/logic-engine-core

插件流程引擎核心库，提供流程执行引擎、插件管理、Hook、流程版本/调试/重放等核心功能。

## 目录结构

```
src/
├── hooks/              # React Hooks
├── plugins/            # 节点插件（内置插件）
├── scripts/            # 插件生成脚本
├── templates/          # 流程模板管理
├── utils/              # 核心工具
├── constants.ts        # 常量定义
├── types.ts            # 类型定义
└── index.ts            # 聚合导出
```

## 核心模块

### 执行引擎

#### PluginExecutionEngine
插件化流程执行引擎，负责流程运行与状态维护。

#### PluginManager
插件管理器，支持插件注册、查询、卸载和热加载。

### 内置插件

| 插件名称 | 功能描述 |
|---------|---------|
| Trigger | 触发器节点，流程起点 |
| Action | 动作节点，执行业务逻辑 |
| Branch | 分支节点，条件路由 |
| Merge | 合并节点，汇聚分支 |
| Parallel | 并行节点，并发执行 |
| Iteration | 迭代节点，循环执行 |
| End | 结束节点，流程终点 |

### Hooks

- `useFlowEngine` - 流程引擎 Hook，封装初始化、执行和状态管理
- `useFlowRegister` - 流程注册 Hook

### 工具模块

#### FlowValidator
流程定义验证器，确保流程配置合法。

#### FlowVersion
流程版本管理，支持版本创建、回滚和对比。

#### FlowDebugger
流程调试器，支持断点、单步执行和远程调试。

#### FlowReplay
流程重放器，基于历史记录重现流程执行过程。

#### Logger
结构化日志系统，支持多级别日志输出。

#### TemplateManager
流程模板管理，支持模板创建和复用。

#### ConcurrencyControl
并发控制，基于 ReadWriteLock 和 OperationSequence。

#### RuleEngineCache
规则引擎缓存，提升规则匹配性能。

## 安装

```bash
pnpm add @chloehe/logic-engine-core
```

## 使用示例

```tsx
import { useFlowEngine } from '@chloehe/logic-engine-core';

const { engine, executeFlow, executionHistory } = useFlowEngine({
  flowData: yourFlowData,
  initialVariables: { userId: '1' },
  components: [
    { name: 'Demo1', ref: demo1Ref },
  ],
});

await executeFlow();
```