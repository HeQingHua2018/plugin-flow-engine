/*
 * @File: FlowVersion.ts
 * @desc: 流程版本管理，支持版本控制、回滚、比较和 A/B 测试
 * @author: heqinghua
 * @date: 2026 年 04 月 10 日
 */

import type { FlowData } from '@chloehe/logic-engine-common';
import { FlowExecutionError, FlowErrorCode } from '@chloehe/logic-engine-common';

/**
 * 流量分配策略
 */
export type TrafficAllocationStrategy = 'percentage' | 'userTag' | 'hybrid';

/**
 * A/B 测试流量分配配置
 */
export interface TrafficAllocation {
  /**
   * 分配百分比 (0-100)
   */
  percentage: number;

  /**
   * 用户标签过滤
   * 只有匹配所有标签的用户才会被分配到该组
   */
  userTags?: string[];
}

/**
 * A/B 测试组配置
 */
export interface ABTestGroup {
  /**
   * 组标识（如：control, variant_a, variant_b）
   */
  groupKey: string;

  /**
   * 版本号
   */
  version: string;

  /**
   * 流量分配配置
   */
  allocation: TrafficAllocation;

  /**
   * 组描述
   */
  description?: string;

  /**
   * 是否启用该组
   */
  enabled: boolean;
}

/**
 * A/B 测试结果指标
 */
export interface ABTestMetrics {
  /**
   * 曝光次数
   */
  impressions: number;

  /**
   * 点击次数
   */
  clicks: number;

  /**
   * 转化次数
   */
  conversions: number;

  /**
   * 平均处理时长（毫秒）
   */
  avgProcessingTime: number;

  /**
   * 总处理时长（毫秒）
   */
  totalProcessingTime: number;

  /**
   * 错误次数
   */
  errors: number;

  /**
   * 成功次数
   */
  successes: number;

  /**
   * 记录的用户 ID 集合（去重）
   */
  uniqueUsers: Set<string>;

  /**
   * 最近一次更新的时间
   */
  lastUpdated: Date;
}

/**
 * A/B 测试任务配置
 */
export interface ABTestConfig {
  /**
   * 测试标识
   */
  testId: string;

  /**
   * 测试名称
   */
  testName: string;

  /**
   * 创建时间
   */
  createdAt: Date;

  /**
   * 结束时间（可选）
   */
  endDate?: Date;

  /**
   * 测试状态
   */
  status: ABTestStatus;

  /**
   * 测试组列表
   */
  groups: ABTestGroup[];

  /**
   * 测试结果指标
   */
  metrics: Map<string, ABTestMetrics>;

  /**
   * 测试描述
   */
  description?: string;

  /**
   * 元数据
   */
  metadata?: Record<string, any>;
}

/**
 * A/B 测试状态
 */
export enum ABTestStatus {
  DRAFT = 'draft',
  RUNNING = 'running',
  PAUSED = 'paused',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

/**
 * A/B 测试分配结果
 */
export interface ABTestAssignment {
  /**
   * 是否进行了 A/B 测试分配
   */
  assigned: boolean;

  /**
   * 测试 ID
   */
  testId?: string;

  /**
   * 分配的组别
   */
  groupKey?: string;

  /**
   * 对应的版本号
   */
  version?: string;

  /**
   * 分配原因
   */
  reason?: string;
}

/**
 * A/B 测试对比分析结果
 */
export interface ABTestComparison {
  /**
   * 对比的组别
   */
  groups: string[];

  /**
   * 指标对比
   */
  metrics: {
    /**
     * 曝光对比
     */
    impressions: {
      control: number;
      variant: number;
      difference: number;
      percentageChange: number;
    };

    /**
     * 点击对比
     */
    clicks: {
      control: number;
      variant: number;
      difference: number;
      percentageChange: number;
    };

    /**
     * 转化对比
     */
    conversions: {
      control: number;
      variant: number;
      difference: number;
      percentageChange: number;
    };

    /**
     * 转化率对比
     */
    conversionRate: {
      control: number;
      variant: number;
      difference: number;
      percentageChange: number;
    };

    /**
     * 点击率对比
     */
    clickThroughRate: {
      control: number;
      variant: number;
      difference: number;
      percentageChange: number;
    };

    /**
     * 平均处理时长对比
     */
    avgProcessingTime: {
      control: number;
      variant: number;
      difference: number;
      percentageChange: number;
    };

    /**
     * 错误率对比
     */
    errorRate: {
      control: number;
      variant: number;
      difference: number;
      percentageChange: number;
    };
  };

  /**
   * 统计显著性（简化版，实际项目可引入统计库）
   */
  statisticalSignificance?: {
    isSignificant: boolean;
    pValue?: number;
    confidenceLevel?: number;
  };

  /**
   * 获胜组别（基于转化率）
   */
  winner?: string;

  /**
   * 分析时间
   */
  analyzedAt: Date;
}

/**
 * 发布状态
 */
export enum PublishStatus {
  DRAFT = 'draft', // 草稿
  PUBLISHED = 'published', // 已发布
  UNPUBLISHED = 'unpublished', // 已取消发布
  LOCKED = 'locked', // 已锁定
}

/**
 * 发布版本信息
 */
export interface PublishVersion {
  /**
   * 版本号
   */
  version: string;

  /**
   * 发布状态
   */
  status: PublishStatus;

  /**
   * 是否锁定（防止修改）
   */
  locked: boolean;

  /**
   * 发布/取消发布时间
   */
  publishedAt?: Date;

  /**
   * 发布/取消发布操作者
   */
  publishedBy?: string;

  /**
   * 发布描述
   */
  publishDescription?: string;

  /**
   * 锁定时间
   */
  lockedAt?: Date;

  /**
   * 锁定原因
   */
  lockReason?: string;

  /**
   * 锁定操作者
   */
  lockedBy?: string;
}

/**
 * 发布历史记录
 */
export interface PublishHistory {
  /**
   * 历史记录 ID
   */
  id: string;

  /**
   * 版本号
   */
  version: string;

