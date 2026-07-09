---
category: Plugins
title: 如何自定义插件
toc: menu
group:
  title: 开发
  order: 2
---

# 创建自定义插件

自定义插件是插件流程引擎的强大功能，允许用户根据业务需求扩展流程执行能力。

### 1. 创建插件类

```typescript
import { BaseNodePlugin } from '@chloehe/logic-engine-core';
import type { Node, ExecutionHistory } from '@chloehe/logic-engine-core';
import type { PluginExecutionEngine } from '@chloehe/logic-engine-core';
import { NodeStatus } from '@chloehe/logic-engine-core';

class MyCustomPlugin extends BaseNodePlugin {
  // 定义插件类型和名称
  pluginNodeType = 'MY_CUSTOM_TYPE';
  pluginNodeTypeName = '自定义插件';

  async executeNode(
    node: Node,
    pluginExecutionEngine: PluginExecutionEngine,
    historyItem?: ExecutionHistory
  ): Promise<boolean> {
    try {
      const config = node.data?.config || {};

      if (historyItem) {
        historyItem.status = NodeStatus.SUCCESS;
        historyItem.endTime = new Date();
        historyItem.engineResult = '自定义插件执行成功';
      }

      return true;
    } catch (error) {
      if (historyItem) {
        historyItem.status = NodeStatus.FAILED;
        historyItem.endTime = new Date();
        historyItem.engineResult = error instanceof Error ? error.message : String(error);
      }
      return false;
    }
  }
}
```

### 2. 注册自定义插件

插件支持多种注册方式：

#### 方式一：通过执行器注册（默认到全局）

```typescript
import { PluginExecutionEngine } from '@chloehe/logic-engine-core';
import { MyCustomPlugin } from './MyCustomPlugin';

const engine = new PluginExecutionEngine();
engine.registerPlugin(new MyCustomPlugin());
```

默认使用全局插件管理器，注册的插件对所有流程可见。

#### 方式二：使用自定义插件管理器（隔离场景）

```typescript
import { createPluginManager, PluginExecutionEngine } from '@chloehe/logic-engine-core';
import { MyCustomPlugin } from './MyCustomPlugin';

// 创建独立的插件管理器
const customPM = createPluginManager();
customPM.registerPlugin(new MyCustomPlugin());

// 将自定义管理器传给执行器
const engine = new PluginExecutionEngine({
  pluginManager: customPM,
});
```

使用自定义插件管理器可以实现流程间的插件隔离，适用于多租户或不同流程使用不同插件版本的场景。

#### 方式三：全局注册

```typescript
import { getGlobalPluginManager } from '@chloehe/logic-engine-core';
import { MyCustomPlugin } from './MyCustomPlugin';

getGlobalPluginManager().registerPlugin(new MyCustomPlugin());
```

全局注册的插件对所有使用默认配置的执行器可见。

### 3. 在流程中使用自定义插件

```typescript
const flowDefinition = {
  flow: { id: 'my-flow', name: 'My Flow' },
  nodes: [
    {
      id: 'custom-node',
      type: 'custom',
      data: {
        pluginNodeType: 'MY_CUSTOM_TYPE',
        name: '我的自定义节点',
        config: {}
      },
      position: { x: 100, y: 100 }
    }
  ],
  edges: []
};
```

### 4. 插件开发最佳实践

1. **继承基础插件类**：优先继承 BaseNodePlugin，自动继承通用的状态管理和路由逻辑
2. **错误处理**：始终妥善处理可能出现的异常
3. **状态管理**：准确更新节点状态，便于监控和调试
4. **性能优化**：避免在 executeNode 中执行耗时操作

### 5. 常见问题排查

1. **插件未找到错误**：确保插件类型名称正确，且已成功注册
2. **节点执行失败**：检查 executeNode 方法的错误处理逻辑
3. **类型错误**：确保导入的类型与实际使用的类型一致
