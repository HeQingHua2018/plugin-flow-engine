
/**
 * 导出插件管理器类及工厂函数，用于管理节点插件的注册、查找和执行
 */
export { PluginManager, createPluginManager, getGlobalPluginManager } from './utils/PluginManager';
/**
 * 导出插件管理器类型定义，用于类型检查和 IDE 自动完成
 */
export type { PluginManager as PluginManagerType } from './utils/PluginManager';
/**
 * 导出插件热加载相关类型定义
 */
export type {
  PluginMetadata,
  VersionCompatibilityResult,
  PluginHotReloadEvent,
  PluginUnloadEvent,
  PluginLifecycleCallbacks,
} from './utils/PluginManager';
export {
  PluginHotReloadStatus,
  PluginUnloadReason,
} from './utils/PluginManager';
/**
 * 导出内建节点插件实例，用于流程定义和执行
 */
export { getBuiltInPluginInstances } from './plugins';

/**
 * 导出插件化流程执行引擎核心类，负责协调各节点插件的执行和流程控制
 */
export { PluginExecutionEngine } from './utils/PluginExecutionEngine';
/**
 * 导出核心枚举常量和类型定义，用于流程定义和执行
 */
export * from './constants';
export type * from './types';
/**
 * 导出基础节点插件类，用于自定义节点插件的开发
 * 所有自定义节点插件都应继承自该类，实现其抽象方法
 */
export { BaseNodePlugin } from './plugins/BaseNodePlugin';
export type { NodePlugin } from './plugins/NodePlugin';

/**
 * 导出流程版本管理器，用于流程版本控制
 */
export { flowVersionManager, FlowVersionManager, abTestManager, ABTestManager } from './utils/FlowVersion';
export type {
  FlowVersion,
  VersionDiff,
  // 发布版本相关类型
  PublishStatus,
  PublishVersion,
  PublishHistory,
  PublishConfig,
  // A/B 测试相关类型
  TrafficAllocationStrategy,
  TrafficAllocation,
  ABTestGroup,
  ABTestMetrics,
  ABTestConfig,
  ABTestStatus,
  ABTestAssignment,
  ABTestComparison,
} from './utils/FlowVersion';

/**
 * 导出流程调试器，用于流程调试
 */
export { flowDebugger, FlowDebugger, remoteDebugServer, RemoteDebugServer } from './utils/FlowDebugger';
export type {
  DebuggerConfig,
  DebugStatus,
  ExecutionTraceItem,
  // 远程调试相关类型
  DebugMessageType,
  DebugMessage,
  DebugRequest,
  DebugResponse,
  RemoteDebugClient,
  RemoteDebugSession,
  WebSocketServerConfig,
  // 调试消息类型
  ConnectRequest,
  ConnectResponse,
  SetBreakpointRequest,
  RemoveBreakpointRequest,
  ClearBreakpointsRequest,
  GetBreakpointsRequest,
  BreakpointsResponse,
  StartDebugRequest,
  PauseDebugRequest,
  ResumeDebugRequest,
  StepOverRequest,
  StepOutRequest,
  SetVariableRequest,
  GetVariablesRequest,
  VariablesResponse,
  GetContextRequest,
  ContextResponse,
  GetStatusRequest,
  StatusResponse,
  GetTraceRequest,
  TraceResponse,
  ClearTraceRequest,
  GetStatsRequest,
  StatsResponse,
  PausedEvent,
  ResumedEvent,
  StoppedEvent,
  BreakpointHitEvent,
  VariableUpdatedEvent,
  ErrorMessage,
} from './utils/FlowDebugger';

/**
 * 导出规则引擎缓存，用于规则评估结果缓存
 */
export { RuleEngineCache, globalRuleEngineCache, RuleCacheKeyGenerator } from './utils/RuleEngineCache';
export type { RuleCacheOptions, CachedRuleData } from './utils/RuleEngineCache';

/**
 * 导出规则引擎对象池，用于复用规则引擎实例
 */
export { RuleEnginePool, globalRuleEnginePool } from './utils/RuleEnginePool';
export type { RuleEnginePoolOptions, PoolStats } from './utils/RuleEnginePool';

/**
 * 导出 LRU 缓存算法，用于高效的缓存管理
 */
export { LRUCache } from './utils/LRUCache';
export type { LRUCacheOptions, CacheStats } from './utils/LRUCache';

/**
 * 导出增强规则引擎缓存，集成 LRU 缓存和规则引擎池
 */
export { EnhancedRuleEngineCache, globalEnhancedRuleEngineCache } from './utils/EnhancedRuleEngineCache';
export type { EnhancedCacheOptions, CachedRuleData as EnhancedCachedRuleData, EnhancedCacheStats } from './utils/EnhancedRuleEngineCache';

/**
 * 导出流程重放器，用于基于执行历史重放流程
 */
export { flowReplayer, FlowReplayer, memoryReplayConfigStorage, MemoryReplayConfigStorage } from './utils/FlowReplay';
export type {
  ReplayConfig,
  ReplayResult,
  ReplayMode,
  NodeFilterStrategy,
  NodeFilter,
  ExceptionInjection,
  ReplayDetails,
  ReplayPreview,
  ReplayConfigStorage,
} from './utils/FlowReplay';

/**
 * 导出并发控制工具，用于管理并发执行
 */
export { ReadWriteLock, OperationSequence, ConcurrencyDebugger, concurrencyDebugger } from './utils/ConcurrencyControl';
export type { ReadWriteLockStatus, ReadWriteLockOptions } from './utils/ConcurrencyControl';

/**
 * 导出模板管理器，用于流程模板的定义、实例化和版本控制
 */
export { templateManager, TemplateManager } from './templates/TemplateManager';
export type {
  TemplateDefinition,
  TemplateParameter,
  TemplateVersion,
  TemplateInstance,
  TemplateLibraryEntry,
  TemplateLibraryStatus,
  TemplateSearchCriteria,
  TemplateSearchResult,
  TemplateVersionConfig,
  // 模板预览相关
  TemplatePreview,
  // 模板导入导出相关
  TemplateExportFormat,
  TemplateImportFormat,
  TemplateImportOptions,
  TemplateImportResult,
  // 分类和标签统计
  CategoryStats,
  TagStats,
  // 高级搜索
  AdvancedTemplateSearchCriteria,
  AdvancedTemplateSearchResult,
} from './templates/TemplateManager';

/**
 * 导出结构化日志工具
 */
export {
  Logger,
  createLogger,
  getLogger,
  coreLogger,
  flowLogger,
  pluginLogger,
  templateLogger,
  ruleLogger,
  systemLogger,
  errorLogger,
  performanceLogger,
  debugLogger,
} from './utils/Logger';
export type {
  LogRecord,
  LogMetadata,
  LogHandler,
  LogSampleConfig,
  LoggerOptions,
  SampledLogResult,
  FileLogHandlerOptions,
} from './utils/Logger';
export { LogLevel, LogCategory, LogLevelNames, LogLevelColors, LogLevelReset } from './utils/Logger';
