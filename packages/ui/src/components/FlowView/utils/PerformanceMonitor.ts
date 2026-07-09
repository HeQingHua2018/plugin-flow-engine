/*
 * @File: PerformanceMonitor.ts
 * @desc: 渲染性能监控工具
 */

interface PerformanceMetrics {
  renderCount: number;
  lastRenderTime: number;
  avgRenderTime: number;
  totalRenderTime: number;
  nodeRenderTime: number;
  edgeRenderTime: number;
  dragStartTime: number;
  dragDuration: number;
  lastZoomLevel: number;
  lastPanX: number;
  lastPanY: number;
}

const PerformanceMonitor = {
  metrics: {} as PerformanceMetrics,

  init() {
    this.metrics = {
      renderCount: 0,
      lastRenderTime: 0,
      avgRenderTime: 0,
      totalRenderTime: 0,
      nodeRenderTime: 0,
      edgeRenderTime: 0,
      dragStartTime: 0,
      dragDuration: 0,
      lastZoomLevel: 1,
      lastPanX: 0,
      lastPanY: 0,
    };
  },

  recordRenderStart() {
    this.metrics.renderCount++;
    this.metrics.lastRenderTime = performance.now();
  },

  recordRenderEnd() {
    const endTime = performance.now();
    const renderTime = endTime - this.metrics.lastRenderTime;
    this.metrics.totalRenderTime += renderTime;
    this.metrics.avgRenderTime = this.metrics.totalRenderTime / this.metrics.renderCount;

    if (renderTime > 16) {
      console.warn(`[Performance] FlowView 渲染耗时：${renderTime.toFixed(2)}ms`);
    }
  },

  recordDragStart() {
    this.metrics.dragStartTime = performance.now();
  },

  recordDragEnd() {
    const endTime = performance.now();
    this.metrics.dragDuration = endTime - this.metrics.dragStartTime;

    if (this.metrics.dragDuration > 100) {
      console.warn(`[Performance] 拖拽操作耗时：${this.metrics.dragDuration.toFixed(2)}ms`);
    }
  },

  recordZoom(zoom: number) {
    this.metrics.lastZoomLevel = zoom;
  },

  recordPan(x: number, y: number) {
    this.metrics.lastPanX = x;
    this.metrics.lastPanY = y;
  },

  getReport() {
    return {
      ...this.metrics,
      fps: this.metrics.avgRenderTime > 0 ? (1000 / this.metrics.avgRenderTime).toFixed(2) : 'N/A',
    };
  },

  reset() {
    this.init();
  },
};

export default PerformanceMonitor;
