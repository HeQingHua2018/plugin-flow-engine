/*
 * @File: 
 * @desc: 
 * @author: heqinghua
 * @date: 2025年10月20日 16:02:48
 * @example: 调用示例
 */
/*
 * @File: src/core/plugins/index.ts
 * @desc: 静态导入内置节点插件，移除 require.context 依赖
 */
import type { NodePlugin } from './NodePlugin';
import TriggerNodePlugin from './TriggerNodePlugin';
import ActionNodePlugin from './ActionNodePlugin';
import BranchNodePlugin from './BranchNodePlugin';
import ParallelNodePlugin from './ParallelNodePlugin';
import IterationNodePlugin from './IterationNodePlugin';
import MergeNodePlugin from './MergeNodePlugin';
import EndNodePlugin from './EndNodePlugin';

let cachedInstances: NodePlugin[] | null = null;

export function getBuiltInPluginInstances(): NodePlugin[] {
  if (cachedInstances) return cachedInstances;
  const instances: NodePlugin[] = [
    new TriggerNodePlugin(),
    new ActionNodePlugin(),
    new BranchNodePlugin(),
    new ParallelNodePlugin(),
    new IterationNodePlugin(),
    new MergeNodePlugin(),
    new EndNodePlugin(),
  ];
  cachedInstances = instances;
  return cachedInstances;
}
