/*
 * @File: index.ts
 * @desc: 节点配置表单schema统一注册文件
 * @author: heqinghua
 * @date: 2025年11月10日 11:25:19
 * @example: 调用示例
 */

import { registerMultiplePluginUI } from '@chloehe/logic-engine-ui';

// 导入所有节点的表单schema
import ActionNodeFormSchema, { PluginNodeType as ActionType } from './Action';
import BranchNodeFormSchema, { PluginNodeType as BranchType } from './Branch';
import EndNodeFormSchema, { PluginNodeType as EndType } from './End';
import IterationNodeFormSchema, {
  PluginNodeType as IterationType,
} from './Iteration';
import MergeNodeFormSchema, { PluginNodeType as MergeType } from './Merge';
import ParallelNodeFormSchema, {
  PluginNodeType as ParallelType,
} from './Parallel';
import TriggerNodeFormSchema, {
  PluginNodeType as TriggerType,
} from './Trigger';



const nodeConfigs = {
  [TriggerType]: TriggerNodeFormSchema,
  [ActionType]: ActionNodeFormSchema,
  [BranchType]: BranchNodeFormSchema,
  [EndType]: EndNodeFormSchema,
  [IterationType]: IterationNodeFormSchema,
  [MergeType]: MergeNodeFormSchema,
  [ParallelType]: ParallelNodeFormSchema,
};

export default nodeConfigs;

// 单个注册节点的UI配置
// registerPluginUI(TriggerType, TriggerNodeFormSchema);
// registerPluginUI(ActionType, ActionNodeFormSchema);
// registerPluginUI(BranchType, BranchNodeFormSchema);
// registerPluginUI(EndType, EndNodeFormSchema);
// registerPluginUI(IterationType, IterationNodeFormSchema);
// registerPluginUI(MergeType, MergeNodeFormSchema);
// registerPluginUI(ParallelType, ParallelNodeFormSchema);
// 批量注册所有节点的UI配置
registerMultiplePluginUI(nodeConfigs);
