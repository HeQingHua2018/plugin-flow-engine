/*
 * @File: ContextManager.ts
 * @desc: 上下文管理器，负责流程执行过程中的变量存储和状态管理
 * @author: heqinghua
 * @date: 2025年09月15日
 */

import type { ExecutionContext } from '@plugin-flow-engine/type/core';

// 上下文变更监听器类型
export type ContextListener = (context: ExecutionContext) => void;

export class ContextManager {
  private context: ExecutionContext;
  private listeners: Set<ContextListener> = new Set();

  /**
   * 构造函数
   * 初始化默认上下文和监听器集合
   */
  public constructor() {
    // 初始化默认上下文
    this.context = {
      variables: {},
    };
  }

  /**
   * 初始化上下文
   * @param initialContext 初始上下文数据
   */
  public initialize(initialContext: ExecutionContext): void {
    this.context = { ...initialContext };
    this.notifyListeners();
  }

  /**
   * 获取当前上下文
   * @returns 完整上下文对象的深拷贝
   */
  public getContext(): ExecutionContext {
    return { ...this.context };
  }
  /**
   * 获取上下文变量
   * @returns 变量对象的深拷贝
   */
  public getVariables(): Record<string, any> {
    return { ...this.context.variables };
  }

  /**
   * 更新上下文变量
   * @param variables 要更新的变量对象（部分更新）
   */
  public updateVariables(variables: Record<string, any>): void {
    this.context.variables = {
      ...this.context.variables,
      ...variables,
    };
    this.notifyListeners();
  }

  /**
   * 更新整个上下文
   * @param newContext 新的完整上下文对象
   */
  public updateContext(newContext: ExecutionContext): void {
    this.context = { ...newContext };
    this.notifyListeners();
  }

  /**
   * 添加上下文变更监听器
   * @param listener 监听器函数，在上下文变更时被调用
   * @returns 移除监听器的函数
   */
  public addListener(listener: ContextListener): () => void {
    this.listeners.add(listener);
    // 立即触发一次，让监听器获取当前值
    listener(this.getContext());
    return () => this.removeListener(listener);
  }

  /**
   * 移除上下文变更监听器
   * @param listener 要移除的监听器函数
   */
  public removeListener(listener: ContextListener): void {
    this.listeners.delete(listener);
  }

  /**
   * 通知所有监听器上下文已变更
   */
  private notifyListeners(): void {
    const currentContext = this.getContext();
    this.listeners.forEach((listener) => {
      try {
        listener(currentContext);
      } catch (error) {
        console.error('上下文监听器执行出错:', error);
      }
    });
  }

  /**
   * 清空上下文数据
   */
  public clear(): void {
    this.context = {
      variables: {},
    };
    this.notifyListeners();
  }
}

// 用于组件中的自定义Hook
export const useContextManager = (contextManager: ContextManager) => {
  return contextManager;
};
