/*
 * @File: FlowMonitor.ts
 * @desc: 流程执行监控器，提供性能监控和指标收集功能
 * @author: heqinghua
 * @date: 2025年01月27日
 */

import { NodeStatus } from '../type.d';

/**
 * 性能指标接口
 */
export interface PerformanceMetrics {
  totalExecutionTime: number;
  nodeExecutionTimes: Map<string, number>;
  averageNodeExecutionTime: number;
  slowestNode: string | null;
  fastestNode: string | null;
  successRate: number;
  failureRate: number;
  totalNodes: number;
  executedNodes: number;
  skippedNodes: number;
}

/**
 * 内存使用指标接口
 */
export interface MemoryMetrics {
  usedMemory: number;
  peakMemory: number;
  memoryLeaks: number;
  garbageCollections: number;
}

/**
 * 执行报告接口
 */
export interface ExecutionReport {
  flowId: string;
  startTime: Date;
  endTime: Date;
  duration: number;
  status: 'success' | 'failed' | 'partial';
  performanceMetrics: PerformanceMetrics;
  memoryMetrics: MemoryMetrics;
  nodeStatistics: NodeStatistics[];
  recommendations: string[];
}

/**
 * 节点统计信息接口
 */
export interface NodeStatistics {
  nodeId: string;
  nodeName: string;
  nodeType: string;
  executionCount: number;
  totalExecutionTime: number;
  averageExecutionTime: number;
  successCount: number;
  failureCount: number;
  successRate: number;
  minExecutionTime: number;
  maxExecutionTime: number;
}

/**
 * 流程执行监控器类
 * 提供性能监控、指标收集和报告生成功能
 */
export class FlowMonitor {
  private startTime: Date | null = null;
  private endTime: Date | null = null;
  private nodeExecutionTimes: Map<string, number[]> = new Map();
  private nodeExecutionCounts: Map<string, number> = new Map();
  private nodeSuccessCounts: Map<string, number> = new Map();
  private nodeFailureCounts: Map<string, number> = new Map();
  private memorySnapshots: number[] = [];
  private peakMemory: number = 0;

  /**
   * 开始监控
   * @param flowId 流程ID
   */
  public startMonitoring(flowId: string): void {
    this.startTime = new Date();
    this.endTime = null;
    this.resetMetrics();
    
    // 记录初始内存使用
    this.takeMemorySnapshot();
    
    console.log(`[FlowMonitor] 开始监控流程: ${flowId}`);
  }

  /**
   * 结束监控
   * @param flowId 流程ID
   * @returns 执行报告
   */
  public stopMonitoring(flowId: string): ExecutionReport {
    this.endTime = new Date();
    
    // 记录最终内存使用
    this.takeMemorySnapshot();
    
    const report = this.generateReport(flowId);
    console.log(`[FlowMonitor] 监控结束，流程: ${flowId}，耗时: ${report.duration}ms`);
    
    return report;
  }

  /**
   * 记录节点执行时间
   * @param nodeId 节点ID
   * @param executionTime 执行时间（毫秒）
   * @param status 执行状态
   */
  public recordNodeExecution(
    nodeId: string,
    executionTime: number,
    status: NodeStatus
  ): void {
    // 记录执行时间
    if (!this.nodeExecutionTimes.has(nodeId)) {
      this.nodeExecutionTimes.set(nodeId, []);
    }
    this.nodeExecutionTimes.get(nodeId)!.push(executionTime);

    // 记录执行次数
    const currentCount = this.nodeExecutionCounts.get(nodeId) || 0;
    this.nodeExecutionCounts.set(nodeId, currentCount + 1);

    // 记录成功/失败次数
    if (status === NodeStatus.SUCCESS) {
      const currentSuccess = this.nodeSuccessCounts.get(nodeId) || 0;
      this.nodeSuccessCounts.set(nodeId, currentSuccess + 1);
    } else if (status === NodeStatus.FAILED) {
      const currentFailure = this.nodeFailureCounts.get(nodeId) || 0;
      this.nodeFailureCounts.set(nodeId, currentFailure + 1);
    }

    // 定期记录内存使用
    if (this.nodeExecutionCounts.get(nodeId)! % 10 === 0) {
      this.takeMemorySnapshot();
    }
  }

