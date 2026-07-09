
# 管理器类

本文档介绍插件流程引擎中的核心管理器类，包括组件管理器和上下文管理器。

## 组件管理类

组件管理类`ComponentManager`，用于管理插件流程引擎中的组件实例和全局方法，提供注册、查询、调用和事件监听等功能。每个引擎实例拥有独立的 ComponentManager 实例（非单例）。

### 接口定义

#### ComponentInstance 组件实例接口

| 字段 | 类型 | 描述 |
|------|------|------|
| `[methodName: string]` | `ComponentMethod` | 组件实例的动态方法索引器 |

#### InstanceRegistration 实例注册信息接口

| 字段 | 类型 | 必需 | 描述 |
|------|------|------|------|
| `name` | `string` | 是 | 实例名称 |
| `ref` | `RefObject<any>` | 是 | 组件引用对象（自定义类型，兼容 React 和其他框架） |
| `methods` | `string[]` | 是 | 实例可调用方法名称数组 |
| `componentType` | `string` | 是 | 组件类型名称 |
| `registeredAt` | `Date` | 是 | 注册时间戳 |

#### GlobalMethodRegistration 全局方法注册信息接口

| 字段 | 类型 | 必需 | 描述 |
|------|------|------|------|
| `name` | `string` | 是 | 全局方法名称 |
| `method` | `(...args: any[]) => any` | 是 | 全局方法函数实现 |
| `description` | `string` | 否 | 方法描述信息 |
| `registeredAt` | `Date` | 是 | 注册时间戳 |

### 核心方法

#### 组件实例管理

| 方法名 | 签名 | 描述 |
|--------|------|------|
| `registerInstance` | `(name: string, ref: RefObject<any>): void` | 注册单个组件实例 |
| `registerInstances` | `(instances: { name: string; ref: RefObject<any> }[]): void` | 批量注册组件实例 |
| `unregisterInstance` | `(name: string): void` | 注销单个组件实例 |
| `unregisterInstances` | `(names: string[]): void` | 批量注销组件实例 |
| `getInstance` | `(name: string): InstanceRegistration \| null` | 获取指定名称的组件实例注册信息 |
| `getAllInstances` | `(): InstanceRegistration[]` | 获取所有已注册的组件实例 |
| `getInstancesByType` | `(componentType: string): InstanceRegistration[]` | 根据组件类型获取实例列表 |
| `hasInstance` | `(name: string): boolean` | 检查实例是否已注册 |
| `hasMethod` | `(instanceName: string, methodName: string): boolean` | 检查实例是否包含指定方法 |
| `getInstanceMethods` | `(name: string): string[]` | 获取实例的所有方法名 |
| `clearAllInstances` | `(): void` | 清空所有已注册的组件实例 |
| `clearAll` | `(): void` | 清空所有实例、元数据和全局方法 |
| `getConfig` | `(): { debug: boolean }` | 获取实例管理器配置 |
| `setConfig` | `(config: Partial<{ debug: boolean }>): void` | 设置实例管理器配置 |

#### 全局方法管理

| 方法名 | 签名 | 描述 |
|--------|------|------|
| `registerGlobalMethod` | `(name: string, method: (...args: any[]) => any, description?: string): void` | 注册全局方法 |
| `registerGlobalMethods` | `(methods: Array<{ name: string; method: Function; description?: string }>): { successCount: number; failures: Array<{ name: string; error: string }> }` | 批量注册全局方法 |
| `unregisterGlobalMethod` | `(name: string): void` | 注销全局方法 |
| `unregisterGlobalMethods` | `(names: string[]): void` | 批量注销全局方法 |
| `getGlobalMethod` | `(name: string): GlobalMethodRegistration \| null` | 获取全局方法 |
| `getAllGlobalMethods` | `(): GlobalMethodRegistration[]` | 获取所有全局方法 |
| `hasGlobalMethod` | `(name: string): boolean` | 检查全局方法是否已注册 |
| `clearAllGlobalMethods` | `(): void` | 清空所有已注册的全局方法 |

#### 组件元数据管理

| 方法名 | 签名 | 描述 |
|--------|------|------|
| `registerComponentMeta` | `(meta: ComponentMeta, ref?: RefObject<any>): void` | 注册组件元数据 |
| `unregisterComponentMeta` | `(componentName: string): void` | 注销组件元数据 |
| `getAllComponentMetas` | `(): ComponentMeta[]` | 获取所有已注册的组件元数据 |
| `getComponentMeta` | `(componentName: string): ComponentMeta \| undefined` | 获取指定组件的元数据 |
| `getAllEvents` | `(): Array<{ componentName: string; displayName: string; events: ComponentMeta['events'] }>` | 获取所有已注册事件 |
| `getComponentEvents` | `(componentName: string): ComponentMeta['events'] \| null` | 获取指定组件的事件列表 |
| `getEventDetail` | `(componentName: string, eventName: string): ComponentMeta['events'][number] \| null` | 获取指定组件的指定事件详情 |

