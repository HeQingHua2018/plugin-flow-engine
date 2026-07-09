/*
 * @File: 
 * @desc: 
 * @author: heqinghua
 * @date: 2026年06月15日 15:41:59
 * @example: 调用示例
 */

import {
  BuiltInPluginNodeTypes,
  IterationMode,
  ParallelStrategy,
  type FlowData,
} from '@chloehe/logic-engine-common';

export const data: FlowData = {
  flow: {
    id: 'demo_flow',
    name: '实例中心通信示例流程',
    version: '1.0.0',
    description: '展示如何通过实例中心在规则引擎和组件之间通信',
    category: 'demo',
    enable: true,
    create_date: new Date().toISOString(),
    update_date: new Date().toISOString(),
    auto: false, // 自动执行流程
  },
  context: {
    variables: {
      username: {
        type: 'string',
        source: 'context',
        description: '用户名',
        default: 'admin',
      },
      password: {
        type: 'string',
        source: 'context',
        description: '密码',
        default: '1234555',
      },
      agreeTerms: {
        type: 'boolean',
        source: 'context',
        description: '同意条款',
        default: false,
      },
    },
  },
  nodes: [
    {
      id: 'trigger',
      type: 'basic_node',
      position: { x: 100, y: 50 },
      data: {
        pluginNodeType: BuiltInPluginNodeTypes.Trigger,
        label: '触发器',
        config: {
          conditions: {
            all: [
              {
                fact: 'username',
                operator: 'is_not_null',
                value: [],
              },
            ],
          },
          event: {
            type: 'window.alert',
            params: '流程已触发' as any,
          },
        },
      },
    },
    {
      id: 'show_email_node',
      type: 'basic_node',
      position: { x: 300, y: 50 },
      data: {
        pluginNodeType: BuiltInPluginNodeTypes.Action,
        label: '显示邮箱',
        config: {
          conditions: {
            all: [],
          },
          event: {
            type: 'window.alert',
            params: '显示邮箱' as any,
          },
        },
      },
    },
    // 分支节点（type: "branch"）
    {
      id: 'user_type_branch',
      type: 'basic_node',
      position: { x: 500, y: 50 },
      data: {
        pluginNodeType: BuiltInPluginNodeTypes.Branch,
        label: '用户类型分支',
        config: {},
      },
    },
    {
      id: 'require_email_node',
      type: 'basic_node',
      position: { x: 700, y: 0 },
      data: {
        pluginNodeType: BuiltInPluginNodeTypes.Action,
        label: '设置邮箱必填',
        config: {
          conditions: {
            all: [
              {
                fact: 'agreeTerms',
                operator: 'eq',
                value: [true],
              },
            ],
          },
          event: {
            type: 'window.alert',
            params: '设置邮箱必填' as any,
          },
        },
      },
    },
    {
      id: 'update_email_node',
      type: 'basic_node',
      position: { x: 700, y: 100 },
      data: {
        pluginNodeType: BuiltInPluginNodeTypes.Action,
        label: '更新邮箱',
        config: {
          conditions: {
            all: [
              {
                fact: 'agreeTerms',
                operator: 'eq',
                value: [true],
              },
            ],
          },
          event: {
            type: 'window.alert',
            params: '更新邮箱' as any,
          },
        },
      },
    },
    {
      id: 'update_email_success_node',
      type: 'basic_node',
      position: { x: 900, y: 100 },
      data: {
        pluginNodeType: BuiltInPluginNodeTypes.Parallel,
        label: '邮箱更新成功',
        config: {
          parallel_strategy: ParallelStrategy.ALL, // all 所有分支成功 any 一个分支成功
          conditions: {
            all: [
              {
                fact: 'email',
                operator: 'eq',
                value: ['updated@example.com'],
              },
            ],
          },
          event: {
            type: 'window.alert', // 组件id.事件
            params: '邮箱更新成功' as any,
          },
        },
      },
    },
    {
      id: 'A1',
      type: 'basic_node',
      position: { x: 1100, y: 50 },
      data: {
        pluginNodeType: BuiltInPluginNodeTypes.Action,
        label: 'A1',
        config: {
          conditions: {
            all: [],
          },
          event: {
            type: 'window.alert',
            params: 'A1节点并行执行成功' as any,
          },
        },
      },
    },
    {
      id: 'A2',
      type: 'basic_node',
      position: { x: 1100, y: 150 },
      data: {
        pluginNodeType: BuiltInPluginNodeTypes.Action,
        label: 'A2',
        config: {
          conditions: {
            all: [],
          },
          event: {
            type: 'window.alert', // 组件id.事件
            params: 'A2节点并行执行成功' as any,
          },
        },
      },
    },
    {
      id: 'iteration_info',
      type: 'basic_node',
      position: { x: 900, y: 0 },
      data: {
        pluginNodeType: BuiltInPluginNodeTypes.Iteration,
        label: '迭代提醒',
        config: {
          iteration_count: 2,
          iteration_mode: IterationMode.ALL_SUCCESS,
          conditions: {
            all: [],
          },
          event: {
            type: 'window.alert',
            params: '迭代提示信息就是我111' as any,
          },
        },
      },
    },
    {
      id: 'merge',
      type: 'basic_node',
      position: { x: 1300, y: 100 },
      data: {
        pluginNodeType: BuiltInPluginNodeTypes.Merge,
        label: '聚合节点',
        config: {
          event: {
            type: 'window.alert',
            params: '聚合节点' as any,
          },
        },
      },
    },
    {
      id: 'end_node',
      type: 'basic_node',
      position: { x: 1500, y: 100 },
      data: {
        pluginNodeType: BuiltInPluginNodeTypes.End,
        label: '流程结束',
        config: {
          event: {
            type: 'window.alert',
            params: '流程结束' as any,
          },
        },
      },
    },
  ],
  edges: [
    {
      id: '1',
      source: 'trigger',
      target: 'show_email_node',
      type: 'basic_edge',
    },
    {
      id: '2',
      source: 'show_email_node',
      target: 'user_type_branch',
      type: 'basic_edge',
    },
    {
      id: '3',
      source: 'user_type_branch',
      target: 'require_email_node',
      label: '用户分支',
      type: 'basic_edge',
      data: {
        conditions: {
          all: [{ fact: 'username', operator: 'eq', value: ['user'] }],
        },
      },
    },
    {
      id: '4',
      source: 'user_type_branch',
      target: 'update_email_node',
      label: '管理员分支',
      type: 'basic_edge',
      data: {
        conditions: {
          all: [{ fact: 'username', operator: 'eq', value: ['admin'] }],
        },
      },
    },
    {
      id: '5',
      source: 'user_type_branch',
      target: 'end_node',
      label: '默认分支',
      type: 'basic_edge',
      data: {
        isDefault: true,
      },
    },
    {
      id: '6',
      source: 'update_email_node',
      target: 'update_email_success_node',
      label: '更新成功',
      type: 'basic_edge',
    },
    {
      id: '7',
      source: 'update_email_success_node',
      target: 'A1',
      label: 'A1',
      type: 'basic_edge',
    },
    {
      id: '8',
      source: 'update_email_success_node',
      target: 'A2',
      label: 'A2',
      type: 'basic_edge',
    },
    {
      id: '9',
      source: 'A2',
      target: 'merge',
      label: '聚合A2',
      type: 'basic_edge',
    },
    {
      id: '10',
      source: 'A1',
      target: 'merge',
      label: '聚合A1',
      type: 'basic_edge',
    },
    {
      id: '11',
      source: 'merge',
      target: 'end_node',
      label: '结束',
      type: 'basic_edge',
    },
    {
      id: '12',
      source: 'require_email_node',
      target: 'iteration_info',
      type: 'basic_edge',
    },
    {
      id: '14',
      source: 'iteration_info',
      target: 'iteration_info',
      type: 'self_edge',
      label: '迭代提醒',
    },
    {
      id: '13',
      source: 'iteration_info',
      target: 'end_node',
      type: 'basic_edge',
    },
  ],
  global_config: {
    timeout_config: {
      global_timeout: 30000,
      action_timeout: 10000,
    },
    security_config: {},
    monitor_config: {
      metrics: [],
    },
  },
};
