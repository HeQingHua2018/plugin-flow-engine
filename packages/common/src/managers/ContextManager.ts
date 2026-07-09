/*
 * @File: ContextManager.ts
 * @desc: 上下文管理器，负责变量存储和状态管理
 * @author: heqinghua
 * @date: 2025 年 09 月 15 日
 */

import { FlowExecutionError } from '../errors';
import { ReadWriteLock, OperationSequence } from '../utils/ReadWriteLock';

export type ExecutionContext = {
  variables: Record<string, any>;
  metadata?: {
    flowId?: string;
    executionId?: string;
    createdAt?: Date;
    updatedAt?: Date;
  };
}

// 上下文变更监听器类型
export type ContextListener = (context: ExecutionContext) => void;

// 上下文快照
export type ContextSnapshot = {
  variables: Record<string, any>;
  metadata: ExecutionContext['metadata'];
  timestamp: Date;
};

// 事务快照
export type TransactionSnapshot = {
  variables: Record<string, any>;
  metadata: ExecutionContext['metadata'] | undefined;
  timestamp: Date;
  nestedCount: number; // 嵌套层级
};

// 事务状态
export enum TransactionStatus {
  ACTIVE = 'active',
  COMMITTED = 'committed',
  ROLLED_BACK = 'rolled_back',
}

// 事务信息
export type TransactionInfo = {
  id: string;
  status: TransactionStatus;
  createdAt: Date;
  nestedCount: number;
};

/**
 * 上下文管理器类
 * 提供线程安全的上下文管理，支持快照、事务和回滚
 * 每个引擎实例应拥有独立的 ContextManager 实例
 */
export class ContextManager {
  private context: ExecutionContext;
  private listeners: Set<ContextListener> = new Set();
  private snapshots: ContextSnapshot[] = [];
  private maxSnapshots: number = 100; // 最大快照数量

  // 事务相关
  private transactionStack: TransactionSnapshot[] = []; // 事务栈，支持嵌套
  private activeTransactionId: string | null = null; // 当前活跃事务 ID
  private transactionCounter: number = 0; // 事务 ID 计数器

  // 并发控制
  private variablesLock: ReadWriteLock;
  private operationSequence: OperationSequence;

  /**
   * 构造函数
   * 初始化默认上下文和监听器集合
   */
  public constructor() {
    this.context = {
      variables: {},
      metadata: {
        createdAt: new Date(),
      },
    };
    // 初始化并发控制组件
    this.variablesLock = new ReadWriteLock({ maxWaitTime: 5000, reentrant: true });
    this.operationSequence = new OperationSequence();
  }

  /**
   * 初始化上下文
   * @param initialContext 初始上下文数据
   * @throws {FlowExecutionError} 当上下文无效时抛出错误
   */
  public initialize(initialContext: ExecutionContext): void {
    if (!initialContext || typeof initialContext.variables !== 'object' || initialContext.variables === null) {
      throw FlowExecutionError.contextManagerNotInitialized('初始上下文必须包含有效的 variables 对象');
    }

    this.context = {
      ...initialContext,
      metadata: {
        ...initialContext.metadata,
        flowId: initialContext.metadata?.flowId || this.context.metadata?.flowId,
        executionId: initialContext.metadata?.executionId || this.createExecutionId(),
        createdAt: initialContext.metadata?.createdAt || new Date(),
        updatedAt: new Date(),
      },
    };
    this.notifyListeners();
  }

