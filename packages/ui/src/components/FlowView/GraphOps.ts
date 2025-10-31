/*
 * @File: GraphOps.ts
 * @desc: 封装流程图增删改与插入等操作的工具类
 */
import type { Edge, Node, PluginNodeType } from '@plugin-flow-engine/type';

 export type GetNodes = () => Node[];
 export type SetNodes = (updater: (prev: Node[]) => Node[]) => void;
 export type GetEdges = () => Edge[];
 export type SetEdges = (updater: (prev: Edge[]) => Edge[]) => void;

export interface GraphOpsOptions {
  getNodes: GetNodes;
  setNodes: SetNodes;
  getEdges: GetEdges;
  setEdges: SetEdges;
  /** 根据插件类型获取展示名称 */
  getLabelByType?: (pluginNodeType: PluginNodeType) => string;
  /** 插入或新增节点后，打开配置抽屉 */
  openConfigDrawer?: (node: Node) => void;
}

export class FlowGraphOps {
  private getNodes: GetNodes;
  private setNodes: SetNodes;
  private getEdges: GetEdges;
  private setEdges: SetEdges;
  private getLabelByType?: (pluginNodeType: PluginNodeType) => string;
  private openConfigDrawer?: (node: Node) => void;

  constructor(options: GraphOpsOptions) {
    this.getNodes = options.getNodes;
    this.setNodes = options.setNodes;
    this.getEdges = options.getEdges;
    this.setEdges = options.setEdges;
    this.getLabelByType = options.getLabelByType;
    this.openConfigDrawer = options.openConfigDrawer;
  }

  /** 渲染时为节点注入 onAddNode 回调 */
  decorateNodes = (nds: Node[], addAfter: (nodeId: string, pluginNodeType: PluginNodeType) => void): Node[] => {
    return nds.map((n) => ({
      ...n,
      data: {
        ...(n.data as any),
        onAddNode: (pluginNodeType: PluginNodeType) => addAfter(n.id, pluginNodeType),
      },
    }));
  };

  /** 渲染时为边注入 onAddNode 回调（用于边中间插入） */
  decorateEdges = (eds: Edge[], insertOnEdge: (edgeId: string, pluginNodeType: PluginNodeType) => void): Edge[] => {
    return eds.map((e) => ({
      ...e,
      data: {
        ...(e.data as any),
        onAddNode: (pluginNodeType: PluginNodeType) => insertOnEdge(e.id, pluginNodeType),
      },
    }));
  };

  /** 在节点后面插入新节点，并重定向该节点所有出边到新节点 */
  addNodeAfter = (nodeId: string, pluginNodeType: PluginNodeType): void => {
    const nodes = this.getNodes();
    const curr = nodes.find((n) => n.id === nodeId);
    if (!curr) return;

    const nx = curr.position?.x ?? 0;
    const ny = curr.position?.y ?? 0;
    const position = { x: nx + 200, y: ny };

    const label = this.getLabelByType ? this.getLabelByType(pluginNodeType) : pluginNodeType;
    const newNodeId = `n_${Date.now()}`;
    const newNode: Node = {
      id: newNodeId,
      type: 'basic_node',
      position,
      data: { ...(curr.data as any), label, name: label, pluginNodeType: pluginNodeType },
    } as any;

    const insertEdgeId = `e_${Date.now()}_insert`;
    const edgeFromCurrentToNew: Edge = { id: insertEdgeId, type: 'basic_edge', source: nodeId, target: newNodeId } as any;

    // 重定向当前节点的所有出边为新节点出发，并添加当前->新节点的插入边
    this.setEdges((prev) => [
      ...prev.map((e) => (e.source === nodeId ? { ...e, source: newNodeId } as any : e)),
      edgeFromCurrentToNew,
    ]);

    // 添加新节点
    this.setNodes((prev) => [...prev, newNode]);

    this.openConfigDrawer?.(newNode);
  };

  /** 在边的中间插入一个新节点，并将原边拆分为两条 */
  insertNodeOnEdge = (edgeId: string, pluginNodeType: PluginNodeType): void => {
    const nodes = this.getNodes();
    const edges = this.getEdges();
    const edge = edges.find((e) => e.id === edgeId);
    if (!edge) return;

    const sourceNode = nodes.find((n) => n.id === edge.source);
    const targetNode = nodes.find((n) => n.id === edge.target);
    const sx = sourceNode?.position?.x ?? 0;
    const sy = sourceNode?.position?.y ?? 0;
    const tx = targetNode?.position?.x ?? sx + 200;
    const ty = targetNode?.position?.y ?? sy;
    const position = { x: (sx + tx) / 2, y: (sy + ty) / 2 };

    const label = this.getLabelByType ? this.getLabelByType(pluginNodeType) : pluginNodeType;
    const newNodeId = `n_${Date.now()}`;
    const newNode: Node = {
      id: newNodeId,
      type: 'basic_node',
      position,
      data: { label, name: label, pluginNodeType: pluginNodeType },
    } as any;

    const newEdgeA: Edge = { id: `e_${Date.now()}_a`, type: 'basic_edge', source: edge.source, target: newNodeId } as any;
    const newEdgeB: Edge = { id: `e_${Date.now()}_b`, type: 'basic_edge', source: newNodeId, target: edge.target } as any;

    this.setNodes((prev) => [...prev, newNode]);
    this.setEdges((prev) => [
      ...prev.filter((e) => e.id !== edgeId),
      newEdgeA,
      newEdgeB,
    ]);

    this.openConfigDrawer?.(newNode);
  };

  /** 删除节点（同时删除与该节点关联的边） */
  deleteNode = (nodeId: string): void => {
    this.setNodes((prev) => prev.filter((n) => n.id !== nodeId));
    this.setEdges((prev) => prev.filter((e) => e.source !== nodeId && e.target !== nodeId));
  };

  /** 更新节点（位置或数据） */
  updateNode = (nodeId: string, patch: Partial<Node>): void => {
    this.setNodes((prev) => prev.map((n) => (n.id === nodeId ? { ...n, ...patch, data: { ...(n.data as any), ...(patch.data as any) } } as any : n)));
  };
}