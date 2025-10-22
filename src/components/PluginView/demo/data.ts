/**
 * 模拟数据
 */

import { FlowDefinition, IterationMode, ParallelStrategy } from "../../../core/type.d";

export const data: FlowDefinition = {
  flow: {
    id: "demo_flow",
    name: "实例中心通信示例流程",
    version: "1.0.0",
    description: "展示如何通过实例中心在规则引擎和组件之间通信",
    category: "demo",
    enable:true,
    create_date: new Date().toISOString(),
    update_date: new Date().toISOString(),
    auto: false, // 自动执行流程
  },
  context: {
    variables: {
      username: {
        type: "string",
        source: "Demo1Ref",
        description: "用户名",
        default: "admin",
      },
      password: {
        type: "string",
        source: "Demo1Ref",
        description: "密码",
        default: "1234555",
      },
      agreeTerms: {
        type: "boolean",
        source: "Demo1Ref",
        description: "同意条款",
        default: false,
      },
    },
  },
  nodes: [
    {
      id: "trigger",
      type: "Trigger",
      name: "触发器",
      config: {
        conditions: {
          all: [
            {
              fact: "username",
              operator: "notEqual",
              value: "",
            },
          ],
        },
        event: {
          type: "Demo1.trigger",
          params: {
            message: "流程已触发",
          },
        },
      },
    },
    {
      id: "show_email_node",
      name: "显示邮箱",
      type: "Action",
      config: {
        conditions: {
          all: [],
        },
        event: {
          type: "Demo1.showEmail",
          params: {
            show: true,
          },
        },
      },
    },
    // 分支节点（type: "branch"）
    {
      id: "user_type_branch",
      name: "用户类型分支",
      type: "Branch",
      config: {},
    },
    {
      id: "require_email_node",
      name: "设置邮箱必填",
      type: "Action",
      config: {
        conditions: {
          all: [
            {
              fact: "agreeTerms",
              operator: "equal",
              value: true,
            },
          ],
        },
        event: {
          type: "Demo1.requireEmail",
          params: {
            required: true,
          },
        },
      },
    },
    {
      id: "update_email_node",
      name: "更新邮箱",
      type: "Action",
      config: {
        conditions: {
          all: [
            {
              fact: "agreeTerms",
              operator: "equal",
              value: true,
            },
          ],
        },
        event: {
          type: "Demo1.setFormValue",
          params: {
            field: "email",
            value: "updated@example.com",
          },
        },
      },
    },
    {
      id: "update_email_success_node",
      name: "邮箱更新成功",
      type: "Parallel",
      config: {
        parallel_strategy: ParallelStrategy.ALL, // all 所有分支成功 any 一个分支成功
        conditions: {
          all: [
            {
              fact: "email",
              operator: "equal",
              value: "updated@example.com",
            },
          ],
        },
        event: {
          type: "Demo2.showOther", // 组件id.事件
          params: {
            message: "邮箱更新成功！",
          },
        },
      },
    },
    {
      id: "A1",
      name: "A1",
      type: "Action",
      config: {
        conditions: {
          all: []
        },
        event: {
          type: "Demo1.showTip",
          params: {
            msg: "A1节点并行执行成功"
          }
        }
      },
    },
    {
      id: "A2",
      name: "A2",
      type: "Action",
      config: {
        conditions: {
          all: [
          ],
        },
        event: {
          type: "Demo2.showTip", // 组件id.事件
          params: {
            msg: "A2节点并行消息",
          },
        },
      },
    },
    {
      id:"iteration_info",
      name:"迭代提醒",
      type:"Iteration",
      config:{
        iteration_count: 2,
        iteration_mode: IterationMode.ALL_SUCCESS,
        conditions:{
          all:[]
        },
        event: {
          type: "Demo2.showMsg",
          params: {
           msg:"提示信息就是我"
          },
        },
      }
    },
    {
      id:'merge',
      name:"聚合节点",
      type:"Merge",
      config:{
        event:{
          type:"Demo2.merge",
        }
      }
    },
    {
      id: "end_node",
      name: "流程结束",
      type: "End",
      config: {
        event: {
          type: "Demo2.end",
          params: {
            msg: "流程结束",
          },
        },
      },
    },
  ],
  edges: [
    {
      id: "1",
      source: "trigger",
      target: "show_email_node",
      label: "成功",
    },
    {
      id: "2",
      source: "show_email_node",
      target: "user_type_branch",
    },
    {
      id: "3",
      source: "user_type_branch",
      target: "require_email_node",
      conditions: {
        all: [{ fact: "username", operator: "equal", value: "user" }],
      },
    },
    {
      id: "4",
      source: "user_type_branch",
      target: "update_email_node",
      conditions: {
        all: [{ fact: "username", operator: "equal", value: "admin" }],
      },
    },
    {
      id: "5",
      source: "user_type_branch",
      target: "end_node",
      isDefault: true,
    },
    {
      id: "6",
      source: "update_email_node",
      target: "update_email_success_node",
      label: "更新成功",
    },
    {
      id: "7",
      source:"update_email_success_node",
      target:"A1",
      label:"A1"
    },
    {
      id: "8",
      source:"update_email_success_node",
      target:"A2",
      label:"A2"
    },
    {
      id: "9",
      source: "A2",
      target: "merge",
      label:"聚合A2"
    },
    {
      id:"10",
      source:"A1",
      target:"merge",
      label:"聚合A1"
    },
    {
      id:'11',
      source:'merge',
      target:"end_node",
      label:"结束"
    },
    {
      id:"12",
      source:"require_email_node",
      target:"iteration_info"
    },
    {
      id:"13",
      source:"iteration_info",
      target:"end_node"
    }
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