/*
 * @File: IterationNodePlugin.ts
 * @desc: 迭代节点插件实现
 * @author: heqinghua
 * @date: 2025年09月24日
 */
import {
  BuiltInPluginNodeTypes,
  IterationMode,
  NodeStatus,
} from '../../constants';
import type { Node } from '../../types';
import type { PluginExecutionEngine } from '../../utils/PluginExecutionEngine';
import { BaseNodePlugin } from '../BaseNodePlugin';

/**
 * 迭代节点插件
 * 用于处理流程中的循环迭代逻辑
 * 支持多种迭代执行模式和自定义执行次数
 */
export class IterationNodePlugin extends BaseNodePlugin {
  /**
   * 节点类型
   */
  public pluginNodeType = BuiltInPluginNodeTypes.Iteration;
  /**
   * 节点类型名称
   */
  public pluginNodeTypeName = '迭代节点';

  /**
   * 调用节点关联的事件方法
   * 实现迭代执行逻辑，根据配置的模式和次数循环执行指定事件
   * @param node 节点信息
   * @param pluginExecutionEngine 插件执行引擎
   * @returns 执行结果，true表示成功，false表示失败
   * @throws 当执行过程中出现异常时抛出错误
   */
  protected async invokeEvent(
    node: Node,
    pluginExecutionEngine: PluginExecutionEngine,
  ): Promise<boolean> {
    if (!node.data?.config?.event || !node.data?.config?.event.type) {
      return true;
    }
    let count = node.data?.config?.iteration_count || 1;
    const configured = node.data?.config?.iteration_mode;
    const mode = this.normalizeIterationMode(configured);

    try {
      switch (mode) {
        case IterationMode.ALL_SUCCESS:
          while (count > 0) {
            const methodResult = await pluginExecutionEngine.evaluateMethod(
              node.data?.config?.event,
              node.id,
            );
            if (!methodResult) {
              return false;
            }
            count--;
          }
          break;

        case IterationMode.ANY_SUCCESS:
          while (count > 0) {
            const methodResult = await pluginExecutionEngine.evaluateMethod(
              node.data?.config?.event,
              node.id,
            );
            if (methodResult) {
              return true;
            }
            count--;
          }
          return false;

        case IterationMode.ANY_FAILURE:
          while (count > 0) {
            const methodResult = await pluginExecutionEngine.evaluateMethod(
              node.data?.config?.event,
              node.id,
            );
            if (!methodResult) {
              return false;
            }
            count--;
          }
          return true;

        default:
          while (count > 0) {
            const methodResult = await pluginExecutionEngine.evaluateMethod(
              node.data?.config?.event,
              node.id,
            );
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
  async getExecuteNodeStatus(
    node: Node,
    pluginExecutionEngine: PluginExecutionEngine,
  ): Promise<NodeStatus | null> {
    return super.getExecuteNodeStatus(node, pluginExecutionEngine);
  }

  /**
   * 执行节点逻辑
   * 记录迭代模式和次数到历史记录，然后调用迭代事件执行方法
   * @param node 当前节点
   * @param pluginExecutionEngine 插件执行引擎
   * @param historyItem 执行历史记录项（可选）
   * @returns 执行结果，true表示成功，false表示失败
   */
  async executeNode(
    node: Node,
    pluginExecutionEngine: PluginExecutionEngine,
    historyItem?: any,
  ): Promise<boolean> {
    if (historyItem) {
      historyItem.iteration_mode = node.data?.config?.iteration_mode || IterationMode.ALL_SUCCESS;
      historyItem.iteration_count = node.data?.config?.iteration_count || 1;
    }
    return this.invokeEvent(node, pluginExecutionEngine);
  }

  /**
   * 标准化迭代模式配置
   * 将字符串或数字转换为迭代模式枚举值
   * @param configured 配置的迭代模式
   * @returns 标准化后的迭代模式枚举值
   */
  private normalizeIterationMode(
    configured?: IterationMode | string,
  ): IterationMode {
    if (typeof configured === 'number') {
      if (Object.values(IterationMode).includes(configured as any)) {
        return configured as IterationMode;
      }
    }
    if (typeof configured === 'string') {
      const numeric = Number(configured);
      if (
        !Number.isNaN(numeric) &&
        Object.values(IterationMode).includes(numeric as any)
      ) {
        return numeric as IterationMode;
      }
      const key = configured
        .toUpperCase()
        .replace(/\s+/g, '')
        .replace(/-/g, '_');
      const mapped = (IterationMode as any)[key];
      if (mapped !== undefined) {
        return mapped as IterationMode;
      }
    }
    return IterationMode.ALL_SUCCESS;
  }
}

export default IterationNodePlugin;