  /**
   * 操作类型
   */
  action: 'publish' | 'unpublish' | 'lock' | 'unlock' | 'release_lock';

  /**
   * 操作者
   */
  operator: string;

  /**
   * 操作时间
   */
  timestamp: Date;

  /**
   * 操作描述
   */
  description: string;

  /**
   * 旧状态
   */
  previousStatus: PublishStatus;

  /**
   * 新状态
   */
  newStatus: PublishStatus;

  /**
   * 元数据
   */
  metadata?: Record<string, any>;
}

/**
 * 发布配置
 */
export interface PublishConfig {
  /**
   * 最大保留发布历史数量
   */
  maxHistory: number;

  /**
   * 是否允许取消发布
   */
  allowUnpublish: boolean;

  /**
   * 是否允许解锁
   */
  allowUnlock: boolean;

  /**
   * 自动锁定已发布版本
   */
  autoLockPublished: boolean;

  /**
   * 发布版本前必须满足的条件
   */
  preconditions?: {
    /**
     * 最小版本号
     */
    minVersion?: string;

    /**
     * 必须有描述
     */
    requireDescription?: boolean;

    /**
     * 必须有发布说明
     */
    requirePublishDescription?: boolean;
  };
}

/**
 * 默认发布配置
 */
const defaultPublishConfig: PublishConfig = {
  maxHistory: 100,
  allowUnpublish: true,
  allowUnlock: true,
  autoLockPublished: true,
  preconditions: {
    requireDescription: true,
    requirePublishDescription: true,
  },
};

/**
 * 流程版本信息
 */
export interface FlowVersion {
  /**
   * 版本号
   */
  version: string;

  /**
   * 流程数据
   */
  flowData: FlowData;

  /**
   * 创建时间
   */
  createdAt: Date;

  /**
   * 创建者
   */
  createdBy?: string;

  /**
   * 版本描述
   */
  description?: string;

  /**
   * 是否当前激活版本
   */
  isActive: boolean;

  /**
   * 版本标签
   */
  tags?: string[];

  /**
   * 发布状态
   */
  publishStatus?: PublishStatus;

  /**
   * 是否锁定
   */
  locked?: boolean;

  /**
   * 发布/取消发布时间
   */
  publishedAt?: Date;

  /**
   * 发布/取消发布操作者
   */
  publishedBy?: string;

  /**
   * 发布描述
   */
  publishDescription?: string;

  /**
   * 锁定时间
   */
  lockedAt?: Date;

  /**
   * 锁定原因
   */
  lockReason?: string;

  /**
   * 锁定操作者
   */
  lockedBy?: string;
}

/**
 * 版本差异
 */
export interface VersionDiff {
  /**
   * 版本 A
   */
  from: FlowVersion;

  /**
   * 版本 B
   */
  to: FlowVersion;

  /**
   * 节点差异
   */
  nodes: {
    added: string[];
    removed: string[];
    modified: string[];
  };

  /**
   * 边差异
   */
  edges: {
    added: string[];
    removed: string[];
    modified: string[];
  };

  /**
   * 上下文差异
   */
  context: {
    added: string[];
    removed: string[];
    modified: string[];
  };
}

/**
 * 流程版本管理器
 * 提供流程版本的创建、查询、比较和回滚功能
 */
export class FlowVersionManager {
  private versions: FlowVersion[] = [];
  private maxVersions: number = 50; // 最大保留版本数

  /**
   * 构造函数
   * @param maxVersions 最大保留版本数
   */
  constructor(maxVersions: number = 50) {
    this.maxVersions = maxVersions;
  }

  /**
   * 创建新版本
   * @param flowData 流程数据
   * @param options 选项
   * @returns 创建的新版本
   */
  createVersion(
    flowData: FlowData,
    options: {
      createdBy?: string;
      description?: string;
      tags?: string[];
    } = {}
  ): FlowVersion {
    const { createdBy, description, tags } = options;

    // 生成版本号
    const version = this.generateVersionNumber();

    // 停用当前激活版本
    this.versions.forEach(v => {
      if (v.isActive) {
        v.isActive = false;
      }
    });

    // 创建新版本
    const newVersion: FlowVersion = {
      version,
      flowData,
      createdAt: new Date(),
      createdBy,
      description,
      isActive: true,
      tags: tags || [],
    };

    // 添加版本
    this.versions.push(newVersion);

    // 限制版本数量
    if (this.versions.length > this.maxVersions) {
      this.versions.shift();
    }

    return newVersion;
  }

  /**
   * 生成版本号
   */
  private generateVersionNumber(): string {
    if (this.versions.length === 0) {
      return '1.0.0';
    }

    const latestVersion = this.versions[0].version;
    const [major, minor, patch] = latestVersion.split('.').map(Number);

    return `${major}.${minor}.${patch + 1}`;
  }

  /**
   * 获取所有版本
   * @returns 版本列表
   */
  getVersions(): FlowVersion[] {
    return [...this.versions];
  }

  /**
   * 获取指定版本
   * @param version 版本号
   * @returns 版本信息
   */
  getVersion(version: string): FlowVersion | undefined {
    return this.versions.find(v => v.version === version);
  }

  /**
   * 获取当前激活版本
   * @returns 当前激活版本
   */
  getCurrentVersion(): FlowVersion | undefined {
    return this.versions.find(v => v.isActive);
  }

  /**
   * 激活指定版本
   * @param version 版本号
   * @returns 是否成功
   */
  activateVersion(version: string): boolean {
    const targetVersion = this.versions.find(v => v.version === version);
    if (!targetVersion) {
      throw FlowExecutionError.flowDefinitionInvalid(`版本 ${version} 不存在`);
    }

    // 停用当前激活版本
    this.versions.forEach(v => {
      if (v.isActive) {
        v.isActive = false;
      }
    });

    // 激活目标版本
    targetVersion.isActive = true;
    return true;
  }

