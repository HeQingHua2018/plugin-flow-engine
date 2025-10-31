/*
 * @File:
 * @desc:
 * @author: heqinghua
 * @date: 2025年10月21日 11:36:56
 * @example: 调用示例
 */

import { BuiltInPluginNodeTypes, type FlowData } from '@plugin-flow-engine/type';
// import '../plugins'
const flowData: FlowData = {
  flow:{
    id: 'flow1',
    name: '流程1',
    version: '1.0.0',
    description: '这是一个简单的流程',
    category: '示例',
    enable: true,
    create_date: '2025-10-21',
    update_date: '2025-10-21',
  },
  context:{
    variables: {
    },
  },
  nodes: [
    {
      id: 'trigger',
      type: 'basic_node',
       position: {
        x: 120,
        y: 60,
      },
      data: {  name:'触发节点', label: '触发节点',  pluginNodeType: BuiltInPluginNodeTypes.Trigger },
    },
    {
      id: 'show_email_node',
      type: 'basic_node',
        position: {
        x: 480,
        y: 60,
      },
      // 内建插件节点
      data: { name: '显示邮箱节点', label: '显示邮箱节点', pluginNodeType: BuiltInPluginNodeTypes.Action },
      // 自定义插件节点
      // data: { name: '显示邮箱节点', label: '显示邮箱节点', pluginNodeType: "MyAction" },
    },
  ],
  edges: [
    { id: 'e1-2', source: 'trigger', target: 'show_email_node', type: 'basic_edge' }
  ],
  global_config:{

  }
};

export { flowData };
