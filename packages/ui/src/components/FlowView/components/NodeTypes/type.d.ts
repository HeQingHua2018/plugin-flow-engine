/*
 * @File: 
 * @desc: 
 * @author: heqinghua
 * @date: 2025年10月24日 14:06:02
 * @example: 调用示例
 */
import type { NodeProps } from '@xyflow/react';
import type {Node } from '@plugin-flow-engine/type'


/**
 * 定义react-flow 节点的data 基础数据类型
 */
interface BaseNodeData extends Record<string, any> {
   label: string;
}

// 统一使用核心 Node 类型，并在 data 上扩展 UI 所需字段
type NodeWithBase = Node & { data: Node['data'] & BaseNodeData };
export type NodePropsBase = NodeProps<NodeWithBase>;
export type NodePropsWithData<D extends Record<string, unknown>> = NodeProps<Node & { data: Node['data'] & BaseNodeData & D }>;

export type {
    BaseNodeData
}