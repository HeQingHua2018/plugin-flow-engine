/*
 * @File: PluginManager.ts
 * @desc: 插件管理器，负责节点插件的注册、查找和管理
 * @author: heqinghua
 * @date: 2025 年 09 月 18 日
 */
import { NodeStatus } from '../constants';
import { PluginExecutionEngine } from './PluginExecutionEngine';
import { getBuiltInPluginInstances } from '../plugins/index'
import type { NodePlugin } from '../plugins/NodePlugin';
import type { Node, Edge, PluginNodeType, ExecutionHistory } from '../types';


// ============================================================================
// 插件元数据和类型定义
// ============================================================================

/**
 * 插件元数据接口
 * 描述插件的基本信息和版本信息
 */
export interface PluginMetadata {
  /** 插件唯一标识符 */
  id: string;
  /** 插件名称 */
  name: string;
  /** 插件版本，遵循语义化版本规范 (semver) */
  version: string;
  /** 插件描述 */
  description?: string;
  /** 作者信息 */
  author?: string;
  /** 支持的最低核心版本 */
  minCoreVersion?: string;
  /** 支持的最高核心版本 */
  maxCoreVersion?: string;
  /** 插件注册的时间戳 */
  registeredAt: Date;
  /** 插件最后热加载的时间戳 */
  lastHotReloadAt?: Date;
  /** 插件加载次数 */
  loadCount: number;
}

/**
 * 插件版本兼容性检查结果
 */
export interface VersionCompatibilityResult {
  /** 是否兼容 */
  compatible: boolean;
  /** 兼容性错误信息，如果不兼容 */
  error?: string;
}

/**
 * 插件热加载状态
 */
export enum PluginHotReloadStatus {
  /** 正在热加载中 */
  LOADING = 'loading',
  /** 热加载成功 */
  SUCCESS = 'success',
  /** 热加载失败 */
  FAILED = 'failed',
  /** 插件处于卸载中 */
  UNLOADING = 'unloading',
  /** 卸载成功 */
  UNLOADED = 'unloaded',
}

/**
 * 插件热加载事件
 */
export interface PluginHotReloadEvent {
  /** 插件类型 */
  pluginNodeType: PluginNodeType;
  /** 热加载状态 */
  status: PluginHotReloadStatus;
  /** 旧插件实例（如果有） */
  oldPlugin?: NodePlugin;
  /** 新插件实例（如果有） */
  newPlugin?: NodePlugin;
  /** 错误信息（如果失败） */
  error?: string;
  /** 时间戳 */
  timestamp: Date;
}

/**
 * 插件卸载原因枚举
 */
export enum PluginUnloadReason {
  /** 用户主动卸载 */
  USER_REQUEST = 'user_request',
  /** 插件版本不兼容 */
  VERSION_INCOMPATIBLE = 'version_incompatible',
  /** 插件加载失败 */
  LOAD_FAILED = 'load_failed',
  /** 插件热加载替换 */
  HOT_RELOAD_REPLACE = 'hot_reload_replace',
  /** 系统清理 */
  SYSTEM_CLEANUP = 'system_cleanup',
}

/**
 * 插件卸载事件
 */
export interface PluginUnloadEvent {
  /** 插件类型 */
  pluginNodeType: PluginNodeType;
  /** 卸载原因 */
  reason: PluginUnloadReason;
  /** 卸载时间戳 */
  timestamp: Date;
  /** 错误信息（如果卸载失败） */
  error?: string;
}

/**
 * 插件生命周期回调接口
 */
export interface PluginLifecycleCallbacks {
  /** 插件注册时的回调 */
  onPluginRegistered?: (plugin: NodePlugin, metadata: PluginMetadata) => void;
  /** 插件卸载时的回调 */
  onPluginUnloaded?: (pluginNodeType: PluginNodeType, reason: PluginUnloadReason) => void;
  /** 插件热加载时的回调 */
  onPluginHotReloaded?: (event: PluginHotReloadEvent) => void;
}

// ============================================================================
// 插件管理器类
// ============================================================================