  /**
   * 创建唯一的执行 ID
   */
  private createExecutionId(): string {
    return `${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }

  /**
   * 获取当前上下文
   * @returns 完整上下文对象的深拷贝
   */
  public getContext(): ExecutionContext {
    return this.deepClone(this.context);
  }

  /**
   * 获取上下文变量
   * @returns 变量对象的深拷贝
   */
  public getVariables(): Record<string, any> {
    // 获取读锁
    this.variablesLock.acquireRead();
    try {
      return this.deepClone(this.context.variables);
    } finally {
      this.variablesLock.releaseRead();
    }
  }

  /**
   * 获取单个变量值
   * @param key 变量名
   * @param defaultValue 默认值
   * @returns 变量值或默认值
   */
  public getVariable<T = any>(key: string, defaultValue?: T): T | undefined {
    const value = this.context.variables[key];
    return value !== undefined ? value : defaultValue;
  }

  /**
   * 更新上下文变量
   * @param variables 要更新的变量对象（部分更新）
   * @param createSnapshot 是否创建快照
   * @throws {FlowExecutionError} 当变量参数无效时抛出错误
   */
  public updateVariables(variables: Record<string, any>, createSnapshot: boolean = false): void {
    if (!variables || typeof variables !== 'object' || variables === null) {
      throw FlowExecutionError.contextVariableNotFound('变量参数必须是有效的对象');
    }

    // 获取写锁
    this.variablesLock.acquireWrite();
    try {
      if (createSnapshot) {
        this.createSnapshot();
      }

      this.context.variables = {
        ...this.context.variables,
        ...variables,
      };
      this.context.metadata = {
        ...this.context.metadata,
        updatedAt: new Date(),
      };
      this.notifyListeners();
    } finally {
      this.variablesLock.releaseWrite();
    }
  }

  /**
   * 设置单个变量值
   * @param key 变量名
   * @param value 变量值
   * @param createSnapshot 是否创建快照
   */
  public setVariable<T>(key: string, value: T, createSnapshot: boolean = false): void {
    this.updateVariables({ [key]: value }, createSnapshot);
  }

  /**
   * 删除变量
   * @param key 变量名
   * @param createSnapshot 是否创建快照
   */
  public deleteVariable(key: string, createSnapshot: boolean = false): void {
    const { [key]: _, ...rest } = this.context.variables;
    this.updateVariables(rest, createSnapshot);
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
   * 创建上下文快照
   * @returns 快照引用
   */
  public createSnapshot(): ContextSnapshot {
    const snapshot: ContextSnapshot = {
      variables: this.deepClone(this.context.variables),
      metadata: this.context.metadata ? { ...this.context.metadata } : undefined,
      timestamp: new Date(),
    };

    this.snapshots.push(snapshot);

    // 限制快照数量
    if (this.snapshots.length > this.maxSnapshots) {
      this.snapshots.shift();
    }

    return snapshot;
  }

  /**
   * 获取最大快照数量
   */
  public getMaxSnapshots(): number {
    return this.maxSnapshots;
  }

  /**
   * 设置最大快照数量
   * @param maxCount 最大快照数量
   */
  public setMaxSnapshots(maxCount: number): void {
    if (maxCount < 0) {
      throw new Error('最大快照数量不能为负数');
    }
    this.maxSnapshots = maxCount;

    // 如果当前快照数量超过限制，清理多余的快照
    if (this.snapshots.length > maxCount) {
      this.snapshots = this.snapshots.slice(-maxCount);
    }
  }

  /**
   * 清理过期快照（保留最近的 N 条）
   * @param keepCount 保留的快照数量
   */
  public cleanupSnapshots(keepCount: number = 50): void {
    if (this.snapshots.length <= keepCount) {
      return;
    }

    this.snapshots = this.snapshots.slice(-keepCount);
    console.log(`[ContextManager] 已清理快照，保留最近 ${keepCount} 条`);
  }

  /**
   * 回滚到指定快照
   * @param snapshot 快照对象
   * @returns 是否成功回滚
   */
  public rollbackTo(snapshot: ContextSnapshot): boolean {
    this.context.variables = this.deepClone(snapshot.variables);
    this.context.metadata = snapshot.metadata ? { ...snapshot.metadata } : undefined;
    this.notifyListeners();
    return true;
  }

  /**
   * 回滚到上一个快照
   * @returns 是否成功回滚
   */
  public rollback(): boolean {
    const snapshot = this.snapshots.pop();
    if (snapshot) {
      return this.rollbackTo(snapshot);
    }
    return false;
  }

  /**
   * 获取所有快照
   */
  public getSnapshots(): ContextSnapshot[] {
    return this.snapshots.map(s => ({
      ...s,
      variables: this.deepClone(s.variables),
    }));
  }

  /**
   * 清空所有快照
   */
  public clearSnapshots(): void {
    this.snapshots = [];
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
      metadata: {
        createdAt: new Date(),
      },
    };
    this.clearSnapshots();
    this.notifyListeners();
  }

  /**
   * 深度克隆对象
   * @param obj 要克隆的对象
   * @returns 克隆后的对象
   */
  private deepClone<T>(obj: T): T {
    return JSON.parse(JSON.stringify(obj));
  }

  /**
   * 检查上下文是否已初始化
   */
  public isInitialized(): boolean {
    return this.context.metadata?.createdAt !== undefined;
  }

  /**
   * 获取执行 ID
   */
  public getExecutionId(): string | undefined {
    return this.context.metadata?.executionId;
  }

  /**
   * 获取流程 ID
   */
  public getFlowId(): string | undefined {
    return this.context.metadata?.flowId;
  }

  /**
   * 开始事务
   * @param options 事务选项
   * @returns 事务 ID
   * @throws {FlowExecutionError} 当上下文未初始化时抛出错误
   */
  public beginTransaction(options: { nested?: boolean } = {}): string {
    if (!this.isInitialized()) {
      throw FlowExecutionError.contextManagerNotInitialized('上下文未初始化，无法开始事务');
    }

    this.transactionCounter++;
    const transactionId = `tx_${this.transactionCounter}_${Date.now()}`;
    const nestedCount = options.nested ? (this.transactionStack.length > 0 ? this.transactionStack[this.transactionStack.length - 1].nestedCount + 1 : 1) : 0;

    // 创建事务快照
    const snapshot: TransactionSnapshot = {
      variables: this.deepClone(this.context.variables),
      metadata: this.context.metadata ? { ...this.context.metadata } : undefined,
      timestamp: new Date(),
      nestedCount,
    };

    this.transactionStack.push(snapshot);

    if (!options.nested || this.transactionStack.length === 1) {
      this.activeTransactionId = transactionId;
    }

    if (process.env.NODE_ENV === 'development') {
      console.log(`[ContextManager] 事务开始：${transactionId} (嵌套层级：${nestedCount})`);
    }

    return transactionId;
  }

  /**
   * 提交事务
   * @param transactionId 事务 ID（可选，如果不传则提交最外层事务）
   * @throws {FlowExecutionError} 当没有活跃事务时抛出错误
   */
  public commitTransaction(transactionId?: string): void {
    if (this.transactionStack.length === 0) {
      throw FlowExecutionError.transactionNotActive('没有活跃的事务可以提交');
    }

    // 如果指定了事务 ID，需要找到对应的事务
    if (transactionId) {
      const targetIndex = this.transactionStack.findIndex(tx => {
        // 找到该事务 ID 对应的事务或它的嵌套事务
        return tx.nestedCount === 0 || this.transactionStack.some(t =>
          t.nestedCount > 0 && t.nestedCount <= tx.nestedCount
        );
      });

      if (targetIndex === -1) {
        throw FlowExecutionError.transactionNotFound(`事务 ${transactionId} 不存在`);
      }
    }

    // 弹出事务栈顶
    const snapshot = this.transactionStack.pop()!;

    // 如果是嵌套事务，不实际回滚，只是弹出栈
    if (snapshot.nestedCount > 0) {
      if (process.env.NODE_ENV === 'development') {
        console.log(`[ContextManager] 嵌套事务提交（无操作）`);
      }
      return;
    }

    // 清除活跃事务 ID
    this.activeTransactionId = null;

    if (process.env.NODE_ENV === 'development') {
      console.log(`[ContextManager] 事务提交成功`);
    }
  }

  /**
   * 回滚事务
   * @param transactionId 事务 ID（可选，如果不传则回滚最外层事务）
   * @throws {FlowExecutionError} 当没有活跃事务时抛出错误
   */
  public rollbackTransaction(transactionId?: string): void {
    if (this.transactionStack.length === 0) {
      throw FlowExecutionError.transactionNotActive('没有活跃的事务可以回滚');
    }

    // 弹出事务栈顶
    const snapshot = this.transactionStack.pop()!;

    // 如果是嵌套事务，不实际回滚，只是弹出栈
    if (snapshot.nestedCount > 0) {
      if (process.env.NODE_ENV === 'development') {
        console.log(`[ContextManager] 嵌套事务回滚（无操作）`);
      }
      return;
    }

    // 回滚到事务开始时的状态
    this.context.variables = this.deepClone(snapshot.variables);
    this.context.metadata = snapshot.metadata ? { ...snapshot.metadata } : undefined;

    // 清除活跃事务 ID
    this.activeTransactionId = null;

    // 通知监听器
    this.notifyListeners();

    if (process.env.NODE_ENV === 'development') {
      console.log(`[ContextManager] 事务回滚成功`);
    }
  }

  /**
   * 检查是否有活跃事务
   * @returns 是否有活跃事务
   */
  public hasActiveTransaction(): boolean {
    return this.activeTransactionId !== null;
  }

  /**
   * 获取当前事务 ID
   * @returns 当前事务 ID 或 null
   */
  public getCurrentTransactionId(): string | null {
    return this.activeTransactionId;
  }

  /**
   * 获取事务栈长度（嵌套层级）
   * @returns 嵌套层级数
   */
  public getTransactionDepth(): number {
    return this.transactionStack.filter(tx => tx.nestedCount === 0).length;
  }

  /**
   * 获取事务统计信息
   * @returns 事务统计信息
   */
  public getTransactionStats(): {
    stackLength: number;
    activeTransactionId: string | null;
    depth: number;
  } {
    return {
      stackLength: this.transactionStack.length,
      activeTransactionId: this.activeTransactionId,
      depth: this.getTransactionDepth(),
    };
  }

  /**
   * 清空事务栈（用于清理）
   */
  public clearTransactions(): void {
    this.transactionStack = [];
    this.activeTransactionId = null;
    this.transactionCounter = 0;
  }
}
