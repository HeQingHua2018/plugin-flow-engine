/*
 * @File: VirtualScrollManager.ts
 * @desc: 虚拟滚动管理器，用于优化大型流程的可视化渲染性能
 * @author: heqinghua
 * @date: 2026 年 06 月 15 日
 */

import type { Node, Edge } from '@xyflow/react';

/**
 * 视口信息接口
 */
export interface Viewport {
  /**
   * 视口 X 坐标
   */
  x: number;
  /**
   * 视口 Y 坐标
   */
  y: number;
  /**
   * 视口宽度
   */
  width: number;
  /**
   * 视口高度
   */
  height: number;
  /**
   * 缩放比例
   */
  zoom: number;
}

/**
 * 节点注册信息接口
 */
export interface NodeRegistry {
  /**
   * 节点对象
   */
  node: Node;
  /**
   * 是否已加载
   */
  loaded: boolean;
  /**
   * 节点位置
   */
  position: { x: number; y: number };
  /**
   * 节点尺寸
   */
  size: { width: number; height: number };
}

/**
 * 边注册信息接口
 */
export interface EdgeRegistry {
  /**
   * 边对象
   */
  edge: Edge;
  /**
   * 是否已加载
   */
  loaded: boolean;
}

/**
 * 虚拟滚动配置接口
 */
export interface VirtualScrollOptions {
  /**
   * 渲染缓冲区（像素），默认 100
   */
  renderBuffer?: number;
  /**
   * 预加载缓冲区（像素），默认 200
   */
  preloadBuffer?: number;
  /**
   * 最小节点数量阈值，超过此值启用虚拟滚动，默认 100
   */
  minNodeThreshold?: number;
  /**
   * 是否启用性能统计，默认 true
   */
  enableStats?: boolean;
  /**
   * 更新频率限制（毫秒），默认 16
   */
  updateFrequency?: number;
}

/**
 * 虚拟滚动统计信息接口
 */
export interface VirtualScrollStats {
  /**
   * 总节点数
   */
  totalNodes: number;
  /**
   * 可见节点数
   */
  visibleNodes: number;
  /**
   * 总边数
   */
  totalEdges: number;
  /**
   * 可见边数
   */
  visibleEdges: number;
  /**
   * 渲染比例
   */
  renderRatio: number;
  /**
   * 更新次数
   */
  updateCount: number;
  /**
   * 平均更新时间（毫秒）
   */
  avgUpdateTime: number;
}

/**
 * 默认虚拟滚动配置
 */
const DEFAULT_VIRTUAL_SCROLL_OPTIONS: Required<VirtualScrollOptions> = {
  renderBuffer: 100,
  preloadBuffer: 200,
  minNodeThreshold: 100,
  enableStats: true,
  updateFrequency: 16, // 60fps
};

/**
 * 虚拟滚动管理器
 * 用于优化大型流程的可视化渲染性能，通过视口计算和节点分片实现虚拟滚动
 */
export class VirtualScrollManager {
  private viewport: Viewport;
  private nodeRegistry: Map<string, NodeRegistry>;
  private edgeRegistry: Map<string, EdgeRegistry>;
  private options: Required<VirtualScrollOptions>;
  private stats = {
    updateCount: 0,
    totalUpdateTime: 0,
  };
  private lastUpdateTime: number = 0;
  private pendingUpdate: boolean = false;

  constructor(
    private allNodes: Node[],
    private allEdges: Edge[],
    private containerSize: { width: number; height: number },
    options: VirtualScrollOptions = {}
  ) {
    this.options = { ...DEFAULT_VIRTUAL_SCROLL_OPTIONS, ...options };

    // 初始化视口
    this.viewport = {
      x: 0,
      y: 0,
      width: containerSize.width,
      height: containerSize.height,
      zoom: 1,
    };

    // 初始化节点注册表
    this.nodeRegistry = new Map(
      allNodes.map(node => [
        node.id,
        {
          node,
          loaded: false,
          position: node.position || { x: 0, y: 0 },
          size: this.getNodeSize(node),
        }
      ])
    );

    // 初始化边注册表
    this.edgeRegistry = new Map(
      allEdges.map(edge => [
        edge.id,
        {
          edge,
          loaded: false,
        }
      ])
    );
  }