/**
 * 插件管理器类
 * 提供节点插件的注册、获取和管理功能
 * 支持多实例模式，每个流程引擎拥有独立的 PluginManager 实例
 * 支持插件热加载、动态注册/卸载、版本兼容性检查
 */
export class PluginManager {
  private plugins: Map<PluginNodeType, NodePlugin> = new Map();
  private pluginMetadata: Map<PluginNodeType, PluginMetadata> = new Map();
  private hotReloadStatus: Map<PluginNodeType, PluginHotReloadStatus> = new Map();
  private lifecycleCallbacks: PluginLifecycleCallbacks = {};

  /**
 * 当前核心版本，用于版本兼容性检查
 * 使用语义化版本规范 (semver)
 */
private static currentCoreVersion = '1.0.0';

/**
 * 内置插件是否已注册（静态标志位，全局只注册一次）
 */
private static builtInPluginsRegistered = false;

/**
 * 构造函数
 * 初始化插件映射并自动注册所有内置节点插件
 * @param callbacks 生命周期回调
 * @param options 可选配置
 * @param options.skipBuiltInRegistration 是否跳过内置插件自动注册（默认为false）
 */
constructor(callbacks?: PluginLifecycleCallbacks, options?: { skipBuiltInRegistration?: boolean }) {
  this.lifecycleCallbacks = callbacks || {};
  if (!options?.skipBuiltInRegistration) {
    this.registerBuiltInPlugins();
  }
}

  // ============================================================================
  // 版本兼容性检查
  // ============================================================================

  /**
   * 解析语义化版本号
   * @param version 版本号字符串，如 "1.2.3"
   * @returns 包含 major, minor, patch 的对象
   */
  private static parseVersion(version: string): { major: number; minor: number; patch: number } {
    const parts = version.trim().split('.');
    return {
      major: parseInt(parts[0] || '0', 10),
      minor: parseInt(parts[1] || '0', 10),
      patch: parseInt(parts[2] || '0', 10),
    };
  }

  /**
   * 比较两个版本号
   * @param version1 第一个版本号
   * @param version2 第二个版本号
   * @returns -1 表示 version1 < version2, 0 表示相等，1 表示 version1 > version2
   */
  private static compareVersions(version1: string, version2: string): number {
    const v1 = this.parseVersion(version1);
    const v2 = this.parseVersion(version2);

    if (v1.major !== v2.major) {
      return v1.major > v2.major ? 1 : -1;
    }
    if (v1.minor !== v2.minor) {
      return v1.minor > v2.minor ? 1 : -1;
    }
    return v1.patch > v2.patch ? 1 : v1.patch < v2.patch ? -1 : 0;
  }

  /**
   * 检查插件版本是否与当前核心版本兼容
   * @param metadata 插件元数据
   * @returns 版本兼容性检查结果
   */
  public checkVersionCompatibility(metadata: PluginMetadata): VersionCompatibilityResult {
    // 检查最低核心版本要求
    if (metadata.minCoreVersion) {
      const compareResult = PluginManager.compareVersions(
        PluginManager.currentCoreVersion,
        metadata.minCoreVersion
      );
      if (compareResult < 0) {
        return {
          compatible: false,
          error: `插件需要核心版本 >= ${metadata.minCoreVersion}，当前版本为 ${PluginManager.currentCoreVersion}`,
        };
      }
    }

    // 检查最高核心版本要求
    if (metadata.maxCoreVersion) {
      const compareResult = PluginManager.compareVersions(
        PluginManager.currentCoreVersion,
        metadata.maxCoreVersion
      );
      if (compareResult > 0) {
        return {
          compatible: false,
          error: `插件仅支持核心版本 <= ${metadata.maxCoreVersion}，当前版本为 ${PluginManager.currentCoreVersion}`,
        };
      }
    }

    return { compatible: true };
  }

  /**
   * 静态方法：设置当前核心版本
   * @param version 核心版本号
   */
  public static setCurrentCoreVersion(version: string): void {
    PluginManager.currentCoreVersion = version;
  }

  /**
   * 静态方法：获取当前核心版本
   */
  public static getCurrentCoreVersion(): string {
    return PluginManager.currentCoreVersion;
  }

