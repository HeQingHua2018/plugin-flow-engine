/*
 * @File: 
 * @desc: 
 * @author: heqinghua
 * @date: 2025年10月23日 14:31:15
 * @example: 调用示例
 */

interface FlowData {
  nodes: Node[];
  edges: Edge[];
}

interface Node {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: { label: string; nodeType: string };
}

interface Edge {
  id: string;
  source: string;
  target: string;
}

export type {
    FlowData,
    Node,
    Edge,
}