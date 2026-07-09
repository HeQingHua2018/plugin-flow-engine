/*
 * @File: ReadWriteLock.ts
 * @desc: 并发控制工具，提供读写锁、操作序列号等功能
 * @author: heqinghua
 * @date: 2026 年 04 月 16 日
 */

/**
 * 读写锁状态
 */
export enum ReadWriteLockStatus {
  IDLE = 'idle', // 空闲
  READ_LOCKED = 'read-locked', // 读锁持有
  WRITE_LOCKED = 'write-locked', // 写锁持有
}

/**
 * 读写锁选项
 */
export interface ReadWriteLockOptions {
  /**
   * 最大等待时间（毫秒）
   */
  maxWaitTime?: number;
  /**
   * 是否允许重入
   */
  reentrant?: boolean;
}

/**
 * 读写锁类
 * 支持多个读锁或单个写锁的并发控制
 */
export class ReadWriteLock {
  private status: ReadWriteLockStatus = ReadWriteLockStatus.IDLE;
  private readers: number = 0;
  private writers: number = 0;
  private waitingWriters: number = 0;
  private queue: Array<{ resolve: () => void; isWrite: boolean }> = [];
  private options: Required<ReadWriteLockOptions>;

  constructor(options: ReadWriteLockOptions = {}) {
    this.options = {
      maxWaitTime: options.maxWaitTime ?? 5000,
      reentrant: options.reentrant ?? true,
    };
  }

  /**
   * 获取锁状态
   */
  getStatus(): ReadWriteLockStatus {
    return this.status;
  }

  /**
   * 获取当前读者数量
   */
  getReaderCount(): number {
    return this.readers;
  }

  /**
   * 获取当前 writer 数量
   */
  getWriterCount(): number {
    return this.writers;
  }

  /**
   * 获取等待的 writer 数量
   */
  getWaitingWriters(): number {
    return this.waitingWriters;
  }

  /**
   * 获取锁统计信息
   */
  getStats(): {
    status: ReadWriteLockStatus;
    readers: number;
    writers: number;
    waitingWriters: number;
    queueLength: number;
  } {
    return {
      status: this.status,
      readers: this.readers,
      writers: this.writers,
      waitingWriters: this.waitingWriters,
      queueLength: this.queue.length,
    };
  }

  /**
   * 获取读锁（可重入）
   * @param timeout 超时时间（毫秒）
   */
  async acquireRead(timeout?: number): Promise<void> {
    const startTime = Date.now();
    const timeoutMs = timeout ?? this.options.maxWaitTime;

    while (true) {
      if (this.status === ReadWriteLockStatus.IDLE ||
          this.status === ReadWriteLockStatus.READ_LOCKED) {
        this.readers++;
        if (this.readers === 1) {
          this.status = ReadWriteLockStatus.READ_LOCKED;
        }
        return;
      }

      // 检查超时
      if (Date.now() - startTime > timeoutMs) {
        throw new Error('获取读锁超时');
      }

      // 等待锁释放
      await this.waitForLock(true);
    }
  }

  /**
   * 释放读锁
   */
  releaseRead(): void {
    if (this.readers > 0) {
      this.readers--;
      if (this.readers === 0) {
        this.status = ReadWriteLockStatus.IDLE;
        this.notifyNext();
      }
    }
  }

  /**
   * 获取写锁（可重入）
   * @param timeout 超时时间（毫秒）
   */
  async acquireWrite(timeout?: number): Promise<void> {
    const startTime = Date.now();
    const timeoutMs = timeout ?? this.options.maxWaitTime;

    this.waitingWriters++;

    try {
      while (true) {
        if (this.status === ReadWriteLockStatus.IDLE &&
            this.waitingWriters === 1 &&
            this.queue.length === 0) {
          this.writers++;
          this.status = ReadWriteLockStatus.WRITE_LOCKED;
          return;
        }

        // 检查超时
        if (Date.now() - startTime > timeoutMs) {
          throw new Error('获取写锁超时');
        }

        // 等待锁释放
        await this.waitForLock(false);
      }
    } finally {
      this.waitingWriters--;
    }
  }

  /**
   * 释放写锁
   */
  releaseWrite(): void {
    if (this.writers > 0) {
      this.writers--;
      this.status = ReadWriteLockStatus.IDLE;
      this.notifyNext();
    }
  }