  // ============================================================================
  // 插件注册
  // ============================================================================

  /**
   * 注册所有内置节点插件
   * 自动注册系统预定义的节点类型插件
   */
  private registerBuiltInPlugins(): void {
    const builtInPlugins = getBuiltInPluginInstances();
    const isFirstRegistration = !PluginManager.builtInPluginsRegistered;
    this.registerAllPlugin(builtInPlugins, false, !isFirstRegistration);

    if (isFirstRegistration) {
      console.log(this.getAllPluginNodeTypes());
      console.log('[PluginManager] 已自动注册所有内置节点插件');
      PluginManager.builtInPluginsRegistered = true;
    }
  }

  /**
   * 为插件创建元数据
   * @param plugin 插件实例
   * @param loadCount 初始加载次数
   * @returns 插件元数据
   */
  private createPluginMetadata(
    plugin: NodePlugin,
    loadCount: number = 1
  ): PluginMetadata {
    // 尝试从插件实例获取元数据（如果插件实现了 metadata 属性）
    const pluginAsAny = plugin as any;

    return {
      id: pluginAsAny.metadata?.id || plugin.pluginNodeType.toString(),
      name: pluginAsAny.metadata?.name || plugin.pluginNodeTypeName,
      version: pluginAsAny.metadata?.version || '1.0.0',
      description: pluginAsAny.metadata?.description,
      author: pluginAsAny.metadata?.author,
      minCoreVersion: pluginAsAny.metadata?.minCoreVersion,
      maxCoreVersion: pluginAsAny.metadata?.maxCoreVersion,
      registeredAt: new Date(),
      loadCount,
    };
  }

  /**
   * 检查插件是否已存在
   * @param pluginNodeType 插件类型
   * @returns 是否存在
   */
  private isPluginExists(pluginNodeType: PluginNodeType): boolean {
    return this.plugins.has(pluginNodeType);
  }

  /**
   * 获取插件元数据
   * @param pluginNodeType 插件类型
   * @returns 插件元数据，不存在则返回 undefined
   */
  public getPluginMetadata(pluginNodeType: PluginNodeType): PluginMetadata | undefined {
    return this.pluginMetadata.get(pluginNodeType);
  }

  /**
   * 获取所有插件的元数据
   * @returns 插件元数据数组
   */
  public getAllPluginMetadata(): PluginMetadata[] {
    return Array.from(this.pluginMetadata.values());
  }

  /**
   * 注册单个节点插件
   * @param plugin 节点插件实例
   * @param force 是否强制注册（覆盖已存在的插件）
   * @param silent 是否静默注册（不打印日志）
   * @throws 当插件已存在且 force 为 false 时抛出错误
   */
  public registerPlugin(plugin: NodePlugin, force: boolean = false, silent: boolean = false): void {
    const pluginNodeType = plugin.pluginNodeType;

    // 检查版本兼容性
    const tempMetadata = this.createPluginMetadata(plugin, 1);
    const compatResult = this.checkVersionCompatibility(tempMetadata);

    if (!compatResult.compatible) {
      throw new Error(`插件版本不兼容：${compatResult.error}`);
    }

    // 如果插件已存在且不是强制注册，抛出错误
    if (this.isPluginExists(pluginNodeType) && !force) {
      throw new Error(`插件 ${pluginNodeType} 已注册，如需覆盖请使用 force: true 或先调用 unregisterPlugin`);
    }

    // 如果插件已存在，先卸载旧插件
    if (this.isPluginExists(pluginNodeType)) {
      const oldPlugin = this.plugins.get(pluginNodeType);
      this.doUnloadPlugin(pluginNodeType, PluginUnloadReason.HOT_RELOAD_REPLACE, oldPlugin);
    }

    // 注册新插件
    this.plugins.set(pluginNodeType, plugin);

    // 创建并存储元数据
    const metadata = this.createPluginMetadata(plugin);
    this.pluginMetadata.set(pluginNodeType, metadata);

    // 更新热加载状态
    this.hotReloadStatus.set(pluginNodeType, PluginHotReloadStatus.SUCCESS);

    // 调用注册回调
    if (this.lifecycleCallbacks.onPluginRegistered) {
      this.lifecycleCallbacks.onPluginRegistered(plugin, metadata);
    }

    if (!silent) {
      console.log(`[PluginManager] 已注册节点类型 ${pluginNodeType} 的插件 (版本：${metadata.version})`);
    }
  }