  /**
   * 获取当前性能指标
   * @returns 性能指标
   */
  public getCurrentMetrics(): PerformanceMetrics {
    const totalExecutionTime = this.endTime && this.startTime 
      ? this.endTime.getTime() - this.startTime.getTime() 
      : 0;

    const nodeExecutionTimes = new Map<string, number>();
    let totalNodeTime = 0;
    let slowestNode: string | null = null;
    let fastestNode: string | null = null;
    let slowestTime = 0;
    let fastestTime = Infinity;

    for (const [nodeId, times] of this.nodeExecutionTimes as any) {
      const totalTime = times.reduce((sum: number, time: number) => sum + time, 0);
      nodeExecutionTimes.set(nodeId, totalTime);
      totalNodeTime += totalTime;

      if (totalTime > slowestTime) {
        slowestTime = totalTime;
        slowestNode = nodeId;
      }
      if (totalTime < fastestTime) {
        fastestTime = totalTime;
        fastestNode = nodeId;
      }
    }

    const totalExecutions = Array.from(this.nodeExecutionCounts.values())
      .reduce((sum, count) => sum + count, 0);
    const totalSuccesses = Array.from(this.nodeSuccessCounts.values())
      .reduce((sum, count) => sum + count, 0);
    const totalFailures = Array.from(this.nodeFailureCounts.values())
      .reduce((sum, count) => sum + count, 0);

    return {
      totalExecutionTime,
      nodeExecutionTimes,
      averageNodeExecutionTime: totalExecutions > 0 ? totalNodeTime / totalExecutions : 0,
      slowestNode,
      fastestNode,
      successRate: totalExecutions > 0 ? (totalSuccesses / totalExecutions) * 100 : 0,
      failureRate: totalExecutions > 0 ? (totalFailures / totalExecutions) * 100 : 0,
      totalNodes: this.nodeExecutionCounts.size,
      executedNodes: totalExecutions,
      skippedNodes: 0 // 需要从执行历史中计算
    };
  }

  /**
   * 获取内存指标
   * @returns 内存指标
   */
  public getMemoryMetrics(): MemoryMetrics {
    const currentMemory = this.getCurrentMemoryUsage();
    const usedMemory = currentMemory;
    const peakMemory = this.peakMemory;
    
    // 简单的内存泄漏检测：如果内存使用持续增长
    const memoryLeaks = this.memorySnapshots.length > 10 
      ? this.detectMemoryLeaks() 
      : 0;

    return {
      usedMemory,
      peakMemory,
      memoryLeaks,
      garbageCollections: 0 // 需要更复杂的实现
    };
  }

  /**
   * 生成执行报告
   * @param flowId 流程ID
   * @returns 执行报告
   */
  private generateReport(flowId: string): ExecutionReport {
    const performanceMetrics = this.getCurrentMetrics();
    const memoryMetrics = this.getMemoryMetrics();
    const nodeStatistics = this.generateNodeStatistics();
    const recommendations = this.generateRecommendations(performanceMetrics, memoryMetrics);

    return {
      flowId,
      startTime: this.startTime!,
      endTime: this.endTime!,
      duration: performanceMetrics.totalExecutionTime,
      status: this.determineOverallStatus(),
      performanceMetrics,
      memoryMetrics,
      nodeStatistics,
      recommendations
    };
  }

  /**
   * 生成节点统计信息
   * @returns 节点统计信息数组
   */
  private generateNodeStatistics(): NodeStatistics[] {
    const statistics: NodeStatistics[] = [];

    for (const [nodeId, times] of this.nodeExecutionTimes as any) {
      const totalTime = times.reduce((sum: number, time: number) => sum + time, 0);
      const averageTime = totalTime / times.length;
      const minTime = Math.min(...times);
      const maxTime = Math.max(...times);
      const executionCount = this.nodeExecutionCounts.get(nodeId) || 0;
      const successCount = this.nodeSuccessCounts.get(nodeId) || 0;
      const failureCount = this.nodeFailureCounts.get(nodeId) || 0;
      const successRate = executionCount > 0 ? (successCount / executionCount) * 100 : 0;

      statistics.push({
        nodeId,
        nodeName: nodeId, // 需要从执行历史中获取
        nodeType: 'unknown', // 需要从执行历史中获取
        executionCount,
        totalExecutionTime: totalTime,
        averageExecutionTime: averageTime,
        successCount,
        failureCount,
        successRate,
        minExecutionTime: minTime,
        maxExecutionTime: maxTime
      });
    }

    return statistics;
  }