  /**
   * 判断是否应该启用虚拟滚动
   * @returns 是否启用
   */
  shouldEnable(): boolean {
    return this.allNodes.length >= this.options.minNodeThreshold;
  }

  /**
   * 更新视口位置
   * @param transform 视口变换信息
   */
  updateViewport(transform: { x: number; y: number; zoom: number }): void {
    const now = Date.now();

    // 频率限制
    if (now - this.lastUpdateTime < this.options.updateFrequency) {
      if (!this.pendingUpdate) {
        this.pendingUpdate = true;
        setTimeout(() => {
          this.pendingUpdate = false;
          this.performViewportUpdate(transform);
        }, this.options.updateFrequency);
      }
      return;
    }

    this.performViewportUpdate(transform);
  }

  /**
   * 执行视口更新
   * @param transform 视口变换信息
   */
  private performViewportUpdate(transform: { x: number; y: number; zoom: number }): void {
    const startTime = Date.now();
    this.lastUpdateTime = startTime;

    this.viewport = {
      x: -transform.x / transform.zoom,
      y: -transform.y / transform.zoom,
      width: this.containerSize.width / transform.zoom,
      height: this.containerSize.height / transform.zoom,
      zoom: transform.zoom,
    };

    // 更新统计信息
    if (this.options.enableStats) {
      const updateTime = Date.now() - startTime;
      this.stats.updateCount++;
      this.stats.totalUpdateTime += updateTime;
    }
  }

  /**
   * 获取当前可见的节点
   * @returns 可见节点数组
   */
  getVisibleNodes(): Node[] {
    const visibleNodes: Node[] = [];
    const buffer = this.options.renderBuffer;

    for (const [nodeId, registry] of this.nodeRegistry) {
      if (this.isNodeVisible(registry, buffer)) {
        visibleNodes.push(registry.node);
        registry.loaded = true;
      }
    }

    return visibleNodes;
  }

  /**
   * 获取当前可见的边
   * @returns 可见边数组
   */
  getVisibleEdges(): Edge[] {
    const visibleEdges: Edge[] = [];
    const buffer = this.options.renderBuffer;

    for (const [edgeId, registry] of this.edgeRegistry) {
      if (this.isEdgeVisible(registry, buffer)) {
        visibleEdges.push(registry.edge);
        registry.loaded = true;
      }
    }

    return visibleEdges;
  }

  /**
   * 获取预加载的节点（即将进入视口）
   * @returns 预加载节点数组
   */
  getPreloadNodes(): Node[] {
    const preloadNodes: Node[] = [];
    const preloadBuffer = this.options.preloadBuffer;

    for (const [nodeId, registry] of this.nodeRegistry) {
      if (!registry.loaded && this.isNodeVisible(registry, preloadBuffer)) {
        preloadNodes.push(registry.node);
      }
    }

    return preloadNodes;
  }

  /**
   * 判断节点是否可见
   * @param registry 节点注册信息
   * @param buffer 缓冲区大小
   * @returns 是否可见
   */
  private isNodeVisible(registry: NodeRegistry, buffer: number): boolean {
    const { position, size } = registry;
    const { viewport } = this;

    return (
      position.x + size.width + buffer > viewport.x &&
      position.x - buffer < viewport.x + viewport.width &&
      position.y + size.height + buffer > viewport.y &&
      position.y - buffer < viewport.y + viewport.height
    );
  }

  /**
   * 判断边是否可见
   * @param registry 边注册信息
   * @param buffer 缓冲区大小
   * @returns 是否可见
   */
  private isEdgeVisible(registry: EdgeRegistry, buffer: number): boolean {
    const sourceNode = this.nodeRegistry.get(registry.edge.source);
    const targetNode = this.nodeRegistry.get(registry.edge.target);

    if (!sourceNode || !targetNode) return false;

    // 简化的边可见性判断：只要任一端点可见，边就可见
    return (
      this.isNodeVisible(sourceNode, buffer) ||
      this.isNodeVisible(targetNode, buffer)
    );
  }