  /**
   * 回滚到指定版本
   * @param version 版本号
   * @returns 回滚后的流程数据
   */
  rollbackTo(version: string): FlowData {
    const targetVersion = this.versions.find(v => v.version === version);
    if (!targetVersion) {
      throw FlowExecutionError.flowDefinitionInvalid(`版本 ${version} 不存在`);
    }

    this.activateVersion(version);
    return targetVersion.flowData;
  }

  /**
   * 比较两个版本
   * @param versionA 版本 A
   * @param versionB 版本 B
   * @returns 版本差异
   */
  compareVersions(versionA: string, versionB: string): VersionDiff {
    const from = this.getVersion(versionA);
    const to = this.getVersion(versionB);

    if (!from) {
      throw FlowExecutionError.flowDefinitionInvalid(`版本 ${versionA} 不存在`);
    }
    if (!to) {
      throw FlowExecutionError.flowDefinitionInvalid(`版本 ${versionB} 不存在`);
    }

    const diff: VersionDiff = {
      from,
      to,
      nodes: {
        added: [],
        removed: [],
        modified: [],
      },
      edges: {
        added: [],
        removed: [],
        modified: [],
      },
      context: {
        added: [],
        removed: [],
        modified: [],
      },
    };

    // 比较节点
    const fromNodeIds = new Set(from.flowData.nodes.map(n => n.id));
    const toNodeIds = new Set(to.flowData.nodes.map(n => n.id));

    diff.nodes.added = Array.from(toNodeIds).filter(id => !fromNodeIds.has(id));
    diff.nodes.removed = Array.from(fromNodeIds).filter(id => !toNodeIds.has(id));

    // 检查修改的节点
    const commonNodeIds = Array.from(fromNodeIds).filter(id => toNodeIds.has(id));
    const fromNodesMap = new Map(from.flowData.nodes.map(n => [n.id, n]));
    const toNodesMap = new Map(to.flowData.nodes.map(n => [n.id, n]));

    diff.nodes.modified = commonNodeIds.filter(id => {
      const fromNode = fromNodesMap.get(id)!;
      const toNode = toNodesMap.get(id)!;
      return this.nodesDiffer(fromNode, toNode);
    });

    // 比较边
    const fromEdgeIds = new Set(from.flowData.edges.map(e => e.id));
    const toEdgeIds = new Set(to.flowData.edges.map(e => e.id));

    diff.edges.added = Array.from(toEdgeIds).filter(id => !fromEdgeIds.has(id));
    diff.edges.removed = Array.from(fromEdgeIds).filter(id => !toEdgeIds.has(id));

    // 检查修改的边
    const commonEdgeIds = Array.from(fromEdgeIds).filter(id => toEdgeIds.has(id));
    const fromEdgesMap = new Map(from.flowData.edges.map(e => [e.id, e]));
    const toEdgesMap = new Map(to.flowData.edges.map(e => [e.id, e]));

    diff.edges.modified = commonEdgeIds.filter(id => {
      const fromEdge = fromEdgesMap.get(id)!;
      const toEdge = toEdgesMap.get(id)!;
      return this.edgesDiffer(fromEdge, toEdge);
    });

    // 比较上下文变量
    const fromVars = new Set(Object.keys(from.flowData.context.variables));
    const toVars = new Set(Object.keys(to.flowData.context.variables));

    diff.context.added = Array.from(toVars).filter(v => !fromVars.has(v));
    diff.context.removed = Array.from(fromVars).filter(v => !toVars.has(v));

    diff.context.modified = Array.from(fromVars).filter(
      v => toVars.has(v) && this.variablesDiffer(from.flowData.context.variables[v], to.flowData.context.variables[v])
    );

    return diff;
  }

  /**
   * 比较节点是否不同
   */
  private nodesDiffer(nodeA: any, nodeB: any): boolean {
    if (nodeA.id !== nodeB.id) return true;
    if (nodeA.type !== nodeB.type) return true;
    if (JSON.stringify(nodeA.data) !== JSON.stringify(nodeB.data)) return true;
    return false;
  }

  /**
   * 比较边是否不同
   */
  private edgesDiffer(edgeA: any, edgeB: any): boolean {
    if (edgeA.id !== edgeB.id) return true;
    if (edgeA.source !== edgeB.source) return true;
    if (edgeA.target !== edgeB.target) return true;
    if (JSON.stringify(edgeA.data) !== JSON.stringify(edgeB.data)) return true;
    return false;
  }

  /**
   * 比较变量定义是否不同
   */
  private variablesDiffer(varA: any, varB: any): boolean {
    if (varA.type !== varB.type) return true;
    if (varA.source !== varB.source) return true;
    if (varA.default !== varB.default) return true;
    return false;
  }

  /**
   * 删除指定版本
   * @param version 版本号
   * @returns 是否成功
   */
  deleteVersion(version: string): boolean {
    const index = this.versions.findIndex(v => v.version === version);
    if (index === -1) {
      return false;
    }

    const deleted = this.versions.splice(index, 1);
    if (deleted[0].isActive) {
      // 如果删除的是激活版本，需要激活另一个版本
      const remaining = this.versions.filter(v => v.isActive);
      if (remaining.length > 0) {
        remaining[0].isActive = true;
      } else if (this.versions.length > 0) {
        this.versions[0].isActive = true;
      }
    }

    return true;
  }

  /**
   * 清空所有版本
   */
  clearAll(): void {
    this.versions = [];
  }

  /**
   * 获取版本数量
   */
  getVersionCount(): number {
    return this.versions.length;
  }

  /**
   * 设置最大版本数
   * @param maxVersions 最大版本数
   */
  setMaxVersions(maxVersions: number): void {
    this.maxVersions = maxVersions;
    if (this.versions.length > maxVersions) {
      this.versions = this.versions.slice(0, maxVersions);
    }
  }

  // ==================== 发布版本管理 ====================

