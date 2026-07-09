# Hooks

## 概述

提供 React 自定义 Hook，用于在组件中便捷地集成流程引擎功能和注册业务组件方法。

## useFlowEngine

流程引擎自定义 Hook，在 React 组件中集成流程引擎功能的便捷方式。

### 接口定义

```typescript
interface UseFlowEngineOptions {
  flowData: FlowData;
  initialVariables?: Record<string, any>;
}

interface FlowExecuteOptions {
  nodeId?: string;
  timeout?: number;
  maxRetries?: number;
  retryDelay?: number;
  breakpoints?: string[];
}

interface UseFlowEngineResult {
  engine: PluginExecutionEngine | null;
  executeFlow: (options?: FlowExecuteOptions) => Promise<void>;
  executionResult: {
    status: boolean;
    message: string;
    variables?: Record<string, any>;
    errorInfo?: any;
    retries?: number;
    stoppedAt?: string;
  } | null;
  executionHistory: ExecutionHistory[];
  isExecuting: boolean;
  updateVariables: (variables: Record<string, any>) => void;

  createVersion: (options?: { description?: string; tags?: string[] }) => FlowVersion;
  getVersions: () => FlowVersion[];
  getVersion: (version: string) => FlowVersion | undefined;
  rollbackTo: (version: string) => FlowData;
  compareVersions: (versionA: string, versionB: string) => VersionDiff;
  deleteVersion: (version: string) => boolean;
  currentVersion?: FlowVersion;

  startDebug: (config?: { breakpoints?: string[]; stepByStep?: boolean }) => void;
  pauseDebug: () => Promise<void>;
  resumeDebug: () => void;
  stopDebug: () => void;
  getDebuggerStatus: () => DebuggerConfig;
  addBreakpoint: (nodeId: string) => void;
  removeBreakpoint: (nodeId: string) => void;
  getBreakpoints: () => string[];
  getExecutionTrace: () => any[];

  replay: (history: ExecutionHistory[], config?: ReplayConfig) => Promise<ReplayResult>;
  analyzeHistory: (history: ExecutionHistory[]) => any;
}
```

### 基本用法

```typescript
import { useFlowEngine } from '@chloehe/logic-engine-react';
import type { FlowData } from '@chloehe/logic-engine-common';

function FlowComponent({ flowData }: { flowData: FlowData }) {
  const {
    engine,
    executeFlow,
    executionResult,
    executionHistory,
    isExecuting,
    updateVariables,
  } = useFlowEngine({
    flowData,
    initialVariables: {
      userId: '123',
      userName: '张三',
    },
  });

  const handleExecute = async () => {
    await executeFlow();
  };

  const handleUpdateVariables = () => {
    updateVariables({
      userName: '李四',
    });
  };

  return (
    <div>
      <button onClick={handleExecute} disabled={isExecuting}>
        {isExecuting ? '执行中...' : '执行流程'}
      </button>
      <button onClick={handleUpdateVariables}>更新变量</button>
      {executionResult && (
        <div>
          <p>状态: {executionResult.status ? '成功' : '失败'}</p>
          <p>消息: {executionResult.message}</p>
        </div>
      )}
    </div>
  );
}
```

### 版本管理

```typescript
const { createVersion, getVersions, rollbackTo, compareVersions } = useFlowEngine({ flowData });

const handleCreateVersion = () => {
  const version = createVersion({
    description: '发布版本',
    tags: ['release', 'v1.0'],
  });
  console.log('创建版本:', version.versionId);
};

const handleRollback = () => {
  const versions = getVersions();
  if (versions.length > 0) {
    const previousVersion = versions[versions.length - 1];
    const rolledBackData = rollbackTo(previousVersion.versionId);
    console.log('回滚完成:', rolledBackData);
  }
};

const handleCompare = () => {
  const versions = getVersions();
  if (versions.length >= 2) {
    const diff = compareVersions(versions[0].versionId, versions[1].versionId);
    console.log('版本差异:', diff);
  }
};
```

### 调试功能