  /**
   * 生成优化建议
   * @param performanceMetrics 性能指标
   * @param memoryMetrics 内存指标
   * @returns 建议列表
   */
  private generateRecommendations(
    performanceMetrics: PerformanceMetrics,
    memoryMetrics: MemoryMetrics
  ): string[] {
    const recommendations: string[] = [];

    // 性能建议
    if (performanceMetrics.averageNodeExecutionTime > 1000) {
      recommendations.push('平均节点执行时间过长，建议优化节点逻辑');
    }

    if (performanceMetrics.failureRate > 10) {
      recommendations.push('节点失败率较高，建议检查错误处理逻辑');
    }

    if (performanceMetrics.slowestNode) {
      recommendations.push(`节点 ${performanceMetrics.slowestNode} 执行时间最长，建议重点优化`);
    }

    // 内存建议
    if (memoryMetrics.memoryLeaks > 0) {
      recommendations.push('检测到潜在内存泄漏，建议检查资源清理逻辑');
    }

    if (memoryMetrics.peakMemory > 100 * 1024 * 1024) { // 100MB
      recommendations.push('内存使用峰值较高，建议优化内存使用');
    }

    return recommendations;
  }

  /**
   * 确定整体状态
   * @returns 整体状态
   */
  private determineOverallStatus(): 'success' | 'failed' | 'partial' {
    const totalExecutions = Array.from(this.nodeExecutionCounts.values())
      .reduce((sum, count) => sum + count, 0);
    const totalFailures = Array.from(this.nodeFailureCounts.values())
      .reduce((sum, count) => sum + count, 0);

    if (totalFailures === 0) {
      return 'success';
    } else if (totalFailures === totalExecutions) {
      return 'failed';
    } else {
      return 'partial';
    }
  }

  /**
   * 重置指标
   */
  private resetMetrics(): void {
    this.nodeExecutionTimes.clear();
    this.nodeExecutionCounts.clear();
    this.nodeSuccessCounts.clear();
    this.nodeFailureCounts.clear();
    this.memorySnapshots = [];
    this.peakMemory = 0;
  }

  /**
   * 记录内存快照
   */
  private takeMemorySnapshot(): void {
    const memoryUsage = this.getCurrentMemoryUsage();
    this.memorySnapshots.push(memoryUsage);
    
    if (memoryUsage > this.peakMemory) {
      this.peakMemory = memoryUsage;
    }
  }

  /**
   * 获取当前内存使用量
   * @returns 内存使用量（字节）
   */
  private getCurrentMemoryUsage(): number {
    // performance.memory is not standard and might not exist, so check for its existence and type safety
    if (
      typeof performance !== 'undefined' &&
      typeof (performance as any).memory !== 'undefined' &&
      typeof (performance as any).memory.usedJSHeapSize === 'number'
    ) {
      return (performance as any).memory.usedJSHeapSize;
    }
    return 0;
  }

  /**
   * 检测内存泄漏
   * @returns 内存泄漏数量
   */
  private detectMemoryLeaks(): number {
    if (this.memorySnapshots.length < 10) return 0;

    const recent = this.memorySnapshots.slice(-10);
    const trend = this.calculateTrend(recent);
    
    // 如果内存使用呈上升趋势，可能存在内存泄漏
    return trend > 0.1 ? 1 : 0;
  }

  /**
   * 计算趋势
   * @param values 数值数组
   * @returns 趋势值
   */
  private calculateTrend(values: number[]): number {
    if (values.length < 2) return 0;

    const first = values[0];
    const last = values[values.length - 1];
    
    return (last - first) / first;
  }
}

// 导出单例实例
export const flowMonitor = new FlowMonitor();