  /**
   * 发布版本
   * @param version 版本号
   * @param options 选项
   * @returns 发布结果
   */
  publishVersion(
    version: string,
    options: { publishedBy?: string; description?: string } = {}
  ): PublishVersion {
    const { publishedBy, description } = options;
    const targetVersion = this.getVersion(version);

    if (!targetVersion) {
      throw FlowExecutionError.flowDefinitionInvalid(`版本 ${version} 不存在`);
    }

    // 验证前置条件
    this.validatePublishPreconditions(targetVersion);

    // 检查是否已发布
    if (targetVersion.publishStatus === PublishStatus.PUBLISHED) {
      throw FlowExecutionError.flowDefinitionInvalid(`版本 ${version} 已经发布`);
    }

    // 更新版本状态
    const previousStatus = targetVersion.publishStatus || PublishStatus.DRAFT;
    targetVersion.publishStatus = PublishStatus.PUBLISHED;
    targetVersion.publishedAt = new Date();
    targetVersion.publishedBy = publishedBy;
    targetVersion.publishDescription = description;

    // 自动锁定已发布版本
    if (this.publishConfig.autoLockPublished) {
      this.lockVersion(version, publishedBy || 'system', '已发布版本自动锁定');
    }

    // 记录发布历史
    this.recordPublishHistory({
      version,
      action: 'publish',
      operator: publishedBy || 'system',
      previousStatus,
      newStatus: PublishStatus.PUBLISHED,
      description: description || `发布版本 ${version}`,
    });

    return this.getPublishVersion(version);
  }

  /**
   * 验证发布前置条件
   */
  private validatePublishPreconditions(version: FlowVersion): void {
    const preconditions = this.publishConfig.preconditions;
    if (!preconditions) return;

    if (preconditions.requireDescription && !version.description) {
      throw FlowExecutionError.flowDefinitionInvalid('发布版本必须有描述');
    }

    if (preconditions.requirePublishDescription) {
      // 这里可以通过 options 传入，暂时不强制
    }
  }

  /**
   * 取消发布版本
   * @param version 版本号
   * @param options 选项
   * @returns 取消发布结果
   */
  unpublishVersion(
    version: string,
    options: { unpublishedBy?: string; description?: string } = {}
  ): PublishVersion {
    const { unpublishedBy, description } = options;
    const targetVersion = this.getVersion(version);

    if (!targetVersion) {
      throw FlowExecutionError.flowDefinitionInvalid(`版本 ${version} 不存在`);
    }

    if (!this.publishConfig.allowUnpublish) {
      throw FlowExecutionError.flowDefinitionInvalid('不允许取消发布');
    }

    const previousStatus = targetVersion.publishStatus || PublishStatus.DRAFT;

    // 如果是已锁定状态，需要先解锁
    if (targetVersion.locked) {
      throw FlowExecutionError.flowDefinitionInvalid('必须先解锁已锁定的版本');
    }

    targetVersion.publishStatus = PublishStatus.UNPUBLISHED;
    targetVersion.publishedAt = new Date();
    targetVersion.publishedBy = unpublishedBy;
    targetVersion.publishDescription = description;

    // 记录发布历史
    this.recordPublishHistory({
      version,
      action: 'unpublish',
      operator: unpublishedBy || 'system',
      previousStatus,
      newStatus: PublishStatus.UNPUBLISHED,
      description: description || `取消发布版本 ${version}`,
    });

    return this.getPublishVersion(version);
  }

  /**
   * 锁定版本
   * @param version 版本号
   * @param lockedBy 锁定操作者
   * @param reason 锁定原因
   * @returns 锁定结果
   */
  lockVersion(
    version: string,
    lockedBy: string,
    reason: string
  ): PublishVersion {
    const targetVersion = this.getVersion(version);

    if (!targetVersion) {
      throw FlowExecutionError.flowDefinitionInvalid(`版本 ${version} 不存在`);
    }

    if (targetVersion.locked) {
      throw FlowExecutionError.flowDefinitionInvalid(`版本 ${version} 已经锁定`);
    }

    const previousStatus = targetVersion.publishStatus || PublishStatus.DRAFT;
    targetVersion.locked = true;
    targetVersion.lockedAt = new Date();
    targetVersion.lockedBy = lockedBy;
    targetVersion.lockReason = reason;

    // 记录发布历史
    this.recordPublishHistory({
      version,
      action: 'lock',
      operator: lockedBy,
      previousStatus,
      newStatus: PublishStatus.LOCKED,
      description: reason,
    });

    return this.getPublishVersion(version);
  }

  /**
   * 解锁版本
   * @param version 版本号
   * @param unlockedBy 解锁操作者
   * @returns 解锁结果
   */
  unlockVersion(version: string, unlockedBy: string): PublishVersion {
    const targetVersion = this.getVersion(version);

    if (!targetVersion) {
      throw FlowExecutionError.flowDefinitionInvalid(`版本 ${version} 不存在`);
    }

    if (!this.publishConfig.allowUnlock) {
      throw FlowExecutionError.flowDefinitionInvalid('不允许解锁');
    }

    if (!targetVersion.locked) {
      throw FlowExecutionError.flowDefinitionInvalid(`版本 ${version} 未锁定`);
    }

    const previousStatus = targetVersion.publishStatus || PublishStatus.DRAFT;
    targetVersion.locked = false;
    targetVersion.lockedAt = undefined;
    targetVersion.lockedBy = undefined;
    targetVersion.lockReason = undefined;

    // 记录发布历史
    this.recordPublishHistory({
      version,
      action: 'unlock',
      operator: unlockedBy,
      previousStatus,
      newStatus: previousStatus,
      description: '解锁版本',
    });

    return this.getPublishVersion(version);
  }

  /**
   * 释放锁定（保留锁定状态信息但允许修改）
   * @param version 版本号
   * @param releasedBy 释放操作者
   * @returns 释放结果
   */
  releaseLock(version: string, releasedBy: string): PublishVersion {
    const targetVersion = this.getVersion(version);

    if (!targetVersion) {
      throw FlowExecutionError.flowDefinitionInvalid(`版本 ${version} 不存在`);
    }

    if (!targetVersion.locked) {
      throw FlowExecutionError.flowDefinitionInvalid(`版本 ${version} 未锁定`);
    }

    const previousStatus = targetVersion.publishStatus || PublishStatus.DRAFT;
    targetVersion.locked = false;

    // 记录发布历史
    this.recordPublishHistory({
      version,
      action: 'release_lock',
      operator: releasedBy,
      previousStatus,
      newStatus: previousStatus,
      description: '释放版本锁定',
    });

    return this.getPublishVersion(version);
  }

