# 插件管理器

## 概述

PluginManager 是插件流程引擎的插件管理核心类，负责插件的注册、查询、卸载、热加载和生命周期管理。

执行引擎默认使用全局插件管理器，也可通过构造函数传入自定义管理器实现插件隔离。

## 构造函数

```typescript
new PluginManager(callbacks?: PluginLifecycleCallbacks, options?: { skipBuiltInRegistration?: boolean })
```

| 参数 | 类型 | 描述 |
|------|------|------|
| `callbacks` | `PluginLifecycleCallbacks` | 生命周期回调 |
| `options.skipBuiltInRegistration` | `boolean` | 是否跳过内置插件自动注册（默认 false） |

## 核心方法

### 插件注册

| 方法 | 签名 | 描述 |
|------|------|------|
| `registerPlugin` | `(plugin: NodePlugin, force?: boolean, silent?: boolean) => void` | 注册单个节点插件 |
| `registerAllPlugin` | `(plugins: NodePlugin[], force?: boolean, silent?: boolean) => void` | 批量注册多个节点插件 |

#### registerPlugin

```typescript
registerPlugin(plugin: NodePlugin, force?: boolean, silent?: boolean): void
```

| 参数 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `plugin` | `NodePlugin` | - | 要注册的插件实例 |
| `force` | `boolean` | `false` | 是否强制注册（覆盖已存在的插件） |
| `silent` | `boolean` | `false` | 是否静默注册（不打印日志） |

### 插件卸载

| 方法 | 签名 | 描述 |
|------|------|------|
| `unregisterPlugin` | `(pluginNodeType: PluginNodeType, reason?: PluginUnloadReason) => void` | 卸载指定类型的插件 |
| `unregisterAllPlugin` | `(pluginNodeTypes: PluginNodeType[], reason?: PluginUnloadReason) => void` | 批量卸载多个插件 |
| `unregisterAllPlugins` | `(reason?: PluginUnloadReason) => void` | 卸载所有插件 |

#### unregisterPlugin

```typescript
unregisterPlugin(pluginNodeType: PluginNodeType, reason?: PluginUnloadReason): void
```

| 参数 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `pluginNodeType` | `PluginNodeType` | - | 插件类型 |
| `reason` | `PluginUnloadReason` | `USER_REQUEST` | 卸载原因 |

### 插件查询

| 方法 | 签名 | 描述 |
|------|------|------|
| `getPlugin` | `(pluginNodeType: PluginNodeType) => NodePlugin` | 获取指定类型的插件实例 |
| `getAllPlugins` | `() => NodePlugin[]` | 获取所有已注册的插件实例数组 |
| `hasPlugin` | `(pluginNodeType: PluginNodeType) => boolean` | 检查插件是否已注册 |
| `getAllPluginNodeTypes` | `() => Array<{ value: PluginNodeType; label: string }>` | 获取所有已注册的插件类型列表（含标签） |
| `getPluginMetadata` | `(pluginNodeType: PluginNodeType) => PluginMetadata \| undefined` | 获取插件元数据 |
| `getAllPluginMetadata` | `() => PluginMetadata[]` | 获取所有插件的元数据 |
| `getPluginCount` | `() => number` | 获取插件数量 |

### 热加载

| 方法 | 签名 | 描述 |
|------|------|------|
| `hotReloadPlugin` | `(plugin: NodePlugin, options?: { force?: boolean; skipCompatibilityCheck?: boolean }) => Promise<PluginHotReloadEvent>` | 热加载插件（开发模式下使用） |
| `isPluginLoading` | `(pluginNodeType: PluginNodeType) => boolean` | 检查插件是否正在热加载中 |
| `getPluginHotReloadStatus` | `(pluginNodeType: PluginNodeType) => PluginHotReloadStatus \| undefined` | 获取插件的热加载状态 |

#### hotReloadPlugin

```typescript
hotReloadPlugin(plugin: NodePlugin, options?: {
  force?: boolean;
  skipCompatibilityCheck?: boolean;
}): Promise<PluginHotReloadEvent>
```

| 参数 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `plugin` | `NodePlugin` | - | 新的插件实例 |
| `options.force` | `boolean` | `false` | 是否强制热加载 |
| `options.skipCompatibilityCheck` | `boolean` | `false` | 是否跳过版本兼容性检查 |

### 版本兼容性

| 方法 | 签名 | 描述 |
|------|------|------|
| `checkVersionCompatibility` | `(metadata: PluginMetadata) => VersionCompatibilityResult` | 检查插件版本是否与当前核心版本兼容 |
| `setCurrentCoreVersion` | `(version: string) => void` | 设置当前核心版本（静态方法） |
| `getCurrentCoreVersion` | `() => string` | 获取当前核心版本（静态方法） |

