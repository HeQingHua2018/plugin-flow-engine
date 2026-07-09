/* eslint-disable @typescript-eslint/no-unused-vars */
/*
 * @File: basic.tsx
 * @desc: FlowView 基础示例
 */
import React, { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import { FlowView } from '@chloehe/logic-engine-ui';
import { PluginExecutionEngine } from '@chloehe/logic-engine-core';
import type { ExecutionHistory } from '@chloehe/logic-engine-core';
import './schema';
import {  message } from 'antd';
import {data} from './data';  


const basic: React.FC = () => {
  const engineRef = useRef<PluginExecutionEngine | null>(null);

  const [executionHistory, setExecutionHistory] = useState<ExecutionHistory[]>([]);
  const [executionResult, setExecutionResult] = useState<{
    status: boolean;
    message: string;
    variables?: Record<string, any>;
    errorInfo?: any;
    retries?: number;
    stoppedAt?: string;
  } | null>(null);

  // 用 ref 持有最新 flowData，执行前用最新数据初始化引擎
  const latestFlowDataRef = useRef(data);

  const initialVariables = useMemo(
    () => ({
      username: 'admin',
      password: '123456',
      agreeTerms: true,
    }),
    [],
  );

  useEffect(() => {
    try {
      const engine = new PluginExecutionEngine();
      engine.initialize(data, { variables: initialVariables });
      engineRef.current = engine;
    } catch (e) {
      console.error('引擎初始化失败', e);
    }
    return () => { try { engineRef.current?.dispose?.(); } catch {} engineRef.current = null; };
  }, [initialVariables]);

  const handleExecute = useCallback(async (flowData?: any) => {
    const engine = engineRef.current;
    if (!engine) return;

    // 优先使用 FlowView 传入的最新数据
    const latestData = flowData || latestFlowDataRef.current;
    latestFlowDataRef.current = latestData;
    console.log('开始执行流程，初始化数据:', latestData, 'execution variables:', initialVariables);
    engine.initialize(latestData, { variables: initialVariables });
    try {
      // 由核心引擎自动查找起始节点
      const result = await engine.executeFlow();
      setExecutionHistory(engine.getExecutionHistory());
      setExecutionResult(result);
      console.log('流程执行结果:', result);
      message.info(result.status ? '流程执行成功' : '流程执行失败');
    } catch (e: any) {
      setExecutionHistory(engine.getExecutionHistory());
      console.error('流程执行异常:', e);
      message.error('流程执行异常');
    }

  }, []);

  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <FlowView
        data={data}
        initialValue={{
          'trigger': { api_key: ["key1"] },
          'show_email_node': { api_key: ["key1", "key2"] },
        }}
        onExecute={handleExecute}
        executionHistory={executionHistory}
        executionResult={executionResult}
        onNodeConfigChange={(nodeId, values) => {
          const flow: any = latestFlowDataRef.current;
          const nodes: any[] = [...flow.nodes];
          const idx = nodes.findIndex((n: any) => n.id === nodeId);
          if (idx >= 0) {
            nodes[idx] = {
              ...nodes[idx],
              data: { ...nodes[idx].data, config: { ...nodes[idx].data?.config, ...values.config } },
            };
            latestFlowDataRef.current = { ...flow, nodes };
          }
        }}
        onSaveFlowData={(savedData) => {
          latestFlowDataRef.current = savedData;
        }}
      />
    </div>
  );
};

export default basic;