  /**
   * 获取发布版本信息
   * @param version 版本号
   * @returns 发布版本信息
   */
  getPublishVersion(version: string): PublishVersion {
    const targetVersion = this.getVersion(version);
    if (!targetVersion) {
      throw FlowExecutionError.flowDefinitionInvalid(`版本 ${version} 不存在`);
    }

    return {
      version: targetVersion.version,
      status: targetVersion.publishStatus || PublishStatus.DRAFT,
      locked: targetVersion.locked || false,
      publishedAt: targetVersion.publishedAt,
      publishedBy: targetVersion.publishedBy,
      publishDescription: targetVersion.publishDescription,
      lockedAt: targetVersion.lockedAt,
      lockReason: targetVersion.lockReason,
      lockedBy: targetVersion.lockedBy,
    };
  }

  /**
   * 获取所有发布版本
   * @returns 发布版本列表
   */
  getAllPublishVersions(): PublishVersion[] {
    return this.versions
      .filter(v => v.publishStatus === PublishStatus.PUBLISHED)
      .map(v => this.getPublishVersion(v.version));
  }

  /**
   * 获取最近发布版本
   * @returns 最近发布版本信息
   */
  getLatestPublishedVersion(): PublishVersion | undefined {
    const publishedVersions = this.versions.filter(
      v => v.publishStatus === PublishStatus.PUBLISHED
    );

    if (publishedVersions.length === 0) {
      return undefined;
    }

    // 按发布时间排序，返回最新的
    publishedVersions.sort(
      (a, b) => (b.publishedAt?.getTime() || 0) - (a.publishedAt?.getTime() || 0)
    );

    return this.getPublishVersion(publishedVersions[0].version);
  }

  /**
   * 回滚到最近发布版本
   * @param options 选项
   * @returns 回滚后的流程数据
   */
  rollbackToLatestPublished(options: { rollbackBy?: string; description?: string } = {}): FlowData {
    const { rollbackBy, description } = options;
    const latestPublished = this.getLatestPublishedVersion();

    if (!latestPublished) {
      throw FlowExecutionError.flowDefinitionInvalid('没有可回滚的发布版本');
    }

    // 检查是否已锁定
    if (latestPublished.locked) {
      throw FlowExecutionError.flowDefinitionInvalid('发布版本已锁定，无法回滚');
    }

    // 执行回滚
    const flowData = this.rollbackTo(latestPublished.version);

    // 记录发布历史
    this.recordPublishHistory({
      version: latestPublished.version,
      action: 'publish', // 回滚相当于重新发布
      operator: rollbackBy ?? 'system',
      previousStatus: PublishStatus.PUBLISHED,
      newStatus: PublishStatus.PUBLISHED,
      description: description || `回滚到发布版本 ${latestPublished.version}`,
      metadata: {
        rollback: true,
      },
    });

    return flowData;
  }

  /**
   * 获取发布历史记录
   * @param version 版本号（可选）
   * @returns 发布历史记录
   */
  getPublishHistory(version?: string): PublishHistory[] {
    let history = [...this.publishHistory];

    if (version) {
      history = history.filter(h => h.version === version);
    }

    // 按时间倒序
    history.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    return history;
  }

  /**
   * 记录发布历史
   */
  private recordPublishHistory(history: Omit<PublishHistory, 'id' | 'timestamp'>): void {
    const newHistory: PublishHistory = {
      id: `hist_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`,
      timestamp: new Date(),
      ...history,
    };

    this.publishHistory.push(newHistory);

    // 限制历史数量
    if (this.publishHistory.length > this.publishConfig.maxHistory) {
      this.publishHistory = this.publishHistory.slice(-this.publishConfig.maxHistory);
    }
  }

  /**
   * 设置发布配置
   * @param config 配置
   */
  setPublishConfig(config: Partial<PublishConfig>): void {
    this.publishConfig = { ...this.publishConfig, ...config };
  }

  /**
   * 检查版本是否可修改
   * @param version 版本号
   * @returns 是否可修改
   */
  isVersionModifiable(version: string): boolean {
    const targetVersion = this.getVersion(version);
    if (!targetVersion) {
      return false;
    }

    // 已锁定的版本不可修改
    if (targetVersion.locked) {
      return false;
    }

    return true;
  }

  /**
   * 发布配置
   */
  private publishConfig: PublishConfig = { ...defaultPublishConfig };

  /**
   * 发布历史
   */
  private publishHistory: PublishHistory[] = [];
}

/**
 * A/B 测试管理器
 * 提供 A/B 测试的创建、分配、结果收集和对比分析功能
 */
export class ABTestManager {
  private tests: Map<string, ABTestConfig> = new Map();
  private userAssignments: Map<string, Map<string, string>> = new Map(); // userId -> testId -> groupKey

  /**
   * 创建 A/B 测试
   * @param config 测试配置
   * @returns 创建的测试配置
   */
  createTest(config: Omit<ABTestConfig, 'createdAt' | 'status' | 'metrics'>): ABTestConfig {
    const testId = config.testId;

    if (this.tests.has(testId)) {
      throw FlowExecutionError.flowDefinitionInvalid(`A/B 测试 ${testId} 已存在`);
    }

    // 验证组别配置
    this.validateTestGroups(config.groups);

    const testConfig: ABTestConfig = {
      ...config,
      createdAt: new Date(),
      status: ABTestStatus.DRAFT,
      metrics: new Map(),
    };

    // 初始化各组的指标
    config.groups.forEach(group => {
      testConfig.metrics.set(group.groupKey, this.createEmptyMetrics());
    });

    this.tests.set(testId, testConfig);
    return testConfig;
  }