  /**
   * 批量注册多个节点插件
   * @param allPlugin 节点插件实例数组
   * @param force 是否强制注册（覆盖已存在的插件）
   * @param silent 是否静默注册（不打印日志）
   */
  public registerAllPlugin(allPlugin: Array<NodePlugin>, force: boolean = false, silent: boolean = false): void {
    allPlugin.forEach(item => {
      this.registerPlugin(item, force, silent);
    });
  }

  // ============================================================================
  // 插件卸载
  // ============================================================================

  /**
   * 执行实际的插件卸载操作
   * @param pluginNodeType 插件类型
   * @param reason 卸载原因
   * @param oldPlugin 旧插件实例
   */
  private doUnloadPlugin(
    pluginNodeType: PluginNodeType,
    reason: PluginUnloadReason,
    oldPlugin?: NodePlugin
  ): void {
    // 更新热加载状态
    this.hotReloadStatus.set(pluginNodeType, PluginHotReloadStatus.UNLOADING);

    // 移除插件
    this.plugins.delete(pluginNodeType);

    // 移除元数据
    this.pluginMetadata.delete(pluginNodeType);

    // 更新热加载状态为已卸载
    this.hotReloadStatus.set(pluginNodeType, PluginHotReloadStatus.UNLOADED);

    // 调用卸载回调
    if (this.lifecycleCallbacks.onPluginUnloaded) {
      this.lifecycleCallbacks.onPluginUnloaded(pluginNodeType, reason);
    }

    console.log(`[PluginManager] 已卸载插件 ${pluginNodeType}，原因：${reason}`);
  }

  /**
   * 卸载指定类型的插件
   * @param pluginNodeType 插件类型
   * @param reason 卸载原因，默认为用户主动卸载
   * @throws 当插件不存在时抛出错误
   */
  public unregisterPlugin(
    pluginNodeType: PluginNodeType,
    reason: PluginUnloadReason = PluginUnloadReason.USER_REQUEST
  ): void {
    if (!this.isPluginExists(pluginNodeType)) {
      throw new Error(`插件 ${pluginNodeType} 不存在，无法卸载`);
    }

    const oldPlugin = this.plugins.get(pluginNodeType);
    this.doUnloadPlugin(pluginNodeType, reason, oldPlugin);
  }

  /**
   * 批量卸载多个插件
   * @param pluginNodeTypes 插件类型数组
   * @param reason 卸载原因
   */
  public unregisterAllPlugin(
    pluginNodeTypes: PluginNodeType[],
    reason: PluginUnloadReason = PluginUnloadReason.USER_REQUEST
  ): void {
    pluginNodeTypes.forEach(pluginNodeType => {
      this.unregisterPlugin(pluginNodeType, reason);
    });
  }

  /**
   * 卸载所有插件
   * @param reason 卸载原因
   */
  public unregisterAllPlugins(
    reason: PluginUnloadReason = PluginUnloadReason.SYSTEM_CLEANUP
  ): void {
    const allPluginTypes = this.getAllPluginNodeTypes().map(p => p.value);
    this.unregisterAllPlugin(allPluginTypes, reason);
  }

  /**
   * 检查插件是否正在热加载中
   * @param pluginNodeType 插件类型
   * @returns 是否正在热加载中
   */
  public isPluginLoading(pluginNodeType: PluginNodeType): boolean {
    return this.hotReloadStatus.get(pluginNodeType) === PluginHotReloadStatus.LOADING;
  }

  /**
   * 获取插件的热加载状态
   * @param pluginNodeType 插件类型
   * @returns 热加载状态
   */
  public getPluginHotReloadStatus(pluginNodeType: PluginNodeType): PluginHotReloadStatus | undefined {
    return this.hotReloadStatus.get(pluginNodeType);
  }

  // ============================================================================
  // 插件热加载
  // ============================================================================

