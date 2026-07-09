/*
 * @File: FlowEditorDemo.tsx
 * @desc: 完整流程编辑 & 执行 Demo — 单页模式
 */
import React, { useRef, useState, useEffect, useCallback } from 'react';
import { message, Typography } from 'antd';
import { FlowView } from '@chloehe/logic-engine-ui';
import { PluginExecutionEngine } from '@chloehe/logic-engine-core';
import type { FlowData, ExecutionHistory } from '@chloehe/logic-engine-core';
import DemoButton from './demo/DemoButton';
import DemoForm from './demo/DemoForm';
import DemoTable from './demo/DemoTable';
import customPluginManager from './plugin';
const { Text } = Typography;

const initialFlowData: FlowData = {
  flow: {
    id: 'demo_flow_001', name: '示例流程：用户审批', version: '1.0.0',
    description: '演示业务组件事件绑定与流程执行', category: 'demo',
    enable: true, create_date: '2025-06-01', update_date: '2025-06-09', auto: false,
  },
  context: { variables: { applicant: { type: 'string', source: 'form', default: '张三' }, approved: { type: 'boolean', source: 'form', default: false } } },
  nodes: [
    { id: 'trigger', type: 'basic_node', position: { x: 100, y: 100 }, data: { label: '开始', pluginNodeType: 'Trigger', config: { event: { type: 'DemoButton.setLabel', params: { label: '新的按钮文本' } } }  } },
    { id: 'action1', type: 'basic_node', position: { x: 350, y: 100 }, data: { label: '提交审批', pluginNodeType: 'Action', config: { event: { type: 'DemoForm.onSubmit', params: {} } } } },
    { id: 'action2', type: 'basic_node', position: { x: 600, y: 100 }, data: { label: '记录日志', pluginNodeType: 'Action', config: { event: { type: 'DemoTable.onRowClick', params: {} } } } },
    { id: 'custom_plugin', type: 'basic_node', position: { x: 850, y: 100 }, data: { label: '自定义插件', pluginNodeType: 'Test', config: { }}},
    { id: 'end', type: 'basic_node', position: { x: 1000, y: 100 }, data: { label: '结束', pluginNodeType: 'End', config: {} } },
  ],
  edges: [
    { id: 'e1', source: 'trigger', target: 'action1', type: 'basic_edge', data: {} },
    { id: 'e2', source: 'action1', target: 'action2', type: 'basic_edge', data: {} },
    { id: 'e3', source: 'action2', target: 'custom_plugin', type: 'basic_edge', data: {} },
    { id: 'e4', source: 'custom_plugin', target: 'end', type: 'basic_edge', data: {} },
  ],
  global_config: {},
};

const FlowEditorDemo: React.FC = () => {
  const engineRef = useRef<PluginExecutionEngine | null>(null);
  const [executionHistory, setExecutionHistory] = useState<ExecutionHistory[]>([]);
  const [executionResult, setExecutionResult] = useState<any>(null);

  // 持有最新的 flowData，引擎初始化后直接据此执行
  const flowDataRef = useRef<FlowData>(initialFlowData);


  // 初始化引擎
  useEffect(() => {
    try {
      // { pluginManager: createPluginManager() }
      const engine = new PluginExecutionEngine({ pluginManager: customPluginManager });
      // engine.registerPlugin(new TestPlugin());
      engine.initialize(flowDataRef.current, { variables: { applicant: '张三', approved: false } });
      // 在下一个微任务同步组件，避免 setTimeout 时序不可控
      Promise.resolve().then(() => {
        (engine);
      });
      engineRef.current = engine;
    } catch (e) {
      console.error('引擎初始化失败', e);
    }
    return () => {
      try { engineRef.current?.dispose?.(); } catch { /* ignore */ }
      engineRef.current = null;
    };
  }, []);

  // 执行流程 — 使用 FlowView 传入的最新数据
  const handleExecute = useCallback(async (flowData?: FlowData) => {
    setExecutionHistory([]);

    const engine = engineRef.current;
    if (!engine) { message.error('引擎未初始化'); return; }

    // 优先使用 FlowView 传递的最新数据，兜底使用 flowDataRef
    const latestData = flowData || flowDataRef.current;
    flowDataRef.current = latestData;

    // 用最新数据重新初始化引擎
    engine.initialize(latestData, { variables: { applicant: '张三', approved: false } });
    (engine);

    try {
      // 由核心引擎自动查找 pluginNodeType === 'Trigger' 的起始节点
      const result = await engine.executeFlow();
      setExecutionResult(result);
      if (result?.status) message.success('流程执行成功');
      else message.error(result?.message || '流程执行失败');
    } catch { message.error('流程执行失败，请查看控制台了解详情'); }
    setExecutionHistory(engine.getExecutionHistory());
  }, []);

  // 保存流程
  const handleSaveFlowData = useCallback((flowData: FlowData) => {
    flowDataRef.current = flowData;
    message.success('流程数据已保存');
  }, []);

  // 节点配置变更
  const handleNodeConfigChange = useCallback((nodeId: string, nodeData: any) => {
    if (!nodeData?.config) return;
    // 更新 flowDataRef 中对应节点的配置
    const updated = { ...flowDataRef.current, nodes: flowDataRef.current.nodes.map(n =>
      n.id === nodeId ? { ...n, data: { ...n.data, config: { ...(n.data as any).config, ...nodeData.config } } } : n
    )};
    flowDataRef.current = updated;
    message.success(`节点 "${nodeId}" 配置已更新`);
  }, []);

  return (
    <div style={{ padding: 16, maxWidth: 1400, margin: '0 auto' }}>
      <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
        <div style={{ flex: '0 0 auto', display: 'flex', flexDirection: 'column', gap: 8, padding: 12, background: '#fafafa', borderRadius: 6, border: '1px solid #f0f0f0' }}>
          <Text type="secondary" style={{ fontSize: 12, fontWeight: 500 }}>业务组件（自动注册事件）</Text>
          <div style={{ width: 300 }}>
            <DemoButton />
            <DemoForm />
            <DemoTable />
            </div>
        </div>

        <div style={{ flex: 1, border: '1px solid #f0f0f0', borderRadius: 6, overflow: 'hidden', height: 520 }}>
          <FlowView
            data={initialFlowData}
            executionHistory={executionHistory}
            onExecute={handleExecute}
            onSaveFlowData={handleSaveFlowData}
            onNodeConfigChange={handleNodeConfigChange}
            executionResult={executionResult}
            customPluginManager={customPluginManager}
          />
        </div>
      </div>
    </div>
  );
};

export default FlowEditorDemo;
