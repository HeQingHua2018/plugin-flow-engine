/*
 * @File: ConcurrencyControl.test.ts
 * @desc: 并发控制工具单元测试
 */
import { describe, it, expect, beforeEach } from '@jest/globals';
import { ReadWriteLock, OperationSequence, ConcurrencyDebugger } from './ConcurrencyControl';

describe('ReadWriteLock', () => {
  let lock: ReadWriteLock;

  beforeEach(() => {
    lock = new ReadWriteLock({ maxWaitTime: 1000, reentrant: true });
  });

  describe('基本操作', () => {
    it('初始状态应为 idle', () => {
      expect(lock.getStatus()).toBe('idle');
    });

    it('读锁应能成功获取', async () => {
      await lock.acquireRead();
      expect(lock.getStatus()).toBe('read-locked');
      lock.releaseRead();
    });

    it('写锁应能成功获取', async () => {
      await lock.acquireWrite();
      expect(lock.getStatus()).toBe('write-locked');
      lock.releaseWrite();
    });

    it('释放锁后应回到 idle', async () => {
      await lock.acquireWrite();
      lock.releaseWrite();
      expect(lock.getStatus()).toBe('idle');
    });
  });

  describe('并发读', () => {
    it('多个读锁应可同时存在', async () => {
      await lock.acquireRead();
      await lock.acquireRead();
      expect(lock.getStatus()).toBe('read-locked');
      lock.releaseRead();
      lock.releaseRead();
    });
  });

  describe('读写互斥', () => {
    it('读锁存在时写锁应等待', async () => {
      await lock.acquireRead();
      const writePromise = lock.acquireWrite();
      expect(lock.getStatus()).toBe('read-locked');
      lock.releaseRead();
      await writePromise;
      expect(lock.getStatus()).toBe('write-locked');
      lock.releaseWrite();
    });
  });

  describe('统计信息', () => {
    it('getStats 应返回完整的状态信息', async () => {
      const stats = lock.getStats();
      expect(stats).toHaveProperty('status');
      expect(stats).toHaveProperty('readers');
      expect(stats).toHaveProperty('writers');
      expect(stats).toHaveProperty('waitingWriters');
      expect(stats).toHaveProperty('queueLength');
    });
  });
});

describe('OperationSequence', () => {
  let seq: OperationSequence;

  beforeEach(() => {
    seq = new OperationSequence();
  });

  it('初始值应为 0', () => {
    expect(seq.getCurrent()).toBe(0);
  });

  it('next 应将计数器加 1', () => {
    const v1 = seq.next();
    const v2 = seq.next();
    expect(v2).toBe(v1 + 1);
  });

  it('reset 应将计数器重置为 0', () => {
    seq.next();
    seq.next();
    seq.next();
    seq.reset();
    expect(seq.getCurrent()).toBe(0);
  });

  it('getStats 应返回当前值', () => {
    seq.next();
    const stats = seq.getStats();
    expect(stats).toHaveProperty('current');
  });
});

describe('ConcurrencyDebugger', () => {
  it('getInstance 应返回单例', () => {
    const instance1 = ConcurrencyDebugger.getInstance();
    const instance2 = ConcurrencyDebugger.getInstance();
    expect(instance1).toBe(instance2);
  });

  it('启用调试后 isEnabled 应返回 true', () => {
    const debugger_ = ConcurrencyDebugger.getInstance();
    debugger_.setEnabled(true);
    expect(debugger_.isEnabled()).toBe(true);
  });

  it('禁用调试后 isEnabled 应返回 false', () => {
    const debugger_ = ConcurrencyDebugger.getInstance();
    debugger_.setEnabled(false);
    expect(debugger_.isEnabled()).toBe(false);
  });

  it('clearLogs 应清空日志', () => {
    const debugger_ = ConcurrencyDebugger.getInstance();
    debugger_.clearLogs();
    expect(debugger_.getLogs()).toHaveLength(0);
  });
});