  /**
   * 等待锁（内部方法）
   */
  private waitForLock(isRead: boolean): Promise<void> {
    return new Promise((resolve) => {
      this.queue.push({ resolve, isWrite: !isRead });
    });
  }

  /**
   * 通知下一个等待者
   */
  private notifyNext(): void {
    if (this.queue.length === 0) {
      return;
    }

    // 优先处理写锁请求（避免写锁饥饿）
    const writeIndex = this.queue.findIndex(item => item.isWrite);
    const readIndex = this.queue.findIndex(item => !item.isWrite);

    let targetIndex: number;
    if (writeIndex !== -1 && readIndex === -1) {
      // 有写请求，没有读请求，处理写请求
      targetIndex = writeIndex;
    } else if (writeIndex !== -1 && readIndex !== -1) {
      // 都有请求，优先处理写请求（避免写锁饥饿）
      targetIndex = writeIndex;
    } else {
      // 只有读请求
      targetIndex = readIndex;
    }

    const target = this.queue[targetIndex];
    this.queue.splice(targetIndex, 1);
    target.resolve();
  }
}

/**
 * 操作序列号
 * 用于保证操作的顺序一致性
 */
export class OperationSequence {
  private current: number = 0;
  private locks: Map<string, number> = new Map();
  private waiting: Map<string, Array<(seq: number) => void>> = new Map();

  /**
   * 获取全局操作序列号
   */
  next(): number {
    return ++this.current;
  }

  /**
   * 获取当前操作序列号
   */
  getCurrent(): number {
    return this.current;
  }

  /**
   * 获取资源锁定的序列号
   * @param resourceId 资源 ID
   */
  getLockSequence(resourceId: string): number {
    if (!this.locks.has(resourceId)) {
      this.locks.set(resourceId, 0);
    }
    return this.locks.get(resourceId)!;
  }

  /**
   * 锁定资源并获取序列号
   * @param resourceId 资源 ID
   */
  lock(resourceId: string): number {
    const currentSeq = this.next();
    const lockedSeq = currentSeq + 1;
    this.locks.set(resourceId, lockedSeq);
    return lockedSeq;
  }

  /**
   * 释放资源锁定
   * @param resourceId 资源 ID
   * @param expectedSeq 期望的序列号（用于验证）
   */
  unlock(resourceId: string, expectedSeq?: number): void {
    const currentSeq = this.locks.get(resourceId);
    if (expectedSeq !== undefined && currentSeq !== expectedSeq) {
      throw new Error(`资源 ${resourceId} 序列号不匹配：期望 ${expectedSeq}, 实际 ${currentSeq}`);
    }
    this.locks.delete(resourceId);
  }

  /**
   * 等待资源可用
   * @param resourceId 资源 ID
   */
  async waitForResource(resourceId: string): Promise<number> {
    return new Promise((resolve) => {
      if (!this.waiting.has(resourceId)) {
        this.waiting.set(resourceId, []);
      }
      this.waiting.get(resourceId)!.push(resolve);
    });
  }

  /**
   * 通知资源可用
   * @param resourceId 资源 ID
   */
  notifyResourceAvailable(resourceId: string): void {
    const waiters = this.waiting.get(resourceId);
    if (waiters && waiters.length > 0) {
      const waiter = waiters.shift()!;
      waiter(this.locks.get(resourceId) ?? 0);
    }
  }

  /**
   * 获取序列号统计信息
   */
  getStats(): {
    current: number;
    lockedResources: number;
    waitingResources: number;
  } {
    return {
      current: this.current,
      lockedResources: this.locks.size,
      waitingResources: this.waiting.size,
    };
  }

  /**
   * 重置所有状态
   */
  reset(): void {
    this.current = 0;
    this.locks.clear();
    this.waiting.clear();
  }
}

// 导出默认实例
export const concurrencyDebugger = {
  enabled: false,
  setEnabled: (enabled: boolean) => {
    concurrencyDebugger.enabled = enabled;
  },
  isEnabled: () => {
    return concurrencyDebugger.enabled;
  },
  log: () => { /* 简化版本，不实现日志 */ },
  getLogs: () => [],
  getRecentLogs: () => [],
  filterLogs: () => [],
  clearLogs: () => {},
  getStats: () => ({ totalLogs: 0, uniqueThreads: 0, actions: {}, resources: {} }),
  generateReport: () => '',
};