#### 方法调用

| 方法名 | 签名 | 描述 |
|--------|------|------|
| `callMethod` | `(fullPath: string, ...params: any[]): Promise<any>` | 调用方法，支持实例方法、全局方法和window对象方法 |
| `callGlobalMethod` | `(name: string, ...params: any[]): Promise<any>` | 调用全局方法 |
| `callWindowMethod` | `(name: string, ...params: any[]): Promise<any>` | 调用window对象上的方法 |

#### 事件监听

| 方法名 | 签名 | 描述 |
|--------|------|------|
| `addEventListener` | `(event: InstanceManagerEvent, callback: EventListener): void` | 注册事件监听器 |
| `removeEventListener` | `(event: InstanceManagerEvent, callback: EventListener): void` | 移除事件监听器 |
| `addListener` | `(cb: () => void): () => void` | 添加变更监听器，返回移除监听器的函数 |
| `removeListener` | `(cb: () => void): void` | 移除变更监听器 |

## 上下文管理类

上下文管理器`ContextManager`，提供线程安全的上下文管理，支持变量存储、快照、事务和回滚。

### 核心方法

| 方法名 | 签名 | 描述 |
|--------|------|------|
| `initialize` | `(initialContext: ExecutionContext): void` | 初始化上下文 |
| `getContext` | `(): ExecutionContext` | 获取完整上下文对象的深拷贝 |
| `getVariable` | `(key: string, defaultValue?: T): T \| undefined` | 获取变量值，支持默认值 |
| `setVariable` | `(key: string, value: T, createSnapshot?: boolean): void` | 设置变量值 |
| `getVariables` | `(): Record<string, any>` | 获取所有变量的深拷贝 |
| `updateVariables` | `(variables: Record<string, any>, createSnapshot?: boolean): void` | 批量更新变量 |
| `deleteVariable` | `(key: string, createSnapshot?: boolean): void` | 删除变量 |
| `updateContext` | `(newContext: ExecutionContext): void` | 更新整个上下文 |
| `clear` | `(): void` | 清空上下文数据和快照 |
| `isInitialized` | `(): boolean` | 检查上下文是否已初始化 |
| `getExecutionId` | `(): string \| undefined` | 获取执行 ID |
| `getFlowId` | `(): string \| undefined` | 获取流程 ID |

#### 事务支持

| 方法名 | 签名 | 描述 |
|--------|------|------|
| `beginTransaction` | `(options?: { nested?: boolean }): string` | 开始新事务（支持嵌套），返回事务 ID |
| `commitTransaction` | `(transactionId?: string): void` | 提交当前事务 |
| `rollbackTransaction` | `(transactionId?: string): void` | 回滚当前事务 |
| `hasActiveTransaction` | `(): boolean` | 检查是否有活跃事务 |
| `getCurrentTransactionId` | `(): string \| null` | 获取当前事务 ID |
| `getTransactionDepth` | `(): number` | 获取事务栈深度（嵌套层级） |
| `getTransactionStats` | `(): { stackLength: number; activeTransactionId: string \| null; depth: number }` | 获取事务统计信息 |
| `clearTransactions` | `(): void` | 清空事务栈 |

#### 快照支持

| 方法名 | 签名 | 描述 |
|--------|------|------|
| `createSnapshot` | `(): ContextSnapshot` | 创建上下文快照 |
| `rollbackTo` | `(snapshot: ContextSnapshot): boolean` | 回滚到指定快照 |
| `rollback` | `(): boolean` | 回滚到上一个快照 |
| `getSnapshots` | `(): ContextSnapshot[]` | 获取所有快照列表 |
| `clearSnapshots` | `(): void` | 清空所有快照 |
| `getMaxSnapshots` | `(): number` | 获取最大快照数量（默认 100） |
| `setMaxSnapshots` | `(maxCount: number): void` | 设置最大快照数量 |
| `cleanupSnapshots` | `(keepCount?: number): void` | 清理过期快照（保留最近 N 条） |

#### 变更监听

| 方法名 | 签名 | 描述 |
|--------|------|------|
| `addListener` | `(listener: ContextListener): () => void` | 订阅上下文变更（返回取消订阅函数） |
| `removeListener` | `(listener: ContextListener): void` | 取消订阅上下文变更 |