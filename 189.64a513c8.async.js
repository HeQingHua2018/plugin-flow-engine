"use strict";(self.webpackChunk_plugin_flow_engine_doc=self.webpackChunk_plugin_flow_engine_doc||[]).push([[189],{34189:function(t,e,a){a.r(e),a.d(e,{texts:function(){return n}});const n=[{value:"Core \u6838\u5FC3\u5305\u63D0\u4F9B\u63D2\u4EF6\u5316\u7684\u6D41\u7A0B\u6267\u884C\u80FD\u529B\uFF0C\u5185\u7F6E\u63D2\u4EF6\u7BA1\u7406\u3001\u6D41\u7A0B\u6267\u884C\u5F15\u64CE\u3001\u6D41\u7A0B\u5386\u53F2\u8BB0\u5F55\u3001\u4E8B\u4EF6\u8C03\u7528\u3001\u4E2D\u7ACB\u7684\u4E0A\u4E0B\u6587\u7BA1\u7406\u3001\u81EA\u5B9A\u4E49\u89C4\u5219\u64CD\u4F5C\u7B26\u6269\u5C55\uFF0C\u4EE5\u53CA\u5728 React \u4E2D\u5373\u63D2\u5373\u7528\u7684 Hook\u3002\u8BE5\u6A21\u5757\u4E0D\u4F9D\u8D56 UI\uFF0C\u4EC5\u805A\u7126\u4E8E\u4E0E\u6D41\u7A0B\u6267\u884C\u76F8\u5173\u7684\u6838\u5FC3\u903B\u8F91\u3002",paraId:0,tocIndex:1},{value:`pnpm add @plugin-flow-engine/core @plugin-flow-engine/type
`,paraId:1,tocIndex:2},{value:"\u5982\u9700\u5728 React \u4E2D\u4F7F\u7528\uFF0C\u53EF\u540C\u65F6\u5B89\u88C5\uFF1A",paraId:2,tocIndex:2},{value:`pnpm add react react-dom @xyflow/react
`,paraId:3,tocIndex:2},{value:`import { PluginManagerInstance, BaseNodePlugin, useFlowEngine } from '@plugin-flow-engine/core';
import type { FlowData } from '@plugin-flow-engine/type/core';

class MyActionPlugin extends BaseNodePlugin {
  pluginNodeType = 'MyAction' as any; // \u81EA\u5B9A\u4E49\u8282\u70B9\u7C7B\u578B\u6807\u8BC6
  pluginNodeTypeName = '\u6211\u7684\u52A8\u4F5C';
  async executeNode(node, engine, historyItem) {
    // \u53EF\u9009\uFF1A\u6309\u8282\u70B9\u6761\u4EF6\u3001\u4E8B\u4EF6\u8C03\u7528\u9ED8\u8BA4\u884C\u4E3A\u6267\u884C\uFF08\u7EE7\u627F\u57FA\u7C7B\uFF09
    return await super.executeNode(node, engine, historyItem);
  }
}

PluginManagerInstance().registerPlugin(new MyActionPlugin());

const flowData: FlowData = {
  flow: { id: 'demo', name: 'Demo', version: '1.0.0', enable: true, description: '', category: 'demo', create_date: '', update_date: '' },
  context: { variables: {} },
  nodes: [
    { id: 'trigger', type: 'Trigger', position: { x: 0, y: 0 }, data: { name: '\u89E6\u53D1', pluginNodeType: 'Trigger' } },
    { id: 'action', type: 'Action', position: { x: 200, y: 0 }, data: { name: '\u52A8\u4F5C', pluginNodeType: 'MyAction', config: {} } },
    { id: 'end', type: 'End', position: { x: 400, y: 0 }, data: { name: '\u7ED3\u675F', pluginNodeType: 'End' } },
  ],
  edges: [
    { id: 'e1', source: 'trigger', target: 'action', type: 'basic_edge', data: {} },
    { id: 'e2', source: 'action', target: 'end', type: 'basic_edge', data: {} },
  ],
  global_config: {},
};

const { executeFlow, executionHistory } = useFlowEngine({ flowData, initialVariables: {} });
await executeFlow();
console.log(executionHistory);
`,paraId:4,tocIndex:3},{value:`// \u7C7B\u578B\u5F15\u5165\u793A\u4F8B\uFF1A\u6309\u9700\u4F7F\u7528\u5B50\u8DEF\u5F84
import type { FlowData, Node, Edge, NodeStatus } from '@plugin-flow-engine/type/core';
const status: NodeStatus = NodeStatus.RUNNING;
`,paraId:5,tocIndex:3},{value:"\u63D2\u4EF6\u7BA1\u7406\uFF1A\u6CE8\u518C/\u83B7\u53D6\u8282\u70B9\u63D2\u4EF6\uFF0C\u7EDF\u4E00\u7BA1\u7406\u751F\u547D\u5468\u671F\u4E0E\u8282\u70B9\u914D\u7F6E\u3002",paraId:6,tocIndex:4},{value:"\u6D41\u7A0B\u6267\u884C\u5F15\u64CE\uFF1A\u6309\u8282\u70B9\u4E0E\u8FB9\u63A8\u8FDB\uFF0C\u8BC4\u4F30\u6761\u4EF6\u4E0E\u4E8B\u4EF6\uFF0C\u7EF4\u62A4\u4E0A\u4E0B\u6587\u4E0E\u76D1\u63A7\u62A5\u544A\u3002",paraId:6,tocIndex:4},{value:"\u6D41\u7A0B\u5386\u53F2\u8BB0\u5F55\uFF1A\u6807\u51C6\u5316\u7684\u5386\u53F2\u9879\u7ED3\u6784\uFF0C\u652F\u6301\u5386\u53F2\u66F4\u65B0\u4E8B\u4EF6\u3002",paraId:6,tocIndex:4},{value:"\u4E8B\u4EF6\u7BA1\u7406\uFF1A\u7EDF\u4E00\u8C03\u7528\u201C\u7EC4\u4EF6\u5B9E\u4F8B/\u5168\u5C40\u65B9\u6CD5\uFF08global\uFF09/window \u65B9\u6CD5\u201D\uFF0C\u5E76\u63A8\u52A8\u4E0A\u4E0B\u6587\u66F4\u65B0\u3002",paraId:6,tocIndex:4},{value:"\u6D41\u7A0B\u4E0A\u4E0B\u6587\u7BA1\u7406\uFF1A\u5B89\u5168\u3001\u53EF\u76D1\u542C\u7684\u4E0A\u4E0B\u6587\u53D8\u91CF\u8BFB\u5199\u3002",paraId:6,tocIndex:4},{value:"\u81EA\u5B9A\u4E49\u89C4\u5219\u64CD\u4F5C\u7B26\uFF1A\u5728 ",paraId:6,tocIndex:4},{value:"json-rules-engine",paraId:6,tocIndex:4},{value:" \u4E0A\u6CE8\u5165\u589E\u5F3A\u64CD\u4F5C\u7B26\u3002",paraId:6,tocIndex:4},{value:"React Hook\uFF1A",paraId:6,tocIndex:4},{value:"useFlowEngine",paraId:6,tocIndex:4},{value:" \u5FEB\u901F\u96C6\u6210\uFF0C\u63D0\u4F9B\u6267\u884C\u4E0E\u72B6\u6001\u7BA1\u7406\u3002",paraId:6,tocIndex:4},{value:"\u5165\u53E3\u4E0E\u5355\u4F8B\uFF1A",paraId:7,tocIndex:6},{value:"PluginManagerInstance()",paraId:7,tocIndex:6},{value:" \u83B7\u53D6\u5168\u5C40\u63D2\u4EF6\u7BA1\u7406\u5668\u3002",paraId:7,tocIndex:6},{value:"\u6CE8\u518C\u63D2\u4EF6\uFF1A",paraId:7,tocIndex:6},{value:"registerPlugin(plugin)",paraId:7,tocIndex:6},{value:" \u6216 ",paraId:7,tocIndex:6},{value:"registerAllPlugin([...])",paraId:7,tocIndex:6},{value:"\u3002",paraId:7,tocIndex:6},{value:"\u83B7\u53D6\u63D2\u4EF6\uFF1A",paraId:7,tocIndex:6},{value:"getPlugin(pluginNodeType)",paraId:7,tocIndex:6},{value:"\uFF0C\u4E0D\u5B58\u5728\u4F1A\u629B\u9519\u3002",paraId:7,tocIndex:6},{value:"\u8282\u70B9\u914D\u7F6E\uFF1A",paraId:7,tocIndex:6},{value:"getNodeFormConfig(pluginNodeType)",paraId:7,tocIndex:6},{value:" \u8FD4\u56DE\u63D2\u4EF6\u7684\u8868\u5355\u914D\u7F6E\uFF08schema\uFF09\u3002",paraId:7,tocIndex:6},{value:"\u5185\u7F6E\u63D2\u4EF6\uFF1A\u9ED8\u8BA4\u6CE8\u518C ",paraId:7,tocIndex:6},{value:"Trigger/Action/Branch/Parallel/Iteration/Merge/End",paraId:7,tocIndex:6},{value:" \u7B49\u8282\u70B9\u63D2\u4EF6\u3002",paraId:7,tocIndex:6},{value:"\u7C7B\u578B\u6E05\u5355\uFF1A",paraId:7,tocIndex:6},{value:"getAllPluginNodeTypes()",paraId:7,tocIndex:6},{value:" \u8FD4\u56DE ",paraId:7,tocIndex:6},{value:"{ value, label }",paraId:7,tocIndex:6},{value:" \u5217\u8868\u3002",paraId:7,tocIndex:6},{value:"\u6269\u5C55\u57FA\u7C7B\uFF1A\u7EE7\u627F ",paraId:8,tocIndex:7},{value:"BaseNodePlugin",paraId:8,tocIndex:7},{value:" \u5E76\u8BBE\u7F6E ",paraId:8,tocIndex:7},{value:"pluginNodeType",paraId:8,tocIndex:7},{value:" \u4E0E ",paraId:8,tocIndex:7},{value:"pluginNodeTypeName",paraId:8,tocIndex:7},{value:"\uFF08\u4E24\u8005\u9700\u4E0E\u8868\u5355 ",paraId:8,tocIndex:7},{value:"schema.type",paraId:8,tocIndex:7},{value:" \u548C\u5B9E\u9645\u8282\u70B9\u7528\u9014\u4FDD\u6301\u4E00\u81F4\uFF09\u3002",paraId:8,tocIndex:7},{value:"\u8868\u5355\u914D\u7F6E\uFF08\u53EF\u9009\uFF09\uFF1A\u5B9E\u73B0 ",paraId:8,tocIndex:7},{value:"getNodeFormConfig()",paraId:8,tocIndex:7},{value:" \u8FD4\u56DE ",paraId:8,tocIndex:7},{value:"NodeConfig",paraId:8,tocIndex:7},{value:"\uFF0CUI \u6A21\u5757\u4F1A\u636E\u6B64\u6E32\u67D3\u914D\u7F6E\u8868\u5355\u3002",paraId:8,tocIndex:7},{value:"\u8282\u70B9\u6267\u884C\uFF1A\u5B9E\u73B0 ",paraId:8,tocIndex:7},{value:"executeNode(node, engine)",paraId:8,tocIndex:7},{value:"\uFF0C\u53EF\u4F7F\u7528 ",paraId:8,tocIndex:7},{value:"engine.evaluateRule(...)",paraId:8,tocIndex:7},{value:" \u8BC4\u4F30\u6761\u4EF6\u4E0E ",paraId:8,tocIndex:7},{value:"engine.evaluateMethod(...)",paraId:8,tocIndex:7},{value:" \u8C03\u7528\u4E8B\u4EF6\uFF1B\u8FD4\u56DE\u5BF9\u8C61\u53EF\u5305\u542B ",paraId:8,tocIndex:7},{value:"success",paraId:8,tocIndex:7},{value:"\u3001",paraId:8,tocIndex:7},{value:"message",paraId:8,tocIndex:7},{value:"\u3001",paraId:8,tocIndex:7},{value:"eventResult",paraId:8,tocIndex:7},{value:" \u7B49\u3002",paraId:8,tocIndex:7},{value:"\u6CE8\u518C\uFF1A\u5728\u5E94\u7528\u542F\u52A8\u5904\u8C03\u7528 ",paraId:8,tocIndex:7},{value:"PluginManagerInstance().registerPlugin(...)",paraId:8,tocIndex:7},{value:" \u6216 ",paraId:8,tocIndex:7},{value:"registerAllPlugin([...])",paraId:8,tocIndex:7},{value:" \u5B8C\u6210\u6CE8\u5165\u3002",paraId:8,tocIndex:7},{value:"\u7ED1\u5B9A\u8282\u70B9\uFF1A\u5728\u6D41\u7A0B\u5B9A\u4E49\u7684\u8282\u70B9 ",paraId:8,tocIndex:7},{value:"data.pluginNodeType",paraId:8,tocIndex:7},{value:" \u8BBE\u7F6E\u4E3A\u4F60\u7684\u63D2\u4EF6\u7C7B\u578B\uFF08\u4F8B\u5982 ",paraId:8,tocIndex:7},{value:"'MyNode'",paraId:8,tocIndex:7},{value:"\uFF09\u3002",paraId:8,tocIndex:7},{value:"BaseNodePlugin \u57FA\u7C7B",paraId:9,tocIndex:7},{value:`
import {
  type Edge,
  type Node,
  type ExecutionHistory,
  type PluginNodeType,
  NodeStatus,
} from "@plugin-flow-engine/type/core";
import { type NodeConfig } from "@plugin-flow-engine/type/common";
import type { PluginExecutionEngine } from "@plugin-flow-engine/core";
import { NodePlugin } from "./NodePlugin";

/**
 * \u8282\u70B9\u63D2\u4EF6\u57FA\u7C7B
 * \u5B9E\u73B0\u4E86NodePlugin\u63A5\u53E3\u7684\u901A\u7528\u903B\u8F91\uFF0C\u4E3A\u5404\u79CD\u5177\u4F53\u8282\u70B9\u7C7B\u578B\u63D0\u4F9B\u7EDF\u4E00\u7684\u57FA\u7840\u5B9E\u73B0
 * \u5177\u4F53\u8282\u70B9\u63D2\u4EF6\u901A\u8FC7\u7EE7\u627F\u6B64\u7C7B\u5E76\u91CD\u5199\u7279\u5B9A\u65B9\u6CD5\u6765\u5B9E\u73B0\u5DEE\u5F02\u5316\u7684\u8282\u70B9\u884C\u4E3A
 */
export abstract class BaseNodePlugin implements NodePlugin {
  /**
   * \u63D2\u4EF6\u8282\u70B9\u7C7B\u578B\u6807\u8BC6\u7B26
   * \u7531\u5177\u4F53\u5B50\u7C7B\u5B9E\u73B0
   */
  abstract pluginNodeType: PluginNodeType;
  /**
   * \u63D2\u4EF6\u8282\u70B9\u7C7B\u578B\u540D\u79F0
   */
  abstract pluginNodeTypeName: string;

  /**
   * \u83B7\u53D6\u8282\u70B9\u8868\u5355\u914D\u7F6E\u9879
   * \u7528\u4E8E\u52A8\u6001\u751F\u6210\u8282\u70B9\u914D\u7F6E\u8868\u5355\uFF0C\u652F\u6301\u81EA\u5B9A\u4E49\u5B57\u6BB5\u548C\u9A8C\u8BC1\u89C4\u5219
   * @returns \u8282\u70B9\u8868\u5355\u914D\u7F6E\u9879schema\u5BF9\u8C61\u6216null\uFF08\u5982\u679C\u8282\u70B9\u4E0D\u652F\u6301\u914D\u7F6E\uFF09
   */
  getNodeFormConfig(): NodeConfig | null {
    return null;
  }

  /**
   * \u6267\u884C\u8282\u70B9\u7684\u6838\u5FC3\u4E1A\u52A1\u903B\u8F91\uFF08\u9ED8\u8BA4\u884C\u4E3A\uFF09
   * - \u5148\u8BC4\u4F30\u8282\u70B9\u4E0A\u7684\u6761\u4EF6\uFF08\u5982\u6709\uFF09
   * - \u518D\u6267\u884C\u4E8B\u4EF6\uFF08\u5982\u6709\uFF09
   * - \u8BB0\u5F55\u6267\u884C\u5386\u53F2\u7684\u72B6\u6001\u4E0E\u65F6\u95F4
   * \u5B50\u7C7B\u53EF\u8986\u5199\u4EE5\u5B9E\u73B0\u5DEE\u5F02\u5316\u903B\u8F91\uFF08\u5982\u5E76\u884C/\u8FED\u4EE3\uFF09
   */
  async executeNode(
    node: Node,
    pluginExecutionEngine: PluginExecutionEngine,
    historyItem?: ExecutionHistory
  ): Promise<boolean> {
    // \u8BC4\u4F30\u8282\u70B9\u6761\u4EF6\uFF08\u82E5\u672A\u914D\u7F6E\u6761\u4EF6\u5219\u89C6\u4E3A\u901A\u8FC7\uFF09
    const conditions = node.data?.config?.conditions;
    let shouldRun = true;
    try {
      if (conditions && Object.keys(conditions).length > 0) {
        shouldRun = await pluginExecutionEngine.evaluateRule(conditions, node.id);
      }
    } catch (error) {
      shouldRun = false;
    }

    if (!shouldRun) {
      if (historyItem) {
        historyItem.status = NodeStatus.PENDING;
        historyItem.endTime = new Date();
        historyItem.duration = historyItem.startTime
          ? historyItem.endTime.getTime() - historyItem.startTime.getTime()
          : 0;
        historyItem.contextAfter = {
          ...pluginExecutionEngine.getContextManager().getVariables(),
        };
      }
      return false;
    }

    // \u6267\u884C\u4E8B\u4EF6\uFF08\u82E5\u6709\uFF09
    let result: any = true;
    try {
      if (node.data?.config?.event) {
        result = await pluginExecutionEngine.evaluateMethod(
          node.data.config.event,
          node.id
        );
      }
    } catch (error) {
      // evaluateMethod \u5185\u90E8\u5DF2\u5904\u7406\u5386\u53F2\u9879\u4E0E\u9519\u8BEF\u72B6\u6001\uFF0C\u8FD9\u91CC\u4EC5\u8FD4\u56DE\u5931\u8D25
      result = false;
    }

    // \u8BB0\u5F55\u6267\u884C\u6210\u529F\u72B6\u6001\u4E0E\u65F6\u95F4
    if (historyItem) {
      historyItem.status = result ? NodeStatus.SUCCESS : NodeStatus.FAILED;
      historyItem.endTime = new Date();
      historyItem.duration = historyItem.startTime
        ? historyItem.endTime.getTime() - historyItem.startTime.getTime()
        : 0;
      historyItem.contextAfter = {
        ...pluginExecutionEngine.getContextManager().getVariables(),
      };
      historyItem.engineResult = result;
    }

    return !!result;
  }

  /**
   * \u83B7\u53D6\u8282\u70B9\u5F53\u524D\u7684\u6267\u884C\u72B6\u6001
   * @param node \u8981\u67E5\u8BE2\u72B6\u6001\u7684\u8282\u70B9\u5BF9\u8C61
   * @param pluginExecutionEngine \u63D2\u4EF6\u6267\u884C\u5F15\u64CE\u5B9E\u4F8B
   * @returns \u8282\u70B9\u72B6\u6001\u6216null
   */
  async getExecuteNodeStatus(
    node: Node,
    pluginExecutionEngine: PluginExecutionEngine
  ): Promise<NodeStatus | null> {
    return NodeStatus.SUCCESS;
  }

  /**
   * \u83B7\u53D6\u6D41\u7A0B\u4E2D\u4E0B\u4E00\u4E2A\u8981\u6267\u884C\u7684\u8282\u70B9ID\uFF08\u9ED8\u8BA4\u8DEF\u7531\u7B56\u7565\uFF09
   * - \u904D\u5386\u51FA\u8FB9\uFF0C\u4F18\u5148\u5339\u914D\u6761\u4EF6\u6210\u7ACB\u7684\u8FB9
   * - \u5176\u6B21\u9009\u62E9\u6807\u8BB0\u4E86 \`isDefault\` \u7684\u8FB9
   * - \u6700\u540E\u56DE\u9000\u5230\u7B2C\u4E00\u6761\u51FA\u8FB9
   */
  async getNextNodeId(
    edges: Edge[],
    pluginExecutionEngine: PluginExecutionEngine,
    historyItem?: ExecutionHistory
  ): Promise<string | string[] | null> {
    if (!edges || edges.length === 0) {
      return null;
    }

    // 1) \u4F18\u5148\u5339\u914D\u6761\u4EF6\u6210\u7ACB\u7684\u8FB9
    for (const edge of edges) {
      try {
        if (edge.data?.conditions) {
          const isMatch = await pluginExecutionEngine.evaluateRule(
            edge.data.conditions,
            edge.id
          );
          if (isMatch) {
            return edge.target;
          }
        }
      } catch {
        // \u5FFD\u7565\u5355\u6761\u8FB9\u7684\u89C4\u5219\u5F02\u5E38\uFF0C\u7EE7\u7EED\u5C1D\u8BD5\u5176\u4ED6\u8FB9
      }
    }

    // 2) \u9009\u62E9\u9ED8\u8BA4\u8FB9
    const defaultEdge = edges.find((e) => e.data?.isDefault);
    if (defaultEdge) {
      return defaultEdge.target;
    }

    // 3) \u56DE\u9000\u5230\u7B2C\u4E00\u6761\u51FA\u8FB9
    return edges[0].target;
  }

  /**
   * \u662F\u5426\u5E94\u8BE5\u6267\u884C\u6B64\u8282\u70B9\uFF08\u9ED8\u8BA4\u5B9E\u73B0\uFF09
   * - \u82E5\u8282\u70B9\u914D\u7F6E\u4E86\u6761\u4EF6\uFF0C\u5219\u5728\u6B64\u5904\u8FDB\u884C\u8BC4\u4F30\uFF0C\u672A\u901A\u8FC7\u5219\u8DF3\u8FC7\u6267\u884C
   */
  async shouldExecuteNode(
    node: Node,
    pluginExecutionEngine: PluginExecutionEngine
  ): Promise<boolean> {
    const conditions = node.data?.config?.conditions;
    if (!conditions || Object.keys(conditions).length === 0) {
      return true;
    }
    try {
      return await pluginExecutionEngine.evaluateRule(conditions, node.id);
    } catch {
      return false;
    }
  }

  /**
   * \u8282\u70B9\u6267\u884C\u5B8C\u6210\u540E\u7684\u56DE\u8C03\uFF08\u9ED8\u8BA4\u8DEF\u7531\u884C\u4E3A\uFF09
   * - \u5728\u6267\u884C\u6210\u529F\u65F6\u81EA\u52A8\u8DF3\u8F6C\u5230\u4E0B\u4E00\u4E2A\u8282\u70B9
   * - \u4F7F\u7528\u5F15\u64CE\u7684 \`getNextNodeId\` \u4EE5\u59D4\u6258\u5B50\u7C7B\uFF08\u5982\u5206\u652F/\u5E76\u884C\uFF09\u81EA\u5B9A\u4E49\u8DEF\u7531
   */
  async onNodeComplete(
    node: Node,
    pluginExecutionEngine: PluginExecutionEngine,
    historyItem: ExecutionHistory,
    result: boolean
  ): Promise<void> {
    if (!result) return;

    const next = await pluginExecutionEngine.getNextNodeId(
      node.id,
      historyItem
    );

    if (Array.isArray(next)) {
      // \u57FA\u7C7B\u9ED8\u8BA4\u987A\u5E8F\u6267\u884C\uFF08\u5E76\u884C\u8282\u70B9\u4F1A\u8986\u5199\u6B64\u65B9\u6CD5\u5B9E\u73B0\u5E76\u884C\uFF09
      for (const id of next) {
        await pluginExecutionEngine.executeNode(id);
      }
    } else if (typeof next === "string") {
      await pluginExecutionEngine.executeNode(next);
    }
    // null \u8868\u793A\u6D41\u7A0B\u7ED3\u675F\uFF0C\u57FA\u7C7B\u4E0D\u4F5C\u5904\u7406
  }
}
`,paraId:10,tocIndex:7},{value:"\u793A\u4F8B\uFF1A",paraId:11,tocIndex:7},{value:`import { PluginManagerInstance, BaseNodePlugin, type PluginExecutionEngine } from '@plugin-flow-engine/core';
import type { TopLevelCondition, Event, FlowData, Node } from '@plugin-flow-engine/type/core';
import  {NodeStatus} from '@plugin-flow-engine/type/core';

class MyNodePlugin extends BaseNodePlugin {
  pluginNodeType = 'MyNode';
  pluginNodeTypeName = '\u6211\u7684\u8282\u70B9';
  /**
   * \u53EF\u9009\u65B9\u6CD5\uFF0C\u7528\u4E8E\u5B9A\u4E49\u8282\u70B9\u7684\u8868\u5355\u914D\u7F6E
   * @returns \u8282\u70B9\u8868\u5355\u914D\u7F6E\u5BF9\u8C61
   */
  getNodeFormConfig() {
    return { schema: { type: 'Action', label: '\u6211\u7684\u8282\u70B9', config: [{ key: 'text', label: '\u6587\u672C', type: 'string' }] } };
  }
    /**
   * \u83B7\u53D6\u8282\u70B9\u6267\u884C\u72B6\u6001
   * @param node \u8282\u70B9\u4FE1\u606F
   * @param pluginExecutionEngine \u63D2\u4EF6\u6267\u884C\u5F15\u64CE
   * @returns \u6267\u884C\u72B6\u6001
   */
  async getExecuteNodeStatus(node: Node, pluginExecutionEngine: PluginExecutionEngine): Promise<NodeStatus | null> {
    return super.getExecuteNodeStatus(node, pluginExecutionEngine);
  }
}

// \u6CE8\u518C\uFF08\u5355\u4E2A\u6216\u6279\u91CF\uFF09
PluginManagerInstance().registerPlugin(new MyNodePlugin());
// PluginManagerInstance().registerAllPlugin([new MyNodePlugin(), new OtherPlugin()]);

// \u5728\u6D41\u7A0B\u6570\u636E\u4E2D\u7ED1\u5B9A\u63D2\u4EF6\u7C7B\u578B
const flowData: FlowData = {
  flow: { id: 'demo', name: 'Demo', version: '1.0.0', enable: true, description: '', category: 'demo', create_date: '', update_date: '' },
  context: { variables: {} },
  nodes: [
    { id: 'action', type: 'Action', position: { x: 200, y: 0 }, data: { name: '\u52A8\u4F5C', pluginNodeType: 'MyNode', config: { text: 'hi' } } },
  ],
  edges: [],
  global_config: {},
};
`,paraId:12,tocIndex:7},{value:"\u521D\u59CB\u5316\uFF1A",paraId:13,tocIndex:8},{value:"initialize(flowData, context)",paraId:13,tocIndex:8},{value:" \u9A8C\u8BC1\u6D41\u7A0B\u5B9A\u4E49\uFF0C\u5F52\u4E00\u5316\u8282\u70B9\u540D\u79F0\u5E76\u91CD\u7F6E\u7F13\u5B58\u3002",paraId:13,tocIndex:8},{value:"\u6267\u884C\u6D41\u7A0B\uFF1A",paraId:13,tocIndex:8},{value:"executeFlow(startNodeId = 'trigger')",paraId:13,tocIndex:8},{value:"\uFF0C\u5C06\u4ECE\u89E6\u53D1\u8282\u70B9\u5F00\u59CB\u63A8\u8FDB\uFF1B\u7ED3\u675F\u65F6\u89E6\u53D1 ",paraId:13,tocIndex:8},{value:"flow_completed",paraId:13,tocIndex:8},{value:" \u4E8B\u4EF6\uFF0C\u5E76\u8FD4\u56DE ",paraId:13,tocIndex:8},{value:"{ status, message, variables, errorInfo, executionReport }",paraId:13,tocIndex:8},{value:"\u3002",paraId:13,tocIndex:8},{value:"\u6267\u884C\u8282\u70B9\uFF1A",paraId:13,tocIndex:8},{value:"executeNode(nodeId)",paraId:13,tocIndex:8},{value:" \u59D4\u6258\u5BF9\u5E94\u63D2\u4EF6\u6267\u884C\uFF1B\u6210\u529F\u65F6\u89E6\u53D1 ",paraId:13,tocIndex:8},{value:"node_executed",paraId:13,tocIndex:8},{value:" \u4E0E ",paraId:13,tocIndex:8},{value:"history_updated",paraId:13,tocIndex:8},{value:"\u3002",paraId:13,tocIndex:8},{value:"\u6761\u4EF6\u8BC4\u4F30\uFF1A",paraId:13,tocIndex:8},{value:"evaluateRule(conditions, nodeId?)",paraId:13,tocIndex:8},{value:" \u57FA\u4E8E ",paraId:13,tocIndex:8},{value:"json-rules-engine",paraId:13,tocIndex:8},{value:"\uFF0C\u652F\u6301\u81EA\u5B9A\u4E49\u64CD\u4F5C\u7B26\u5E76\u5BF9\u7F3A\u5931 ",paraId:13,tocIndex:8},{value:"fact",paraId:13,tocIndex:8},{value:" \u8FDB\u884C\u5B89\u5168\u586B\u5145\u3002",paraId:13,tocIndex:8},{value:"\u4E8B\u4EF6\u8C03\u7528\uFF1A",paraId:13,tocIndex:8},{value:"evaluateMethod(event, nodeId?)",paraId:13,tocIndex:8},{value:" \u8C03\u7528\u7531 ",paraId:13,tocIndex:8},{value:"ComponentManager",paraId:13,tocIndex:8},{value:" \u6258\u7BA1\u7684\u65B9\u6CD5\uFF0C\u4F1A\u6839\u636E\u8FD4\u56DE\u5BF9\u8C61\u81EA\u52A8 ",paraId:13,tocIndex:8},{value:"updateVariables",paraId:13,tocIndex:8},{value:"\u3002",paraId:13,tocIndex:8},{value:"\u8DEF\u7531\u63A8\u8FDB\uFF1A",paraId:13,tocIndex:8},{value:"getNextNodeId(nodeId, historyItem?)",paraId:13,tocIndex:8},{value:" \u7531\u63D2\u4EF6\u51B3\u5B9A\uFF08\u57FA\u7C7B\u9ED8\u8BA4\u6309\u201C\u5339\u914D\u6761\u4EF6 > \u9ED8\u8BA4\u8FB9 > \u7B2C\u4E00\u51FA\u8FB9\u201D\u7B56\u7565\uFF09\u3002",paraId:13,tocIndex:8},{value:"\u4E8B\u4EF6\u8BA2\u9605\uFF1A",paraId:13,tocIndex:8},{value:"on(eventName, listener)",paraId:13,tocIndex:8},{value:" / ",paraId:13,tocIndex:8},{value:"off(eventName, listener)",paraId:13,tocIndex:8},{value:"\uFF1B\u5185\u7F6E\u4E8B\u4EF6\u5305\u62EC ",paraId:13,tocIndex:8},{value:"history_updated",paraId:13,tocIndex:8},{value:"\u3001",paraId:13,tocIndex:8},{value:"node_executed",paraId:13,tocIndex:8},{value:"\u3001",paraId:13,tocIndex:8},{value:"flow_completed",paraId:13,tocIndex:8},{value:"\u3002",paraId:13,tocIndex:8},{value:"\u76D1\u63A7\u4E0E\u6821\u9A8C\uFF1A\u96C6\u6210 ",paraId:13,tocIndex:8},{value:"FlowMonitor",paraId:13,tocIndex:8},{value:"\uFF08\u6027\u80FD\u4E0E\u7EDF\u8BA1\uFF09\u4E0E ",paraId:13,tocIndex:8},{value:"FlowValidator",paraId:13,tocIndex:8},{value:"\uFF08\u6D41\u7A0B\u7ED3\u6784\u4E0E\u903B\u8F91\u6821\u9A8C\uFF09\u3002",paraId:13,tocIndex:8},{value:"getPluginManager()",paraId:14,tocIndex:9},{value:"\uFF1A\u83B7\u53D6\u63D2\u4EF6\u7BA1\u7406\u5668\uFF08\u5168\u5C40\u5355\u4F8B\uFF09\u3002",paraId:14,tocIndex:9},{value:"getComponentManager()",paraId:14,tocIndex:9},{value:"\uFF1A\u83B7\u53D6\u7EC4\u4EF6/\u5168\u5C40\u65B9\u6CD5\u7BA1\u7406\u5668\uFF08\u5168\u5C40\u5355\u4F8B\uFF09\u3002",paraId:14,tocIndex:9},{value:"getContextManager()",paraId:14,tocIndex:9},{value:"\uFF1A\u83B7\u53D6\u4E0A\u4E0B\u6587\u7BA1\u7406\u5668\uFF08\u6BCF\u6D41\u7A0B\u5B9E\u4F8B\uFF0C\u5F3A\u5173\u8054\u5F15\u64CE\uFF09\u3002",paraId:14,tocIndex:9},{value:"initialize(flow, context)",paraId:14,tocIndex:9},{value:"\uFF1A\u521D\u59CB\u5316\u6D41\u7A0B\u6570\u636E\u4E0E\u4E0A\u4E0B\u6587\u3002",paraId:14,tocIndex:9},{value:"executeFlow(startNodeId = 'trigger')",paraId:14,tocIndex:9},{value:"\uFF1A\u6267\u884C\u6574\u6761\u6D41\u7A0B\u5E76\u8FD4\u56DE\u7ED3\u679C\u3002",paraId:14,tocIndex:9},{value:"executeNode(nodeId)",paraId:14,tocIndex:9},{value:"\uFF1A\u6267\u884C\u6307\u5B9A\u8282\u70B9\uFF08\u59D4\u6258\u5BF9\u5E94\u63D2\u4EF6\uFF09\u3002",paraId:14,tocIndex:9},{value:"getExecutionHistory()",paraId:14,tocIndex:9},{value:"\uFF1A\u83B7\u53D6\u6807\u51C6\u5316\u7684\u6267\u884C\u5386\u53F2\u5217\u8868\u3002",paraId:14,tocIndex:9},{value:"getNodes()",paraId:14,tocIndex:9},{value:" / ",paraId:14,tocIndex:9},{value:"getNode(id?)",paraId:14,tocIndex:9},{value:"\uFF1A\u8BFB\u53D6\u6240\u6709\u8282\u70B9\u6216\u6307\u5B9A\u8282\u70B9\u3002",paraId:14,tocIndex:9},{value:"getEdges(nodeId, edgeType)",paraId:14,tocIndex:9},{value:" / ",paraId:14,tocIndex:9},{value:"getIncomingEdges(nodeId)",paraId:14,tocIndex:9},{value:" / ",paraId:14,tocIndex:9},{value:"getOutgoingEdges(nodeId)",paraId:14,tocIndex:9},{value:"\uFF1A\u8BFB\u53D6\u67D0\u8282\u70B9\u7684\u8FB9\u3002",paraId:14,tocIndex:9},{value:"getNextNodeId(nodeId, historyItem?)",paraId:14,tocIndex:9},{value:"\uFF1A\u7531\u63D2\u4EF6\u51B3\u7B56\u83B7\u53D6\u4E0B\u4E00\u8282\u70B9 ID\uFF08\u652F\u6301\u5E76\u884C/\u5206\u652F\u7B56\u7565\uFF09\u3002",paraId:14,tocIndex:9},{value:"getNodeStatus(nodeId)",paraId:14,tocIndex:9},{value:"\uFF1A\u83B7\u53D6\u8282\u70B9\u5F53\u524D\u72B6\u6001\uFF08",paraId:14,tocIndex:9},{value:"pending/running/success/failed",paraId:14,tocIndex:9},{value:"\uFF09\u3002",paraId:14,tocIndex:9},{value:"getContext()",paraId:14,tocIndex:9},{value:" / ",paraId:14,tocIndex:9},{value:"updateContext(context)",paraId:14,tocIndex:9},{value:"\uFF1A\u8BFB\u53D6\u4E0E\u66FF\u6362\u6267\u884C\u4E0A\u4E0B\u6587\u3002",paraId:14,tocIndex:9},{value:"on(eventName, listener)",paraId:14,tocIndex:9},{value:" / ",paraId:14,tocIndex:9},{value:"off(eventName, listener)",paraId:14,tocIndex:9},{value:"\uFF1A\u8BA2\u9605/\u53D6\u6D88\u8BA2\u9605\u5F15\u64CE\u4E8B\u4EF6\uFF08",paraId:14,tocIndex:9},{value:"history_updated/node_executed/flow_completed",paraId:14,tocIndex:9},{value:"\uFF09\u3002",paraId:14,tocIndex:9},{value:"evaluateRule(conditions, nodeId?)",paraId:14,tocIndex:9},{value:"\uFF1A\u8BC4\u4F30\u6761\u4EF6\uFF08\u57FA\u4E8E ",paraId:14,tocIndex:9},{value:"json-rules-engine",paraId:14,tocIndex:9},{value:"\uFF09\u3002",paraId:14,tocIndex:9},{value:"evaluateMethod(event, nodeId?)",paraId:14,tocIndex:9},{value:"\uFF1A\u8C03\u7528\u4E8B\u4EF6\u65B9\u6CD5\u5E76\u6839\u636E\u8FD4\u56DE\u5BF9\u8C61\u81EA\u52A8\u5408\u5E76\u5230\u4E0A\u4E0B\u6587\u53D8\u91CF\u3002",paraId:14,tocIndex:9},{value:"\u5C5E\u6027\uFF1A",paraId:14,tocIndex:9},{value:"hasFailed: boolean",paraId:14,tocIndex:9},{value:" \u5F53\u524D\u5F15\u64CE\u662F\u5426\u53D1\u751F\u5931\u8D25\u6807\u8BB0\u3002",paraId:14,tocIndex:9},{value:"\u8BF4\u660E\uFF1A",paraId:15,tocIndex:9},{value:"emit(...)",paraId:15,tocIndex:9},{value:"\u3001",paraId:15,tocIndex:9},{value:"createEngine()",paraId:15,tocIndex:9},{value:"\u3001",paraId:15,tocIndex:9},{value:"collectConditionFacts(...)",paraId:15,tocIndex:9},{value:" \u7B49\u4E3A\u5185\u90E8\u65B9\u6CD5\uFF0C\u4E0D\u5BF9\u5916\u66B4\u9732\u3002",paraId:15,tocIndex:9},{value:"\u83B7\u53D6\uFF1A",paraId:16,tocIndex:10},{value:"getExecutionHistory()",paraId:16,tocIndex:10},{value:" \u8FD4\u56DE\u5386\u53F2\u9879\u6570\u7EC4\uFF1BHook \u4E2D\u4E5F\u4F1A\u5728 ",paraId:16,tocIndex:10},{value:"history_updated",paraId:16,tocIndex:10},{value:" \u65F6\u81EA\u52A8\u540C\u6B65\u3002",paraId:16,tocIndex:10},{value:"\u6570\u636E\u7ED3\u6784\u7C7B\u578B\u5B9A\u4E49\uFF1A\u8BE6\u89C1 ",paraId:16,tocIndex:10},{value:"Type \u6A21\u5757 - ExecutionHistory",paraId:17,tocIndex:10},{value:"\u5931\u8D25\u5B9A\u4F4D\uFF1A\u5185\u90E8\u6309\u6700\u65B0\u5931\u8D25\u9879\u751F\u6210 ",paraId:16,tocIndex:10},{value:"errorInfo",paraId:16,tocIndex:10},{value:"\uFF1B\u540C\u65F6\u4EA7\u51FA ",paraId:16,tocIndex:10},{value:"executionReport",paraId:16,tocIndex:10},{value:"\uFF08\u542B\u8282\u70B9\u7EDF\u8BA1\u4E0E\u5EFA\u8BAE\uFF09\u3002",paraId:16,tocIndex:10},{value:"\u7EDF\u4E00\u65B9\u6CD5\u8C03\u7528\uFF1A",paraId:18,tocIndex:11},{value:"callMethod(fullPath, ...params)",paraId:18,tocIndex:11},{value:` \u652F\u6301\uFF1A
`,paraId:18,tocIndex:11},{value:"instanceName.methodName",paraId:19,tocIndex:11},{value:"\uFF08\u7EC4\u4EF6\u5B9E\u4F8B\u65B9\u6CD5\uFF09\u3002",paraId:19,tocIndex:11},{value:"global.methodName",paraId:19,tocIndex:11},{value:"\uFF08\u5168\u5C40\u65B9\u6CD5\uFF09\u3002",paraId:19,tocIndex:11},{value:"window.methodName",paraId:19,tocIndex:11},{value:"\uFF08\u6D4F\u89C8\u5668\u5168\u5C40\uFF09\u3002",paraId:19,tocIndex:11},{value:"\u4E8B\u4EF6\u914D\u7F6E\uFF1A\u8282\u70B9 ",paraId:18,tocIndex:11},{value:"data.config.event",paraId:18,tocIndex:11},{value:" \u5F62\u5982 ",paraId:18,tocIndex:11},{value:"{ type: 'global.sendMsg' | 'ButtonRef.click', params: any }",paraId:18,tocIndex:11},{value:"\uFF1B\u53C2\u6570\u5C06\u539F\u6837\u4F20\u5165\u76EE\u6807\u65B9\u6CD5\u3002",paraId:18,tocIndex:11},{value:"\u7EC4\u4EF6\u6CE8\u518C\uFF1A",paraId:18,tocIndex:11},{value:"registerInstance(name, ref)",paraId:18,tocIndex:11},{value:"\uFF1B\u5728 ",paraId:18,tocIndex:11},{value:"useFlowEngine",paraId:18,tocIndex:11},{value:" \u4E2D\u53EF\u901A\u8FC7 ",paraId:18,tocIndex:11},{value:"options.components: [{ name, ref }]",paraId:18,tocIndex:11},{value:" \u6279\u91CF\u6CE8\u518C\u3002",paraId:18,tocIndex:11},{value:"\u5168\u5C40\u65B9\u6CD5\uFF1A",paraId:18,tocIndex:11},{value:"registerGlobalMethod(name, fn)",paraId:18,tocIndex:11},{value:" / ",paraId:18,tocIndex:11},{value:"registerGlobalMethods([{ name, method }])",paraId:18,tocIndex:11},{value:"\uFF1B\u652F\u6301\u6CE8\u9500\u4E0E\u67E5\u8BE2\u3002",paraId:18,tocIndex:11},{value:"\u8BA2\u9605\uFF1A",paraId:20,tocIndex:12},{value:"on(eventName, listener)",paraId:20,tocIndex:12},{value:" / ",paraId:20,tocIndex:12},{value:"off(eventName, listener)",paraId:20,tocIndex:12},{value:"\uFF1B\u5185\u7F6E\u4E8B\u4EF6\u5305\u62EC ",paraId:20,tocIndex:12},{value:"history_updated",paraId:20,tocIndex:12},{value:"\u3001",paraId:20,tocIndex:12},{value:"node_executed",paraId:20,tocIndex:12},{value:"\u3001",paraId:20,tocIndex:12},{value:"flow_completed",paraId:20,tocIndex:12},{value:"\u3002",paraId:20,tocIndex:12},{value:"\u4F5C\u7528\u57DF\uFF1A\u4E25\u683C\u6309\u201C\u6D41\u7A0B\u5F15\u64CE\u5B9E\u4F8B\u201D\u9694\u79BB\uFF0C\u6BCF\u6B21 ",paraId:20,tocIndex:12},{value:"useFlowEngine",paraId:20,tocIndex:12},{value:" \u521B\u5EFA\u7684 ",paraId:20,tocIndex:12},{value:"engine",paraId:20,tocIndex:12},{value:" \u6709\u72EC\u7ACB\u4E8B\u4EF6\u603B\u7EBF\u4E0E\u8BA2\u9605\u3002",paraId:20,tocIndex:12},{value:"\u7528\u9014\uFF1A\u805A\u7126\u67D0\u6761\u6D41\u7A0B\u7684\u751F\u547D\u5468\u671F\u8054\u52A8\uFF08\u5982 UI \u9AD8\u4EAE\u3001\u65E5\u5FD7\u8BB0\u5F55\uFF09",paraId:20,tocIndex:12},{value:"\u4F5C\u7528\u57DF\uFF1A\u6309\u201C\u6D41\u7A0B\u5B9E\u4F8B\u201D\u9694\u79BB\uFF1B\u4EC5\u5728\u8BE5\u6D41\u7A0B\u5F15\u64CE\u5185\u751F\u6548\uFF0C\u591A\u4E2A\u6D41\u7A0B\u5E76\u53D1\u6267\u884C\u4E0D\u4F1A\u4E92\u76F8\u6C61\u67D3\u3002",paraId:21,tocIndex:13},{value:"\u8BBF\u95EE\u65B9\u5F0F\uFF08\u5F3A\u5173\u8054\uFF09\uFF1AContextManager \u4E3A\u5F15\u64CE\u5185\u805A\u5BF9\u8C61\uFF0C\u5FC5\u987B\u901A\u8FC7 ",paraId:21,tocIndex:13},{value:"engine.getContextManager()",paraId:21,tocIndex:13},{value:" \u8BBF\u95EE\u4E0E\u8C03\u7528\uFF1B\u4E0D\u8981\u76F4\u63A5\u5BFC\u5165/\u5B9E\u4F8B\u5316\u540E\u72EC\u7ACB\u4F7F\u7528\u3002",paraId:21,tocIndex:13},{value:"\u521D\u59CB\u5316\u4E0E\u83B7\u53D6\uFF1A",paraId:21,tocIndex:13},{value:"initialize(initialContext)",paraId:21,tocIndex:13},{value:"\u3001",paraId:21,tocIndex:13},{value:"getContext()",paraId:21,tocIndex:13},{value:"\u3001",paraId:21,tocIndex:13},{value:"getVariables()",paraId:21,tocIndex:13},{value:"\u3002",paraId:21,tocIndex:13},{value:"\u66F4\u65B0\uFF1A",paraId:21,tocIndex:13},{value:"updateVariables(partial)",paraId:21,tocIndex:13},{value:"\uFF08\u90E8\u5206\u66F4\u65B0\uFF09\u3001",paraId:21,tocIndex:13},{value:"updateContext(next)",paraId:21,tocIndex:13},{value:"\uFF08\u6574\u4F53\u66FF\u6362\uFF09\u3002",paraId:21,tocIndex:13},{value:"\u76D1\u542C\uFF1A",paraId:21,tocIndex:13},{value:"addListener(listener)",paraId:21,tocIndex:13},{value:" / ",paraId:21,tocIndex:13},{value:"removeListener(listener)",paraId:21,tocIndex:13},{value:"\uFF1B\u53D8\u66F4\u540E\u81EA\u52A8\u901A\u77E5\u76D1\u542C\u5668\u3002",paraId:21,tocIndex:13},{value:"\u6E05\u7406\uFF1A",paraId:21,tocIndex:13},{value:"clear()",paraId:21,tocIndex:13},{value:" \u91CD\u7F6E\u53D8\u91CF\u4E3A ",paraId:21,tocIndex:13},{value:"{}",paraId:21,tocIndex:13},{value:" \u5E76\u5E7F\u64AD\u53D8\u66F4\u3002",paraId:21,tocIndex:13},{value:"\u793A\u4F8B\uFF08\u63A8\u8350\u901A\u8FC7\u5F15\u64CE\u8BBF\u95EE\uFF09\uFF1A",paraId:22,tocIndex:13},{value:`import { useFlowEngine } from '@plugin-flow-engine/core';

const { engine, updateVariables } = useFlowEngine({ flowData, initialVariables: {} });
const cm = engine.getContextManager();

// \u901A\u8FC7 ContextManager \u76F4\u63A5\u66F4\u65B0
cm.updateVariables({ a: 1 });

// \u6216\u4F7F\u7528 Hook \u63D0\u4F9B\u7684\u4FBF\u6377\u65B9\u6CD5\uFF08\u5185\u90E8\u540C\u6837\u8D70 ContextManager\uFF09
updateVariables({ b: 2 });
`,paraId:23,tocIndex:13},{value:"\u5916\u90E8\u6CE8\u5165\uFF1A",paraId:24,tocIndex:14},{value:"injectOperator(name, fn)",paraId:24,tocIndex:14},{value:" \u5C06\u5728\u6BCF\u6B21\u521B\u5EFA\u89C4\u5219\u5F15\u64CE\u65F6\u7EDF\u4E00\u6CE8\u518C\u3002",paraId:24,tocIndex:14},{value:`\u5DF2\u5185\u7F6E\u589E\u5F3A\u64CD\u4F5C\u7B26\uFF1A
`,paraId:24,tocIndex:14},{value:"\u5B57\u7B26\u4E32\uFF1A",paraId:25,tocIndex:14},{value:"start_with",paraId:25,tocIndex:14},{value:"\u3001",paraId:25,tocIndex:14},{value:"end_with",paraId:25,tocIndex:14},{value:"\u3001",paraId:25,tocIndex:14},{value:"regex",paraId:25,tocIndex:14},{value:"\u3001",paraId:25,tocIndex:14},{value:"include",paraId:25,tocIndex:14},{value:"\u3001",paraId:25,tocIndex:14},{value:"not_include",paraId:25,tocIndex:14},{value:"\u3002",paraId:25,tocIndex:14},{value:"\u6570\u503C\u8303\u56F4\uFF1A",paraId:25,tocIndex:14},{value:"between",paraId:25,tocIndex:14},{value:"\u3001",paraId:25,tocIndex:14},{value:"not_between",paraId:25,tocIndex:14},{value:"\u3002",paraId:25,tocIndex:14},{value:"\u7ED3\u6784\uFF1A",paraId:25,tocIndex:14},{value:"has_key",paraId:25,tocIndex:14},{value:"\u3001",paraId:25,tocIndex:14},{value:"is_empty",paraId:25,tocIndex:14},{value:"\u3001",paraId:25,tocIndex:14},{value:"not_empty",paraId:25,tocIndex:14},{value:"\u3002",paraId:25,tocIndex:14},{value:"\u5F15\u64CE\u6CE8\u518C\uFF1A\u7531\u5F15\u64CE\u5185\u90E8 ",paraId:24,tocIndex:14},{value:"registerAllOperators(engine)",paraId:24,tocIndex:14},{value:" \u7EDF\u4E00\u5B8C\u6210\u3002",paraId:24,tocIndex:14},{value:"\u5165\u53C2\uFF1A",paraId:26,tocIndex:15},{value:"{ flowData, initialVariables?, components?: [{ name, ref }] }",paraId:26,tocIndex:15},{value:"\u3002",paraId:26,tocIndex:15},{value:"\u8FD4\u56DE\uFF1A",paraId:26,tocIndex:15},{value:"{ engine, executeFlow, executionResult, executionHistory, isExecuting, updateVariables }",paraId:26,tocIndex:15},{value:"\u3002",paraId:26,tocIndex:15},{value:"\u5F15\u64CE\u5B9E\u4F8B\u65B9\u6CD5\uFF1A",paraId:26,tocIndex:15},{value:"engine.getPluginManager()",paraId:26,tocIndex:15},{value:"\u3001",paraId:26,tocIndex:15},{value:"engine.getContextManager()",paraId:26,tocIndex:15},{value:"\u3001",paraId:26,tocIndex:15},{value:"engine.getComponentManager()",paraId:26,tocIndex:15},{value:"\uFF1B\u5206\u522B\u7528\u4E8E\u63D2\u4EF6\u7BA1\u7406\u3001\u6BCF\u6D41\u7A0B\u4E0A\u4E0B\u6587\u7BA1\u7406\u4E0E\u7EC4\u4EF6/\u5168\u5C40\u65B9\u6CD5\u8C03\u7528\uFF08\u53C2\u8003 ",paraId:26,tocIndex:15},{value:"PluginExecutionEngine.ts",paraId:26,tocIndex:15},{value:"\uFF09\u3002",paraId:26,tocIndex:15},{value:"\u81EA\u52A8\u6267\u884C\uFF1A\u5F53 ",paraId:26,tocIndex:15},{value:"flowData.flow.auto === true",paraId:26,tocIndex:15},{value:"\uFF0C\u5728\u7EC4\u4EF6\u6302\u8F7D\u4E14\u7EC4\u4EF6\u5B9E\u4F8B\u6CE8\u518C\u5B8C\u6210\u540E\u81EA\u52A8\u8C03\u7528 ",paraId:26,tocIndex:15},{value:"executeFlow",paraId:26,tocIndex:15},{value:"\u3002",paraId:26,tocIndex:15},{value:"\u53D8\u91CF\u66F4\u65B0\uFF1A",paraId:26,tocIndex:15},{value:"updateVariables({ ... })",paraId:26,tocIndex:15},{value:" \u5C06\u901A\u8FC7 ",paraId:26,tocIndex:15},{value:"ContextManager",paraId:26,tocIndex:15},{value:" \u66F4\u65B0\u53D8\u91CF\uFF0C\u5E76\u5728\u540E\u7EED\u8282\u70B9\u8BC4\u4F30\u4E2D\u751F\u6548\u3002",paraId:26,tocIndex:15},{value:"\u81EA\u5B9A\u4E49\u64CD\u4F5C\u7B26\u6CE8\u5165\uFF1A",paraId:27,tocIndex:16},{value:`import { injectOperator } from '@plugin-flow-engine/core';
// \u6CE8\u5165\u201C\u5927\u5C0F\u5199\u4E0D\u654F\u611F\u5305\u542B\u201D\u64CD\u4F5C\u7B26
injectOperator('i_include', (fact, value) => {
  if (typeof fact !== 'string' || typeof value !== 'string') return false;
  return fact.toLowerCase().includes(value.toLowerCase());
});
`,paraId:28,tocIndex:16},{value:"\u81EA\u5B9A\u4E49\u63D2\u4EF6\u6CE8\u518C\uFF08\u4E0E UI \u6CE8\u5165\u914D\u5408\uFF09\uFF1A",paraId:29,tocIndex:16},{value:`import { PluginManagerInstance, BaseNodePlugin } from '@plugin-flow-engine/core';
import { registerPluginUI } from '@plugin-flow-engine/ui';
import { BuiltInPluginNodeTypes, AntdWidgetKeys, type NodeConfig } from '@plugin-flow-engine/type';
import type { WidgetProps } from '@plugin-flow-engine/type';
import { Input } from 'antd';

// 1) \u81EA\u5B9A\u4E49\u63A7\u4EF6
const CustomInputWidget: React.FC<WidgetProps<any>> = ({ value, onChange, ...rest }) => (
  <div>
    <label>\u6211\u662F\u81EA\u5B9A\u4E49\u7684\u63A7\u4EF6\u54E6</label>
    <Input {...rest} value={value} onChange={onChange} />
  </div>
);

// 2) \u63D2\u4EF6\u7684\u8868\u5355 schema\uFF08\u5305\u542B\u81EA\u5B9A\u4E49\u63A7\u4EF6\u6620\u5C04\uFF09
const schema: NodeConfig = {
  schema: {
    type: 'MyAction',
    label: '\u6211\u7684\u64CD\u4F5C',
    config: [
      { type: AntdWidgetKeys.Input, label: '\u64CD\u4F5C\u540D\u79F0', field: 'name', formItemProps: { required: true } },
      { type: 'custom-input', widget: 'custom-input', label: '\u64CD\u4F5C\u53C2\u6570', field: 'params', formItemProps: { required: true }, widgetProps: { placeholder: '\u8BF7\u8F93\u5165\u64CD\u4F5C\u53C2\u6570' } },
    ],
  },
  widgets: {
    'custom-input': CustomInputWidget,
  },
};

// 3) \u81EA\u5B9A\u4E49\u63D2\u4EF6\uFF08\u8FD4\u56DE schema \u4F9B UI \u6E32\u67D3\uFF09
class MyActionPlugin extends BaseNodePlugin {
  pluginNodeTypeName = '\u6211\u7684\u64CD\u4F5C';
  pluginNodeType = 'MyAction';
  getNodeFormConfig(): NodeConfig | null {
    return schema;
  }
}

// 4) \u6CE8\u518C\u63D2\u4EF6\uFF08\u4F7F\u5F15\u64CE\u53EF\u8BC6\u522B\u8BE5\u7C7B\u578B\uFF0C\u5E76\u53EF\u5728\u6D41\u7A0B\u4E2D\u4F7F\u7528\uFF09
PluginManagerInstance().registerPlugin(new MyActionPlugin());

// 5) \u8986\u76D6\u5185\u7F6E Action \u7684\u9ED8\u8BA4 UI \u8868\u5355\uFF08\u4EC5 UI \u5C42\u8986\u76D6\uFF0C\u4E1A\u52A1\u63D2\u4EF6\u4ECD\u6309\u5404\u81EA\u903B\u8F91\u6267\u884C\uFF09
registerPluginUI(BuiltInPluginNodeTypes.Action, schema);
`,paraId:30,tocIndex:16},{value:"\u4E8B\u4EF6\u8C03\u7528\uFF08\u5168\u5C40\u65B9\u6CD5\u4E0E\u7EC4\u4EF6\u5B9E\u4F8B\uFF09\uFF1A",paraId:31,tocIndex:16},{value:`import { ComponentManagerInstance } from '@plugin-flow-engine/core';
const cm = ComponentManagerInstance();

cm.registerGlobalMethod('sendMsg', (payload) => {
  console.log('\u53D1\u9001\uFF1A', payload);
  return { lastMsg: payload }; // \u8FD4\u56DE\u5BF9\u8C61\u5C06\u5408\u5E76\u5230\u4E0A\u4E0B\u6587\u53D8\u91CF
});

// \u8282\u70B9\u4E8B\u4EF6\u914D\u7F6E\u793A\u4F8B\uFF1A
node.data.config.event = { type: 'global.sendMsg', params: { text: 'Hello' } };
// \u6216\uFF1Anode.data.config.event = { type: 'ButtonRef.click', params: { id: 1 } };
`,paraId:32,tocIndex:16}]}}]);