  /**
   * 验证测试组配置
   */
  private validateTestGroups(groups: ABTestGroup[]): void {
    const groupKeys = new Set<string>();
    let totalPercentage = 0;

    for (const group of groups) {
      if (groupKeys.has(group.groupKey)) {
        throw FlowExecutionError.flowDefinitionInvalid(`重复的组别标识：${group.groupKey}`);
      }
      groupKeys.add(group.groupKey);

      if (group.allocation.percentage < 0 || group.allocation.percentage > 100) {
        throw FlowExecutionError.flowDefinitionInvalid(`组别 ${group.groupKey} 的流量百分比必须在 0-100 之间`);
      }

      totalPercentage += group.allocation.percentage;
    }

    if (totalPercentage > 100) {
      throw FlowExecutionError.flowDefinitionInvalid(`流量分配总和超过 100%（当前：${totalPercentage}%）`);
    }
  }

  /**
   * 创建空指标
   */
  private createEmptyMetrics(): ABTestMetrics {
    return {
      impressions: 0,
      clicks: 0,
      conversions: 0,
      avgProcessingTime: 0,
      totalProcessingTime: 0,
      errors: 0,
      successes: 0,
      uniqueUsers: new Set(),
      lastUpdated: new Date(),
    };
  }

  /**
   * 启动 A/B 测试
   * @param testId 测试 ID
   */
  startTest(testId: string): void {
    const test = this.getTest(testId);
    if (!test) {
      throw FlowExecutionError.flowDefinitionInvalid(`A/B 测试 ${testId} 不存在`);
    }

    // 验证所有组别都启用了
    const allEnabled = test.groups.every(g => g.enabled);
    if (!allEnabled) {
      throw FlowExecutionError.flowDefinitionInvalid('不能启动未完全启用的 A/B 测试');
    }

    test.status = ABTestStatus.RUNNING;
  }

  /**
   * 暂停 A/B 测试
   * @param testId 测试 ID
   */
  pauseTest(testId: string): void {
    const test = this.getTest(testId);
    if (!test) {
      throw FlowExecutionError.flowDefinitionInvalid(`A/B 测试 ${testId} 不存在`);
    }

    test.status = ABTestStatus.PAUSED;
  }

  /**
   * 完成 A/B 测试
   * @param testId 测试 ID
   */
  completeTest(testId: string): void {
    const test = this.getTest(testId);
    if (!test) {
      throw FlowExecutionError.flowDefinitionInvalid(`A/B 测试 ${testId} 不存在`);
    }

    test.status = ABTestStatus.COMPLETED;
    test.endDate = new Date();
  }

  /**
   * 取消 A/B 测试
   * @param testId 测试 ID
   */
  cancelTest(testId: string): void {
    const test = this.getTest(testId);
    if (!test) {
      throw FlowExecutionError.flowDefinitionInvalid(`A/B 测试 ${testId} 不存在`);
    }

    test.status = ABTestStatus.CANCELLED;
  }

  /**
   * 获取 A/B 测试
   * @param testId 测试 ID
   * @returns 测试配置
   */
  getTest(testId: string): ABTestConfig | undefined {
    return this.tests.get(testId);
  }

  /**
   * 获取所有测试
   * @returns 测试列表
   */
  getAllTests(): ABTestConfig[] {
    return Array.from(this.tests.values());
  }

  /**
   * 根据状态获取测试
   * @param status 测试状态
   * @returns 测试列表
   */
  getTestsByStatus(status: ABTestStatus): ABTestConfig[] {
    return Array.from(this.tests.values()).filter((t: ABTestConfig) => t.status === status);
  }

  /**
   * 删除 A/B 测试
   * @param testId 测试 ID
   * @returns 是否成功
   */
  deleteTest(testId: string): boolean {
    const test = this.tests.get(testId);
    if (!test) {
      return false;
    }

    // 删除用户分配记录
    this.userAssignments.forEach((userTests, userId) => {
      userTests.delete(testId);
    });

    return this.tests.delete(testId);
  }

  /**
   * 更新流量分配
   * @param testId 测试 ID
   * @param groupKey 组别标识
   * @param newPercentage 新的流量百分比
   */
  updateTrafficAllocation(testId: string, groupKey: string, newPercentage: number): void {
    const test = this.getTest(testId);
    if (!test) {
      throw FlowExecutionError.flowDefinitionInvalid(`A/B 测试 ${testId} 不存在`);
    }

    const group = test.groups.find(g => g.groupKey === groupKey);
    if (!group) {
      throw FlowExecutionError.flowDefinitionInvalid(`组别 ${groupKey} 不存在`);
    }

    if (newPercentage < 0 || newPercentage > 100) {
      throw FlowExecutionError.flowDefinitionInvalid('流量百分比必须在 0-100 之间');
    }

    // 验证总流量不超过 100%
    const totalPercentage = test.groups.reduce((sum, g) => {
      if (g.groupKey === groupKey) return sum + newPercentage;
      return sum + g.allocation.percentage;
    }, 0);

    if (totalPercentage > 100) {
      throw FlowExecutionError.flowDefinitionInvalid(`流量分配总和超过 100%（当前：${totalPercentage}%）`);
    }

    group.allocation.percentage = newPercentage;
  }

  /**
   * 更新组别描述
   * @param testId 测试 ID
   * @param groupKey 组别标识
   * @param description 新描述
   */
  updateGroupDescription(testId: string, groupKey: string, description: string): void {
    const test = this.getTest(testId);
    if (!test) {
      throw FlowExecutionError.flowDefinitionInvalid(`A/B 测试 ${testId} 不存在`);
    }

    const group = test.groups.find(g => g.groupKey === groupKey);
    if (!group) {
      throw FlowExecutionError.flowDefinitionInvalid(`组别 ${groupKey} 不存在`);
    }

    group.description = description;
  }

