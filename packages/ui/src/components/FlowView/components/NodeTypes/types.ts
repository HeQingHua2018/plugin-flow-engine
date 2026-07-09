/*
 * @File: 
 * @desc: 
 * @author: heqinghua
 * @date: 2025年10月24日 14:06:02
 * @example: 调用示例
 */
import type { NodeProps } from '@xyflow/react';
import type { Node } from '@xyflow/react';


interface BaseNodeData extends Record<string, any> {
   label: string;
}

type NodeWithBase = Node & { data: Node['data'] & BaseNodeData };
export type NodePropsBase = NodeProps<NodeWithBase>;
export type NodePropsWithData<D extends Record<string, unknown>> = NodeProps<Node & { data: Node['data'] & BaseNodeData & D }>;

export type {
    BaseNodeData
};