### 节点执行

| 方法 | 签名 | 描述 |
|------|------|------|
| `getExecuteNodeStatus` | `(node: Node, pluginExecutionEngine: PluginExecutionEngine) => Promise<NodeStatus \| null>` | 获取节点执行状态 |
| `executeNode` | `(node: Node, pluginExecutionEngine: PluginExecutionEngine, historyItem?: ExecutionHistory) => Promise<boolean>` | 执行节点逻辑 |
| `getNextNodeId` | `(node: Node, edges: Edge[], pluginExecutionEngine: PluginExecutionEngine, historyItem?: ExecutionHistory) => Promise<string \| string[] \| null>` | 获取下一个节点 ID |

### 工具方法

| 方法 | 签名 | 描述 |
|------|------|------|
| `clearAllPlugins` | `() => void` | 清空所有插件（用于测试或系统重置） |
| `exportPluginStatus` | `() => { plugins: Array<{ nodeType: PluginNodeType; typeName: string; metadata: PluginMetadata; hotReloadStatus: PluginHotReloadStatus }>; totalCount: number }` | 导出插件状态信息（用于调试和监控） |

## 创建方式

```typescript
import { createPluginManager, PluginManager } from '@chloehe/logic-engine-core';

// 推荐：使用工厂函数创建
const pluginManager = createPluginManager();

// 或直接实例化
const pluginManager = new PluginManager();

// 带生命周期回调
const pluginManager = new PluginManager({
  onPluginRegistered: (plugin, metadata) => {
    console.log('插件注册:', plugin.pluginNodeType);
  },
  onPluginUnloaded: (pluginNodeType, reason) => {
    console.log('插件卸载:', pluginNodeType, reason);
  },
  onPluginHotReloaded: (event) => {
    console.log('插件热加载:', event);
  },
});

// 跳过内置插件注册
const pluginManager = new PluginManager(undefined, { skipBuiltInRegistration: true });
```

## 全局插件管理器

全局插件管理器是一个单例，执行引擎默认使用它：

```typescript
import { getGlobalPluginManager } from '@chloehe/logic-engine-core';

// 获取全局插件管理器
const globalPM = getGlobalPluginManager();

// 注册全局插件
globalPM.registerPlugin(new MyCustomPlugin());

// 获取所有插件类型（UI 组件使用）
const nodeTypes = globalPM.getAllPluginNodeTypes();
// 返回格式: [{ value: 'Trigger', label: '触发节点' }, { value: 'Action', label: '动作节点' }, ...]
```

## 插件隔离

通过自定义插件管理器实现流程间的插件隔离：

```typescript
import { createPluginManager, PluginExecutionEngine } from '@chloehe/logic-engine-core';

// 创建独立的插件管理器
const customPM = createPluginManager();
customPM.registerPlugin(new TenantSpecificPlugin());

// 将自定义管理器传给执行器
const engine = new PluginExecutionEngine({
  pluginManager: customPM,
});

// 这个引擎只能看到 customPM 中注册的插件
```

## 类型定义

### PluginMetadata

```typescript
interface PluginMetadata {
  id: string;
  name: string;
  version: string;
  description?: string;
  author?: string;
  minCoreVersion?: string;
  maxCoreVersion?: string;
  registeredAt: Date;
  lastHotReloadAt?: Date;
  loadCount: number;
}
```

### PluginHotReloadStatus

```typescript
enum PluginHotReloadStatus {
  LOADING = 'loading',
  SUCCESS = 'success',
  FAILED = 'failed',
  UNLOADING = 'unloading',
  UNLOADED = 'unloaded',
}
```

### PluginUnloadReason

```typescript
enum PluginUnloadReason {
  USER_REQUEST = 'user_request',
  VERSION_INCOMPATIBLE = 'version_incompatible',
  LOAD_FAILED = 'load_failed',
  HOT_RELOAD_REPLACE = 'hot_reload_replace',
  SYSTEM_CLEANUP = 'system_cleanup',
}
```

### PluginLifecycleCallbacks

```typescript
interface PluginLifecycleCallbacks {
  onPluginRegistered?: (plugin: NodePlugin, metadata: PluginMetadata) => void;
  onPluginUnloaded?: (pluginNodeType: PluginNodeType, reason: PluginUnloadReason) => void;
  onPluginHotReloaded?: (event: PluginHotReloadEvent) => void;
}
```

### PluginHotReloadEvent

```typescript
interface PluginHotReloadEvent {
  pluginNodeType: PluginNodeType;
  status: PluginHotReloadStatus;
  oldPlugin?: NodePlugin;
  newPlugin?: NodePlugin;
  error?: string;
  timestamp: Date;
}
```