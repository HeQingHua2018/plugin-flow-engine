/* eslint-disable @typescript-eslint/no-unused-vars */
/*
 * @File: IterationNodePlugin.ts
 * @desc: 迭代节点插件实现
 * @author: heqinghua
 * @date: 2025年09月24日
 */
import { IterationMode, NodeStatus, type ExecutionHistory, type Node } from "@plugin-flow-engine/type/core";
import { BaseNodePlugin } from "../BaseNodePlugin";
import type { PluginExecutionEngine } from '../../utils/PluginExecutionEngine';
import schema, { PluginNodeType, PluginNodeTypeName } from './schema';

/**
 * 迭代节点插件
 * 用于处理流程中的循环迭代逻辑
 * 支持多种迭代执行模式和自定义执行次数
 */
export class IterationNodePlugin extends BaseNodePlugin {
  /**
   * 节点类型
   */
  public pluginNodeType = PluginNodeType;
  /**
   * 节点类型名称
   */
  public pluginNodeTypeName = PluginNodeTypeName;

  /**
   * 获取节点表单配置项
   * @returns 节点表单配置项
   */
  getNodeFormConfig() {
    return schema;
  }

  /**
   * 调用节点关联的事件方法
   * 实现迭代执行逻辑，根据配置的模式和次数循环执行指定事件
   * @param node 节点信息
   * @param pluginExecutionEngine 插件执行引擎
   * @param historyItem 执行历史记录项(可选)
   * @returns 执行结果，true表示成功，false表示失败
   * @throws 当执行过程中出现异常时抛出错误
   */
  protected async invokeEvent(node: Node, pluginExecutionEngine: PluginExecutionEngine, historyItem?: ExecutionHistory): Promise<boolean> {
    if (!node.data?.config?.event || !node.data?.config?.event.type) {
      return true;
    }
    let count = node.data?.config?.iteration_count || 1; // 默认执行次数
    // 使用迭代模式枚举定义执行行为（支持字符串到枚举的规范化）
    const configured = node.data?.config?.iteration_mode;
    const mode = this.normalizeIterationMode(configured);
    
    try {
      // 根据不同模式执行
      switch (mode) {
        case IterationMode.ALL_SUCCESS:
          // 模式1: 所有次数执行成功后才算成功
          while (count > 0) {
            const methodResult = await pluginExecutionEngine.evaluateMethod(node.data?.config?.event, node.id);
            if (!methodResult) {
              return false;
            }
            count--;
          }
          break;
        
        case IterationMode.ANY_SUCCESS:
          // 模式2: 成功一次也算成功
          while (count > 0) {
            const methodResult = await pluginExecutionEngine.evaluateMethod(node.data?.config?.event, node.id);
            if (methodResult) {
              return true;
            }
            count--;
          }
          return false;
        
        case IterationMode.ANY_FAILURE:
          // 模式3: 失败一次也算失败
          while (count > 0) {
            const methodResult = await pluginExecutionEngine.evaluateMethod(node.data?.config?.event, node.id);
            if (!methodResult) {
              return false;
            }
            count--;
          }
          return true;
        
        default:
          // 默认模式
          while (count > 0) {
            const methodResult = await pluginExecutionEngine.evaluateMethod(node.data?.config?.event, node.id);
            if (!methodResult) {
              return false;
            }
            count--;
          }
          break;
      }
      
      return true;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }

  /**
   * 获取迭代节点的执行状态
   * @param node 迭代节点对象
   * @param pluginExecutionEngine 插件执行引擎实例
   * @returns 节点执行状态
   */
  async getExecuteNodeStatus(node: Node, pluginExecutionEngine: PluginExecutionEngine): Promise<NodeStatus | null> {
    return super.getExecuteNodeStatus(node, pluginExecutionEngine);
  }

  async executeNode(node: Node, pluginExecutionEngine: PluginExecutionEngine, historyItem?: ExecutionHistory): Promise<boolean> {
    const result = await this.invokeEvent(node, pluginExecutionEngine, historyItem);
    if (historyItem) {
      historyItem.status = result ? NodeStatus.SUCCESS : NodeStatus.FAILED;
      historyItem.endTime = new Date();
      historyItem.duration = historyItem.startTime ? historyItem.endTime.getTime() - historyItem.startTime.getTime() : 0;
      historyItem.contextAfter = { ...pluginExecutionEngine.getContextManager().getVariables() };
      historyItem.engineResult = result;
    }
    return result;
  }
  private normalizeIterationMode(configured?: IterationMode | string): IterationMode {
    if (typeof configured === 'number') {
      if (Object.values(IterationMode).includes(configured as any)) {
        return configured as IterationMode;
      }
    }
    if (typeof configured === 'string') {
      const numeric = Number(configured);
      if (!Number.isNaN(numeric) && Object.values(IterationMode).includes(numeric as any)) {
        return numeric as IterationMode;
      }
      const key = configured.toUpperCase().replace(/\s+/g, '').replace(/-/g, '_');
      const mapped = (IterationMode as any)[key];
      if (mapped !== undefined) {
        return mapped as IterationMode;
      }
    }
    return IterationMode.ALL_SUCCESS;
  }
}


export default IterationNodePlugin;