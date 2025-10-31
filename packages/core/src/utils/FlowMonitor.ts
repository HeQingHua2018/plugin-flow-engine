/*
 * @File: FlowMonitor.ts
 * @desc: 流程执行监控器，提供性能监控和指标收集功能
 * @author: heqinghua
 * @date: 2025年01月27日
 */

import { PluginNodeType, NodeStatus } from "@plugin-flow-engine/type/core";

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
  status: NodeStatus;
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
  pluginNodeType: PluginNodeType | '';
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
  private nodeMetadata: Map<string, { nodeName: string; pluginNodeType: PluginNodeType | '' }> = new Map();

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
   * @param nodeName 节点名称（可选）
   * @param pluginNodeType 插件节点类型（可选）
   */
  public recordNodeExecution(
    nodeId: string,
    executionTime: number,
    status: NodeStatus,
    nodeName?: string,
    pluginNodeType?: PluginNodeType
  ): void {
    // 记录元数据（如提供）
    if (nodeName || pluginNodeType) {
      const prev = this.nodeMetadata.get(nodeId) ?? { nodeName: '', pluginNodeType: '' };
      this.nodeMetadata.set(nodeId, {
        nodeName: nodeName ?? prev.nodeName,
        pluginNodeType: (pluginNodeType ?? prev.pluginNodeType) as PluginNodeType | '',
      });
    }

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
  }

  /**
   * 获取当前性能指标
   * @returns 性能指标
   */
  public getCurrentMetrics(): PerformanceMetrics {
    let totalExecutionTime = 0;
    let executedNodes = 0;
    let successCount = 0;
    let failureCount = 0;
    let slowestNode: string | null = null;
    let fastestNode: string | null = null;
    let slowestTime = -Infinity;
    let fastestTime = Infinity;

    const nodeExecutionTimesSummary: Map<string, number> = new Map();

    this.nodeExecutionTimes.forEach((times, nodeId) => {
      const totalTime = times.reduce((sum, time) => sum + time, 0);
      nodeExecutionTimesSummary.set(nodeId, totalTime);
      totalExecutionTime += totalTime;
      executedNodes++;

      // 更新最慢和最快节点
      if (totalTime > slowestTime) {
        slowestTime = totalTime;
        slowestNode = nodeId;
      }
      if (totalTime < fastestTime) {
        fastestTime = totalTime;
        fastestNode = nodeId;
      }
    });

    // 计算成功和失败数量
    this.nodeSuccessCounts.forEach((count) => {
      successCount += count;
    });
    this.nodeFailureCounts.forEach((count) => {
      failureCount += count;
    });

    const totalNodes = this.nodeExecutionCounts.size;
    const averageNodeExecutionTime = totalNodes > 0 ? totalExecutionTime / totalNodes : 0;
    const failureRate = (successCount + failureCount) > 0 ? (failureCount / (successCount + failureCount)) * 100 : 0;
    const successRate = (successCount + failureCount) > 0 ? (successCount / (successCount + failureCount)) * 100 : 0;

    return {
      totalExecutionTime,
      nodeExecutionTimes: nodeExecutionTimesSummary,
      averageNodeExecutionTime,
      slowestNode,
      fastestNode,
      successRate,
      failureRate,
      totalNodes,
      executedNodes,
      skippedNodes: totalNodes - executedNodes
    };
  }

  /**
   * 获取内存使用指标
   * @returns 内存使用指标
   */
  public getMemoryMetrics(): MemoryMetrics {
    const usedMemory = this.getCurrentMemoryUsage();
    const peakMemory = this.peakMemory;
    const memoryLeaks = this.detectMemoryLeaks();
    const garbageCollections = this.memorySnapshots.length;

    return {
      usedMemory,
      peakMemory,
      memoryLeaks,
      garbageCollections
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

    this.nodeExecutionTimes.forEach((times, nodeId) => {
      const totalTime = times.reduce((sum: number, time: number) => sum + time, 0);
      const averageTime = totalTime / times.length;
      const minTime = Math.min(...times);
      const maxTime = Math.max(...times);
      const executionCount = this.nodeExecutionCounts.get(nodeId) || 0;
      const successCount = this.nodeSuccessCounts.get(nodeId) || 0;
      const failureCount = this.nodeFailureCounts.get(nodeId) || 0;
      const successRate = executionCount > 0 ? (successCount / executionCount) * 100 : 0;

      const meta = this.nodeMetadata.get(nodeId);

      statistics.push({
        nodeId,
        nodeName: meta?.nodeName ?? nodeId,
        pluginNodeType: (meta?.pluginNodeType ?? '') as PluginNodeType | '',
        executionCount,
        totalExecutionTime: totalTime,
        averageExecutionTime: averageTime,
        successCount,
        failureCount,
        successRate,
        minExecutionTime: minTime,
        maxExecutionTime: maxTime
      });
    });

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

    // 趋势分析（基于最近的内存快照）
    const recentSnapshots = this.memorySnapshots.slice(-10);
    const trend = this.calculateTrend(recentSnapshots);
    if (trend > 0) {
      recommendations.push('内存使用呈上升趋势，建议优化内存管理');
    } else if (trend < 0) {
      recommendations.push('内存使用呈下降趋势');
    }

    return recommendations;
  }

  /**
   * 确定整体执行状态
   * @returns 执行状态
   */
  private determineOverallStatus(): NodeStatus {
    // 计算整体状态：如果有失败则FAILED；如果全部成功则SUCCESS；否则PENDING（表示部分执行或未完成）
    const total = Array.from(this.nodeExecutionCounts.values()).reduce((a, b) => a + b, 0);
    const failures = Array.from(this.nodeFailureCounts.values()).reduce((a, b) => a + b, 0);
    const successes = Array.from(this.nodeSuccessCounts.values()).reduce((a, b) => a + b, 0);
    if (failures > 0) return NodeStatus.FAILED;
    if (successes === total && total > 0) return NodeStatus.SUCCESS;
    return NodeStatus.PENDING;
  }

  /**
   * 重置监控指标
   */
  private resetMetrics(): void {
    this.nodeExecutionTimes.clear();
    this.nodeExecutionCounts.clear();
    this.nodeSuccessCounts.clear();
    this.nodeFailureCounts.clear();
    this.memorySnapshots = [];
    this.peakMemory = 0;
    this.nodeMetadata.clear();
  }

  /**
   * 记录内存快照
   */
  private takeMemorySnapshot(): void {
    const currentMemory = this.getCurrentMemoryUsage();
    this.memorySnapshots.push(currentMemory);
    if (currentMemory > this.peakMemory) {
      this.peakMemory = currentMemory;
    }
  }

  /**
   * 获取当前内存使用情况（示例实现）
   * @returns 当前内存使用值
   */
  private getCurrentMemoryUsage(): number {
    // 这里可以使用更精确的内存监控方法，例如 Node.js 的 process.memoryUsage()
    return Math.random() * 100;
  }

  /**
   * 检测潜在的内存泄漏（示例实现）
   * @returns 可能的泄漏次数
   */
  private detectMemoryLeaks(): number {
    // 简化的泄漏检测逻辑：连续的快照中出现异常增长
    let leaks = 0;
    for (let i = 1; i < this.memorySnapshots.length; i++) {
      if (this.memorySnapshots[i] > this.memorySnapshots[i - 1] * 1.5) {
        leaks++;
      }
    }
    return leaks;
  }

  /**
   * 计算趋势（示例实现）
   * @param values 最近的快照值
   * @returns 趋势值（正表示上升，负表示下降）
   */
  private calculateTrend(values: number[]): number {
    if (values.length < 2) return 0;
    let trend = 0;
    for (let i = 1; i < values.length; i++) {
      trend += values[i] - values[i - 1];
    }
    return trend;
  }
}

export const flowMonitor = new FlowMonitor();