  /**
   * 切换组别启用状态
   * @param testId 测试 ID
   * @param groupKey 组别标识
   * @param enabled 是否启用
   */
  toggleGroupEnabled(testId: string, groupKey: string, enabled: boolean): void {
    const test = this.getTest(testId);
    if (!test) {
      throw FlowExecutionError.flowDefinitionInvalid(`A/B 测试 ${testId} 不存在`);
    }

    const group = test.groups.find(g => g.groupKey === groupKey);
    if (!group) {
      throw FlowExecutionError.flowDefinitionInvalid(`组别 ${groupKey} 不存在`);
    }

    group.enabled = enabled;
  }

  /**
   * 为用户分配测试组
   * @param testId 测试 ID
   * @param userId 用户 ID
   * @param userTags 用户标签
   * @returns 分配结果
   */
  assignUser(testId: string, userId: string, userTags?: string[]): ABTestAssignment {
    const test = this.getTest(testId);
    if (!test) {
      return { assigned: false, reason: '测试不存在' };
    }

    if (test.status !== ABTestStatus.RUNNING) {
      return { assigned: false, reason: `测试未运行（状态：${test.status}` };
    }

    // 检查是否已分配
    if (!this.userAssignments.has(userId)) {
      this.userAssignments.set(userId, new Map());
    }
    const userTests = this.userAssignments.get(userId)!;

    if (userTests.has(testId)) {
      const existingGroup = userTests.get(testId)!;
      return {
        assigned: true,
        testId,
        groupKey: existingGroup,
        version: this.getGroupVersion(testId, existingGroup)!,
        reason: '重复分配，返回原有结果',
      };
    }

    // 查找匹配的组别
    const assignment = this.findMatchingGroup(test, userId, userTags || []);

    if (assignment) {
      userTests.set(testId, assignment.groupKey);
      return {
        assigned: true,
        testId,
        groupKey: assignment.groupKey,
        version: assignment.version,
        reason: assignment.reason,
      };
    }

    return { assigned: false, reason: '未匹配到任何组别' };
  }

  /**
   * 查找匹配的组别
   */
  private findMatchingGroup(test: ABTestConfig, _userId: string, userTags: string[]): {
    groupKey: string;
    version: string;
    reason: string;
  } | null {
    // 首先尝试基于标签匹配
    const tagMatch = test.groups.find(group => {
      if (!group.enabled) return false;
      if (!group.allocation.userTags || group.allocation.userTags.length === 0) return false;

      return group.allocation.userTags.every(tag => userTags.includes(tag));
    });

    if (tagMatch) {
      return {
        groupKey: tagMatch.groupKey,
        version: tagMatch.version,
        reason: '标签匹配',
      };
    }

    // 基于百分比随机分配
    const random = this.generateHash(_userId + test.testId);
    let cumulativePercentage = 0;

    for (const group of test.groups) {
      if (!group.enabled) continue;

      cumulativePercentage += group.allocation.percentage;
      if (random < cumulativePercentage / 100) {
        return {
          groupKey: group.groupKey,
          version: group.version,
          reason: '随机分配',
        };
      }
    }

    return null;
  }

  /**
   * 生成用户哈希（用于一致性分配）
   */
  private generateHash(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }
    return Math.abs(hash) / Number.MAX_SAFE_INTEGER;
  }

  /**
   * 获取组别版本号
   */
  private getGroupVersion(testId: string, groupKey: string): string | undefined {
    const test = this.getTest(testId);
    if (!test) return undefined;

    const group = test.groups.find(g => g.groupKey === groupKey);
    return group?.version;
  }

  /**
   * 记录曝光
   * @param testId 测试 ID
   * @param groupKey 组别标识
   * @param userId 用户 ID
   */
  recordImpression(testId: string, groupKey: string, userId: string): void {
    const test = this.getTest(testId);
    if (!test) return;

    const metrics = test.metrics.get(groupKey);
    if (!metrics) return;

    metrics.impressions++;
    metrics.uniqueUsers.add(userId);
    metrics.lastUpdated = new Date();
  }

  /**
   * 记录点击
   * @param testId 测试 ID
   * @param groupKey 组别标识
   */
  recordClick(testId: string, groupKey: string): void {
    const test = this.getTest(testId);
    if (!test) return;

    const metrics = test.metrics.get(groupKey);
    if (!metrics) return;

    metrics.clicks++;
    metrics.lastUpdated = new Date();
  }

  /**
   * 记录转化
   * @param testId 测试 ID
   * @param groupKey 组别标识
   */
  recordConversion(testId: string, groupKey: string): void {
    const test = this.getTest(testId);
    if (!test) return;

    const metrics = test.metrics.get(groupKey);
    if (!metrics) return;

    metrics.conversions++;
    metrics.successes++;
    metrics.lastUpdated = new Date();
  }

  /**
   * 记录处理时长
   * @param testId 测试 ID
   * @param groupKey 组别标识
   * @param processingTime 处理时长（毫秒）
   */
  recordProcessingTime(testId: string, groupKey: string, processingTime: number): void {
    const test = this.getTest(testId);
    if (!test) return;

    const metrics = test.metrics.get(groupKey);
    if (!metrics) return;

    metrics.totalProcessingTime += processingTime;
    metrics.avgProcessingTime = metrics.totalProcessingTime / metrics.impressions;
    metrics.lastUpdated = new Date();
  }

  /**
   * 记录错误
   * @param testId 测试 ID
   * @param groupKey 组别标识
   */
  recordError(testId: string, groupKey: string): void {
    const test = this.getTest(testId);
    if (!test) return;

    const metrics = test.metrics.get(groupKey);
    if (!metrics) return;

    metrics.errors++;
    metrics.lastUpdated = new Date();
  }

  /**
   * 获取组别指标
   * @param testId 测试 ID
   * @param groupKey 组别标识
   * @returns 指标数据
   */
  getGroupMetrics(testId: string, groupKey: string): ABTestMetrics | undefined {
    const test = this.getTest(testId);
    if (!test) return undefined;

    return test.metrics.get(groupKey);
  }

  /**
   * 获取所有组别的指标
   * @param testId 测试 ID
   * @returns 指标映射
   */
  getAllGroupMetrics(testId: string): Map<string, ABTestMetrics> | undefined {
    const test = this.getTest(testId);
    if (!test) return undefined;

    return test.metrics;
  }

