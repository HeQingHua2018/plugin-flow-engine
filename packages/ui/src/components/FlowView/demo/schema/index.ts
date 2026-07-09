import { registerPluginUI, registerMultiplePluginUI } from '@chloehe/logic-engine-ui';
import ActionNodeFormSchema, { PluginNodeType as ActionType } from './Action';
import EndNodeFormSchema, { PluginNodeType as EndType } from './End';

// 单个注册节点的UI配置
// registerPluginUI(ActionType, ActionNodeFormSchema);

// 批量注册多个节点的UI配置
const nodeConfigs = {
  [ActionType]: ActionNodeFormSchema,
  [EndType]: EndNodeFormSchema,
};

// registerMultiplePluginUI(nodeConfigs);