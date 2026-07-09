# @chloehe/logic-engine-react

插件流程引擎的 React 适配层，提供一组 React Hooks 用于在 React 应用中集成流程引擎能力。

## 安装

```bash
pnpm add @chloehe/logic-engine-react
```

## 核心 Hooks

### useFlowEngine

流程引擎主 Hook，封装流程引擎的初始化、执行和状态管理。

```tsx
import { useFlowEngine } from '@chloehe/logic-engine-react';

const {
  engine,
  executeFlow,
  executionResult,
  executionHistory,
  isExecuting,
  updateVariables,
  createVersion,
  startDebug,
  replay,
} = useFlowEngine({
  flowData,
  initialVariables: { userId: '123' },
});
```

**返回值**

| 属性 | 类型 | 描述 |
|------|------|------|
| engine | `PluginExecutionEngine \| null` | 流程引擎实例 |
| executeFlow | `(options?) => Promise<void>` | 执行流程 |
| executionResult | `object \| null` | 执行结果 |
| executionHistory | `ExecutionHistory[]` | 执行历史记录 |
| isExecuting | `boolean` | 是否正在执行 |
| updateVariables | `(variables) => void` | 更新上下文变量 |
| createVersion | `(options?) => FlowVersion` | 创建版本 |
| getVersions | `() => FlowVersion[]` | 获取所有版本 |
| rollbackTo | `(version) => FlowData` | 回滚到指定版本 |
| compareVersions | `(versionA, versionB) => VersionDiff` | 比较版本差异 |
| deleteVersion | `(version) => boolean` | 删除版本 |
| startDebug | `(config?) => void` | 启动调试 |
| pauseDebug | `() => Promise<void>` | 暂停调试 |
| resumeDebug | `() => void` | 恢复调试 |
| stopDebug | `() => void` | 停止调试 |
| addBreakpoint | `(nodeId) => void` | 添加断点 |
| removeBreakpoint | `(nodeId) => void` | 移除断点 |
| getBreakpoints | `() => string[]` | 获取断点列表 |
| getExecutionTrace | `() => any[]` | 获取执行轨迹 |
| replay | `(history, config?) => Promise<ReplayResult>` | 重放历史记录 |
| analyzeHistory | `(history) => any` | 分析历史记录 |

### useExpose

业务组件暴露 Hook，合三为一：events/methods/handlers 统一成 methods，一步完成注册元数据到 ComponentManager + useImperativeHandle 暴露 handler。

```tsx
import { useExpose, forwardRef } from '@chloehe/logic-engine-react';

const MyComponent = forwardRef((props, ref) => {
  useExpose(ref, {
    componentName: 'MyComponent',
    displayName: '我的组件',
    category: '表单',
    description: '自定义表单组件',
    methods: {
      submit: {
        handler: () => console.log('submit'),
        description: '提交表单',
        params: {},
      },
      reset: {
        handler: () => console.log('reset'),
        description: '重置表单',
        params: {},
      },
    },
  });
  
  return <div>My Component</div>;
});
```

### useComponentManager

组件管理器相关 Hooks。

```tsx
import {
  useComponentManager,
  useRegisterInstance,
  useRegisterGlobalMethod,
  useInstance,
  useCallGlobalMethod,
} from '@chloehe/logic-engine-react';

const manager = useComponentManager();

useRegisterInstance('MyComponent', ref);

useRegisterGlobalMethod('showToast', (msg) => toast(msg), '显示提示');

const instance = useInstance('MyComponent');

const showToast = useCallGlobalMethod('showToast');
```

**Hooks 列表**

| Hook | 描述 |
|------|------|
| `useComponentManager` | 获取或创建 ComponentManager 实例 |
| `useRegisterInstance` | 注册组件实例 |
| `useRegisterInstances` | 批量注册组件实例 |
| `useRegisterGlobalMethod` | 注册全局方法 |
| `useRegisterGlobalMethods` | 批量注册全局方法 |
| `useInstance` | 获取组件实例 |
| `useInstanceMethod` | 获取组件实例方法 |
| `useGlobalMethod` | 获取全局方法 |
| `useCallGlobalMethod` | 获取调用全局方法的函数 |

### useContextManager

上下文管理器相关 Hooks。

```tsx
import {
  useContextManager,
  useContextVariables,
  useContextVariable,
  useUpdateVariables,
} from '@chloehe/logic-engine-react';

const manager = useContextManager();

const variables = useContextVariables(manager);

const userId = useContextVariable(manager, 'userId');

const updateVariables = useUpdateVariables(manager);

updateVariables({ userId: '456' });
```

**Hooks 列表**

| Hook | 描述 |
|------|------|
| `useContextManager` | 获取或创建 ContextManager 实例 |
| `useContext` | 获取完整执行上下文 |
| `useContextVariables` | 获取所有上下文变量 |
| `useContextVariable` | 获取单个上下文变量 |
| `useContextVariablesSelective` | 选择性获取多个上下文变量 |
| `useUpdateVariables` | 更新上下文变量 |
| `useUpdateContext` | 更新完整上下文 |
| `useInitializeContext` | 初始化上下文 |
| `useClearContext` | 清除上下文 |
| `useSetContextVariable` | 设置单个上下文变量 |
| `useContextSubscription` | 订阅上下文变化 |

## 导出列表

```ts
export { useFlowEngine } from './hooks/useFlowEngine';
export { useExpose, registerComponent } from './hooks/useFlowRegister';
export {
  useComponentManager,
  useRegisterInstance,
  useRegisterInstances,
  useRegisterGlobalMethod,
  useRegisterGlobalMethods,
  useInstance,
  useInstanceMethod,
  useGlobalMethod,
  useCallGlobalMethod,
} from './hooks/useComponentManager';
export {
  useContextManager,
  useContext,
  useContextVariables,
  useContextVariable,
  useContextVariablesSelective,
  useUpdateVariables,
  useUpdateContext,
  useInitializeContext,
  useClearContext,
  useSetContextVariable,
  useContextSubscription,
} from './hooks/useContextManager';
```

## 依赖

- `@chloehe/logic-engine-core`: 流程引擎核心包
- `@chloehe/logic-engine-common`: 公共模块（类型定义、管理器等）
- `react`: React 核心库
- `react-dom`: React DOM 渲染