  /**
   * 获取节点尺寸
   * @param node 节点对象
   * @returns 节点尺寸
   */
  private getNodeSize(node: Node): { width: number; height: number } {
    // 默认节点尺寸，可根据实际节点类型调整
    const data = node.data as any;
    return {
      width: data?.width ?? 200,
      height: data?.height ?? 100,
    };
  }

  /**
   * 获取统计信息
   * @returns 统计信息
   */
  getStats(): VirtualScrollStats {
    const visibleNodes = this.getVisibleNodes();
    const visibleEdges = this.getVisibleEdges();
    const avgUpdateTime = this.stats.updateCount > 0
      ? this.stats.totalUpdateTime / this.stats.updateCount
      : 0;

    return {
      totalNodes: this.allNodes.length,
      visibleNodes: visibleNodes.length,
      totalEdges: this.allEdges.length,
      visibleEdges: visibleEdges.length,
      renderRatio: this.allNodes.length > 0
        ? visibleNodes.length / this.allNodes.length
        : 0,
      updateCount: this.stats.updateCount,
      avgUpdateTime,
    };
  }

  /**
   * 重置统计信息
   */
  resetStats(): void {
    this.stats = {
      updateCount: 0,
      totalUpdateTime: 0,
    };
  }

  /**
   * 清空管理器
   */
  clear(): void {
    this.nodeRegistry.clear();
    this.edgeRegistry.clear();
    this.stats = {
      updateCount: 0,
      totalUpdateTime: 0,
    };
  }

  /**
   * 更新节点数据
   * @param nodes 新的节点数组
   */
  updateNodes(nodes: Node[]): void {
    this.allNodes = nodes;
    this.nodeRegistry.clear();

    nodes.forEach(node => {
      this.nodeRegistry.set(node.id, {
        node,
        loaded: false,
        position: node.position || { x: 0, y: 0 },
        size: this.getNodeSize(node),
      });
    });
  }

  /**
   * 更新边数据
   * @param edges 新的边数组
   */
  updateEdges(edges: Edge[]): void {
    this.allEdges = edges;
    this.edgeRegistry.clear();

    edges.forEach(edge => {
      this.edgeRegistry.set(edge.id, {
        edge,
        loaded: false,
      });
    });
  }

  /**
   * 获取视口信息
   * @returns 视口信息
   */
  getViewport(): Viewport {
    return this.viewport;
  }

  /**
   * 获取配置选项
   * @returns 配置选项
   */
  getOptions(): Required<VirtualScrollOptions> {
    return this.options;
  }

  /**
   * 调整渲染缓冲区
   * @param newBuffer 新的缓冲区大小
   */
  setRenderBuffer(newBuffer: number): void {
    this.options.renderBuffer = newBuffer;
  }

  /**
   * 调整预加载缓冲区
   * @param newBuffer 新的缓冲区大小
   */
  setPreloadBuffer(newBuffer: number): void {
    this.options.preloadBuffer = newBuffer;
  }

  /**
   * 获取节点在视口中的位置信息
   * @param nodeId 节点 ID
   * @returns 位置信息或 undefined
   */
  getNodePositionInView(nodeId: string): {
    isInView: boolean;
    distanceToView: number;
  } | undefined {
    const registry = this.nodeRegistry.get(nodeId);
    if (!registry) return undefined;

    const { position, size } = registry;
    const { viewport } = this;

    const isInView = this.isNodeVisible(registry, 0);

    // 计算到视口中心的距离
    const centerX = position.x + size.width / 2;
    const centerY = position.y + size.height / 2;
    const viewCenterX = viewport.x + viewport.width / 2;
    const viewCenterY = viewport.y + viewport.height / 2;

    const distanceToView = Math.sqrt(
      Math.pow(centerX - viewCenterX, 2) +
      Math.pow(centerY - viewCenterY, 2)
    );

    return {
      isInView,
      distanceToView,
    };
  }
}

export default VirtualScrollManager;