  /**
   * 热加载插件（卸载旧插件并注册新插件）
   * @param plugin 新的插件实例
   * @param options 热加载选项
   * @returns 热加载事件
   */
  public async hotReloadPlugin(
    plugin: NodePlugin,
    options: { force?: boolean; skipCompatibilityCheck?: boolean } = {}
  ): Promise<PluginHotReloadEvent> {
    const pluginNodeType = plugin.pluginNodeType;
    const event: PluginHotReloadEvent = {
      pluginNodeType,
      status: PluginHotReloadStatus.LOADING,
      timestamp: new Date(),
    };

    try {
      // 检查是否正在加载中（防止重复热加载）
      if (this.isPluginLoading(pluginNodeType)) {
        event.error = `插件 ${pluginNodeType} 正在热加载中，请等待完成`;
        event.status = PluginHotReloadStatus.FAILED;
        return event;
      }

      // 获取旧插件实例
      const oldPlugin = this.plugins.get(pluginNodeType);
      event.oldPlugin = oldPlugin;

      // 检查版本兼容性（除非跳过）
      if (!options.skipCompatibilityCheck) {
        const tempMetadata = this.createPluginMetadata(plugin, 1);
        const compatResult = this.checkVersionCompatibility(tempMetadata);

        if (!compatResult.compatible) {
          event.error = `插件版本不兼容：${compatResult.error}`;
          event.status = PluginHotReloadStatus.FAILED;
          return event;
        }
      }

      // 更新状态为加载中
      this.hotReloadStatus.set(pluginNodeType, PluginHotReloadStatus.LOADING);

      // 卸载旧插件
      if (oldPlugin) {
        this.doUnloadPlugin(pluginNodeType, PluginUnloadReason.HOT_RELOAD_REPLACE, oldPlugin);
      }

      // 注册新插件
      this.plugins.set(pluginNodeType, plugin);

      // 更新元数据
      const metadata = this.createPluginMetadata(plugin);
      metadata.lastHotReloadAt = new Date();
      metadata.loadCount = (this.pluginMetadata.get(pluginNodeType)?.loadCount || 0) + 1;
      this.pluginMetadata.set(pluginNodeType, metadata);

      // 更新状态为成功
      this.hotReloadStatus.set(pluginNodeType, PluginHotReloadStatus.SUCCESS);
      event.newPlugin = plugin;
      event.status = PluginHotReloadStatus.SUCCESS;

      // 调用热加载回调
      if (this.lifecycleCallbacks.onPluginHotReloaded) {
        this.lifecycleCallbacks.onPluginHotReloaded(event);
      }

      console.log(`[PluginManager] 插件 ${pluginNodeType} 热加载成功 (版本：${metadata.version})`);
    } catch (err) {
      event.error = err instanceof Error ? err.message : String(err);
      event.status = PluginHotReloadStatus.FAILED;
      this.hotReloadStatus.set(pluginNodeType, PluginHotReloadStatus.FAILED);

      console.error(`[PluginManager] 插件 ${pluginNodeType} 热加载失败：${event.error}`);
    }

    return event;
  }

  // ============================================================================
  // 插件查询
  // ============================================================================

  /**
   * 获取指定类型的节点插件
   * @param pluginNodeType 节点类型枚举值
   * @returns 对应的节点插件实例
   * @throws 当找不到对应类型的插件时抛出错误
   */
  public getPlugin(pluginNodeType: PluginNodeType): NodePlugin {
    // 不设置默认节点
    const plugin = this.plugins.get(pluginNodeType);
    if (!plugin) {
      throw new Error(`未找到节点类型 ${pluginNodeType} 的插件`);
    }
    return plugin;
  }

  /**
   * 是否存在指定类型的插件
   * @param string 节点类型
   * @returns 是否存在插件
   */
  public hasPlugin(pluginNodeType: PluginNodeType): boolean {
    return this.plugins.has(pluginNodeType);
  }

  /**
   * 获取所有注册的插件
   * @returns 插件实例数组
   */
  public getAllPlugins(): NodePlugin[] {
    return Array.from(this.plugins.values());
  }