```typescript
const {
  startDebug,
  pauseDebug,
  resumeDebug,
  stopDebug,
  addBreakpoint,
  removeBreakpoint,
  getBreakpoints,
  getExecutionTrace,
} = useFlowEngine({ flowData });

const handleStartDebug = () => {
  addBreakpoint('node-1');
  addBreakpoint('node-2');
  startDebug({
    breakpoints: ['node-1', 'node-2'],
    stepByStep: true,
  });
};

const handlePause = async () => {
  await pauseDebug();
};

const handleResume = () => {
  resumeDebug();
};

const handleStop = () => {
  stopDebug();
  removeBreakpoint('node-1');
};

const handleGetTrace = () => {
  const trace = getExecutionTrace();
  console.log('执行轨迹:', trace);
};
```

### 重放功能

```typescript
const { replay, analyzeHistory, executionHistory } = useFlowEngine({ flowData });

const handleReplay = async () => {
  const result = await replay(executionHistory, {
    speed: 1,
    skipErrors: false,
  });
  console.log('重放结果:', result);
};

const handleAnalyze = () => {
  const analysis = analyzeHistory(executionHistory);
  console.log('历史分析:', analysis);
};
```

### 自动执行

当 `flowData.flow.auto` 为 `true` 时，引擎会在初始化完成后自动执行流程。

```typescript
const flowData: FlowData = {
  flow: {
    id: 'flow-1',
    name: '自动执行流程',
    auto: true,
  },
  nodes: [...],
  edges: [...],
};

const { executionResult } = useFlowEngine({ flowData });
```

## useExpose

组件暴露方法给规则引擎，一步完成注册元数据到 ComponentManager 和 useImperativeHandle 暴露 handler。

### 接口定义

```typescript
interface ExposedMethod {
  handler: (...args: any[]) => any;
  description?: string;
  params?: Record<string, string>;
}

interface UseExposeConfig {
  componentName: string;
  displayName?: string;
  category?: string;
  description?: string;
  methods: Record<string, ExposedMethod>;
}
```

### 基本用法

```typescript
import { useExpose } from '@chloehe/logic-engine-react';

function DemoButton() {
  const handleClick = (params: any) => {
    console.log('按钮点击:', params);
  };

  const handleReset = () => {
    console.log('按钮重置');
  };

  useExpose({
    componentName: 'DemoButton',
    displayName: '演示按钮',
    category: '交互组件',
    description: '演示用的按钮组件',
    methods: {
      onClick: {
        handler: handleClick,
        description: '按钮点击事件',
        params: {
          event: '点击事件对象',
        },
      },
      onReset: {
        handler: handleReset,
        description: '按钮重置事件',
      },
    },
  });

  return <button onClick={() => handleClick({})}>点击我</button>;
}
```

### 兼容旧调用方式

支持旧版调用方式，传入外部 ref：

```typescript
import { useExpose } from '@chloehe/logic-engine-react';
import { forwardRef } from 'react';

const DemoButton = forwardRef((props, ref) => {
  const handleClick = () => { /* ... */ };

  useExpose(ref, {
    componentName: 'DemoButton',
    methods: {
      onClick: {
        handler: handleClick,
        description: '按钮点击事件',
      },
    },
  });

  return <button onClick={handleClick}>点击我</button>;
});
```

## registerComponent

直接注册组件元数据（非 Hook 版本），适用于非 React 环境或需要手动注册的场景。

### 接口定义

```typescript
interface ComponentMeta {
  componentName: string;
  displayName?: string;
  category?: string;
  description?: string;
  events?: Array<{ eventName: string; description?: string; params?: Record<string, string> }>;
  methods?: Array<{ methodName: string; description?: string; params?: Record<string, string> }>;
}

registerComponent(meta: ComponentMeta): void
```

### 用法

```typescript
import { registerComponent } from '@chloehe/logic-engine-react';

registerComponent({
  componentName: 'DemoService',
  displayName: '演示服务',
  category: '服务组件',
  description: '演示用的服务组件',
  events: [
    { eventName: 'onStart', description: '服务启动事件' },
    { eventName: 'onStop', description: '服务停止事件' },
  ],
  methods: [
    { methodName: 'start', description: '启动服务' },
    { methodName: 'stop', description: '停止服务' },
  ],
});
```