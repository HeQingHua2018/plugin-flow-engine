/*
 * @File: PluginManager.ts
 * @desc: 插件管理器，负责节点插件的注册、查找和管理
 * @author: heqinghua
 * @date: 2025年09月18日
 */

import  { type Edge, type Node, type ExecutionHistory, type PluginNodeType, type NodeStatus } from "@plugin-flow-engine/type/core";
import type { NodePlugin } from '../plugins/NodePlugin';
import { PluginExecutionEngine } from './PluginExecutionEngine';
import { getBuiltInPluginInstances } from '../plugins/index'


/**
 * 插件管理器类
 * 提供节点插件的注册、获取和管理功能
 * 支持单例模式和实例化两种使用方式
 */
export class PluginManager {
  private static instance: PluginManager;
  private plugins: Map<PluginNodeType, NodePlugin> = new Map();

  /**
 * 构造函数
 * 初始化插件映射并自动注册所有内置节点插件
 */
  constructor() {
    // 注册所有内置节点插件
    this.registerBuiltInPlugins();
  }

  /**
   * 注册所有内置节点插件
   * 自动注册系统预定义的节点类型插件
   */
  private registerBuiltInPlugins(): void {
    const builtInPlugins = getBuiltInPluginInstances();
    this.registerAllPlugin(builtInPlugins);

    console.log(this.getAllPluginNodeTypes());
    console.log('[PluginManager] 已自动注册所有内置节点插件');
  }

  /**
 * 获取单例实例
 * @returns 全局唯一的插件管理器实例
 */
  public static getInstance(): PluginManager {
    if (!PluginManager.instance) {
      PluginManager.instance = new PluginManager();
    }
    return PluginManager.instance;
  }

/**
 * 注册单个节点插件
 * @param plugin 节点插件实例
 */
  public registerPlugin(plugin: NodePlugin): void {
    this.plugins.set(plugin.pluginNodeType, plugin);
    console.log(`[PluginManager] 已注册节点类型 ${plugin.pluginNodeType} 的插件`);
  }

  /**
 * 批量注册多个节点插件
 * @param allPlugin 节点插件实例数组
 */
  public registerAllPlugin(allPlugin: Array<NodePlugin>): void{
    allPlugin.forEach(item=>{
      this.registerPlugin(item);
    })
  }

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
   * 获取节点配置（nodeConfig）
   * 返回的对象包含表单 `schema` 以及 `widgets`（控件映射）。
   * 优先使用注入器中覆写的 `schema`，并与插件提供的 `widgets` 合并；
   * 若未注入，则回退到插件自带的配置（可能同时包含 `schema` 与 `widgets`）。
   * @param pluginNodeType 节点类型
   * @returns `{ schema?: Schema, widgets?: Record<string, any> }`
   */
  public getNodeFormConfig(pluginNodeType: PluginNodeType): any {
    const plugin = this.getPlugin(pluginNodeType);
    const pluginCfg = plugin.getNodeFormConfig?.();
    return pluginCfg;
  }
  
  /**
   * 获取所有节点类型列表
   * @returns 节点类型列表，格式为[{value: pluginNodeType, label: nodeTypeName}]
   */
  public getAllPluginNodeTypes(): Array<{value: PluginNodeType, label: string}> {
    return this.getAllPlugins().map(plugin => ({
      value: plugin.pluginNodeType,
      label: plugin.pluginNodeTypeName
    }));
  }

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
   * 获取下一个节点ID
   * @param node 当前节点
   * @param edges 所有出边的集合
   * @param pluginExecutionEngine 插件执行引擎
   * @param historyItem 执行历史记录项（可选）
   * @returns 下一个节点ID或null
   */
  public async getNextNodeId(node: Node, edges: Edge[], pluginExecutionEngine: PluginExecutionEngine, historyItem?: ExecutionHistory): Promise<string | string[] | null> {
    try {
      const plugin = this.getPlugin(node.data?.pluginNodeType);
      const nextNodeId = await plugin.getNextNodeId(edges, pluginExecutionEngine, historyItem);
      return nextNodeId;
    } catch (err) {
      throw new Error(err instanceof Error ? `获取边失败: ${err.message}` : `获取边失败: ${String(err)}`);
    }
  }
}

// 单例实例访问函数
export function PluginManagerInstance(): PluginManager {
  return PluginManager.getInstance();
}

export default PluginManager;