  /**
   * 获取所有节点类型列表
   * @returns 节点类型列表，格式为 [{value: pluginNodeType, label: nodeTypeName}]
   */
  public getAllPluginNodeTypes(): Array<{value: PluginNodeType, label: string}> {
    return this.getAllPlugins().map(plugin => ({
      value: plugin.pluginNodeType,
      label: plugin.pluginNodeTypeName
    }));
  }

  // ============================================================================
  // 节点执行相关方法
  // ============================================================================

  /**
   * 获取节点执行状态
   * @param node 节点信息
   * @returns 返回节点执行状态
   */
  public async getExecuteNodeStatus(node: Node, pluginExecutionEngine: PluginExecutionEngine): Promise<NodeStatus | null> {
    const plugin = this.getPlugin(node.data?.pluginNodeType);
    try {
      const result = await plugin.getExecuteNodeStatus(node, pluginExecutionEngine);
      return result;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : String(err));
    }
  }

  /**
   * 执行节点逻辑
   * @param node 当前节点
   * @param historyItem 执行历史记录项
   * @param pluginExecutionEngine 插件执行引擎
   * @returns 执行结果
   */
  public async executeNode(node: Node, pluginExecutionEngine: PluginExecutionEngine, historyItem?: ExecutionHistory): Promise<boolean> {
    const plugin = this.getPlugin(node.data?.pluginNodeType);
    try {
      return await plugin.executeNode(node, pluginExecutionEngine, historyItem);
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : String(err));
    }
  }

  /**
   * 获取下一个节点 ID
   * @param node 当前节点
   * @param edges 所有出边的集合
   * @param pluginExecutionEngine 插件执行引擎
   * @param historyItem 执行历史记录项（可选）
   * @returns 下一个节点 ID 或 null
   */
  public async getNextNodeId(node: Node, edges: Edge[], pluginExecutionEngine: PluginExecutionEngine, historyItem?: ExecutionHistory): Promise<string | string[] | null> {
    try {
      const plugin = this.getPlugin(node.data?.pluginNodeType);
      const nextNodeId = await plugin.getNextNodeId(edges, pluginExecutionEngine, historyItem);
      return nextNodeId;
    } catch (err) {
      throw new Error(err instanceof Error ? `获取边失败：${err.message}` : `获取边失败：${String(err)}`);
    }
  }

  // ============================================================================
  // 工具方法
  // ============================================================================

  /**
   * 获取插件数量
   * @returns 已注册的插件数量
   */
  public getPluginCount(): number {
    return this.plugins.size;
  }

  /**
   * 清空所有插件（用于测试或系统重置）
   */
  public clearAllPlugins(): void {
    this.plugins.clear();
    this.pluginMetadata.clear();
    this.hotReloadStatus.clear();
  }

  /**
   * 导出插件状态信息（用于调试和监控）
   * @returns 插件状态信息对象
   */
  public exportPluginStatus(): {
    plugins: Array<{
      nodeType: PluginNodeType;
      typeName: string;
      metadata: PluginMetadata;
      hotReloadStatus: PluginHotReloadStatus;
    }>;
    totalCount: number;
  } {
    const plugins = Array.from(this.plugins.entries()).map(([nodeType, plugin]) => ({
      nodeType,
      typeName: plugin.pluginNodeTypeName,
      metadata: this.pluginMetadata.get(nodeType) || this.createPluginMetadata(plugin),
      hotReloadStatus: this.hotReloadStatus.get(nodeType) || PluginHotReloadStatus.SUCCESS,
    }));

    return {
      plugins,
      totalCount: plugins.length,
    };
  }
}

/**
 * 创建一个新的 PluginManager 实例
 * @param callbacks 生命周期回调
 * @returns 新的 PluginManager 实例
 */
export function createPluginManager(callbacks?: PluginLifecycleCallbacks): PluginManager {
  return new PluginManager(callbacks);
}

let globalPluginManagerInstance: PluginManager | null = null;

export function getGlobalPluginManager(): PluginManager {
  if (!globalPluginManagerInstance) {
    globalPluginManagerInstance = new PluginManager();
  }
  return globalPluginManagerInstance;
}

export default PluginManager;