  /**
   * 对比分析 A/B 测试结果
   * @param testId 测试 ID
   * @param controlGroup 对照组标识
   * @param variantGroup 实验组标识
   * @returns 对比分析结果
   */
  compareTests(testId: string, controlGroup: string, variantGroup: string): ABTestComparison {
    const test = this.getTest(testId);
    if (!test) {
      throw FlowExecutionError.flowDefinitionInvalid(`A/B 测试 ${testId} 不存在`);
    }

    const controlMetrics = test.metrics.get(controlGroup);
    const variantMetrics = test.metrics.get(variantGroup);

    if (!controlMetrics || !variantMetrics) {
      throw FlowExecutionError.flowDefinitionInvalid('对照组或实验组指标不存在');
    }

    const comparison: ABTestComparison = {
      groups: [controlGroup, variantGroup],
      metrics: {
        impressions: this.compareMetric(controlMetrics.impressions, variantMetrics.impressions),
        clicks: this.compareMetric(controlMetrics.clicks, variantMetrics.clicks),
        conversions: this.compareMetric(controlMetrics.conversions, variantMetrics.conversions),
        conversionRate: this.compareRate(
          controlMetrics.conversions,
          controlMetrics.impressions,
          variantMetrics.conversions,
          variantMetrics.impressions
        ),
        clickThroughRate: this.compareRate(
          controlMetrics.clicks,
          controlMetrics.impressions,
          variantMetrics.clicks,
          variantMetrics.impressions
        ),
        avgProcessingTime: this.compareMetric(
          controlMetrics.avgProcessingTime,
          variantMetrics.avgProcessingTime
        ),
        errorRate: this.compareRate(
          controlMetrics.errors,
          controlMetrics.impressions,
          variantMetrics.errors,
          variantMetrics.impressions
        ),
      },
      analyzedAt: new Date(),
    };

    // 计算统计显著性（简化版 Z 检验）
    comparison.statisticalSignificance = this.calculateSignificance(
      controlMetrics.conversions,
      controlMetrics.impressions,
      variantMetrics.conversions,
      variantMetrics.impressions
    );

    // 确定获胜者
    const controlCVR = controlMetrics.conversions / controlMetrics.impressions;
    const variantCVR = variantMetrics.conversions / variantMetrics.impressions;

    if (variantCVR > controlCVR) {
      comparison.winner = variantGroup;
    } else if (controlCVR > variantCVR) {
      comparison.winner = controlGroup;
    }

    return comparison;
  }

  /**
   * 比较数值指标
   */
  private compareMetric(control: number, variant: number): {
    control: number;
    variant: number;
    difference: number;
    percentageChange: number;
  } {
    const difference = variant - control;
    const percentageChange = control !== 0 ? (difference / control) * 100 : 0;

    return {
      control,
      variant,
      difference,
      percentageChange,
    };
  }

  /**
   * 比较比率指标
   */
  private compareRate(controlValue: number, controlTotal: number, variantValue: number, variantTotal: number): {
    control: number;
    variant: number;
    difference: number;
    percentageChange: number;
  } {
    const controlRate = controlTotal !== 0 ? controlValue / controlTotal : 0;
    const variantRate = variantTotal !== 0 ? variantValue / variantTotal : 0;

    const difference = variantRate - controlRate;
    const percentageChange = controlRate !== 0 ? (difference / controlRate) * 100 : 0;

    return {
      control: controlRate,
      variant: variantRate,
      difference,
      percentageChange,
    };
  }

  /**
   * 计算统计显著性（简化版）
   */
  private calculateSignificance(
    controlConversions: number,
    controlImpressions: number,
    variantConversions: number,
    variantImpressions: number
  ): {
    isSignificant: boolean;
    pValue?: number;
    confidenceLevel?: number;
  } {
    // 简化版：使用经验法则判断
    // 实际项目应引入统计库进行完整的假设检验

    const controlRate = controlImpressions > 0 ? controlConversions / controlImpressions : 0;
    const variantRate = variantImpressions > 0 ? variantConversions / variantImpressions : 0;

    const minImpressions = Math.min(controlImpressions, variantImpressions);
    const rateDifference = Math.abs(variantRate - controlRate);

    // 经验法则：样本量足够且差异明显时认为显著
    const isSignificant =
      minImpressions > 100 && rateDifference > 0.05; // 5% 的差异阈值

    return {
      isSignificant,
      pValue: isSignificant ? 0.05 : undefined,
      confidenceLevel: isSignificant ? 95 : undefined,
    };
  }

  /**
   * 获取测试总结
   * @param testId 测试 ID
   * @returns 测试总结
   */
  getTestSummary(testId: string): {
    test: ABTestConfig;
    totalImpressions: number;
    totalConversions: number;
    overallConversionRate: number;
    bestPerformingGroup?: string;
  } | undefined {
    const test = this.getTest(testId);
    if (!test) return undefined;

    let totalImpressions = 0;
    let totalConversions = 0;
    let bestGroup: string | undefined;
    let bestCVR = -1;

    test.metrics.forEach((metrics, groupKey) => {
      totalImpressions += metrics.impressions;
      totalConversions += metrics.conversions;

      const cvr = metrics.impressions > 0 ? metrics.conversions / metrics.impressions : 0;
      if (cvr > bestCVR) {
        bestCVR = cvr;
        bestGroup = groupKey;
      }
    });

    return {
      test,
      totalImpressions,
      totalConversions,
      overallConversionRate: totalImpressions > 0 ? totalConversions / totalImpressions : 0,
      bestPerformingGroup: bestGroup,
    };
  }

  /**
   * 清空所有测试
   */
  clearAll(): void {
    this.tests.clear();
    this.userAssignments.clear();
  }

  /**
   * 获取测试数量
   */
  getTestCount(): number {
    return this.tests.size;
  }
}

// 默认导出
export const flowVersionManager = new FlowVersionManager();
export const abTestManager = new ABTestManager();
export default flowVersionManager;
