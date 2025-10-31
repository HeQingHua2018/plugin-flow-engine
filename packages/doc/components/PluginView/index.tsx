/*
 * @File: index.tsx
 * @desc: 插件化架构Demo主入口
 * @author: heqinghua
 * @date: 2025年09月18日
 */

import React, { useRef, useMemo } from 'react';
import { Card, Button, Col, Row } from 'antd';
import {
  useFlowEngine,
} from '@plugin-flow-engine/core';
import Demo1 from './demo/Demo1';
import Demo2 from './demo/Demo2';
import { Demo1Ref } from './demo/Demo1';
import { Demo2Ref } from './demo/Demo2';
import { data } from './demo/data';

/**
 * 插件化架构Demo组件
 * 展示如何使用插件化机制构建和执行流程
 */
const PluginDemo: React.FC = () => {
  
  const demo1Ref = useRef<Demo1Ref>(null);
  const demo2Ref = useRef<Demo2Ref>(null);
  
  // 使用 useRef 存储组件配置，避免重复渲染
  const componentsRef = useRef([
    { name: Demo1.displayName!, ref: demo1Ref },
    { name: Demo2.displayName!, ref: demo2Ref },
  ]);
  
  // 使用 useMemo 确保 initialVariables 只在组件挂载时创建一次
  const initialVariables = useMemo(() => ({
    username: 'admin',
    password: '123456',
    agreeTerms: true
  }), []);

  
  const {
    engine,
    executeFlow,
    executionResult,
    executionHistory,
    isExecuting,
    updateVariables,
  } = useFlowEngine({
    flowData: data,
    initialVariables,
    components: componentsRef.current,
  });

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      <div className="mb-4">
        <Button
          onClick={executeFlow}
          type="primary"
          size="middle"
          disabled={!engine || isExecuting}
          loading={isExecuting}
          style={{marginBottom:12}}
        >
          {isExecuting ? '执行中...' : '执行流程'}
        </Button>
      </div>
      {/* 执行结果 */}
      {executionResult && (
        <div
          style={{
            marginBottom: "20px",
            padding: "15px",
            backgroundColor: executionResult.status ? "#e8f5e8" : "#ffebee",
            borderLeft: `4px solid ${executionResult.status ? "#4CAF50" : "#f44336"}`,
            borderRadius: "4px",
          }}
        >
          <p>{executionResult.message}</p>
          <div style={{ marginTop: "10px" }}>
            <h4>{executionResult.status ? '上下文变量:' :' 错误信息：'}</h4>
            <pre
              style={{
                fontSize: "12px",
                backgroundColor: "#fff",
                padding: "10px",
                borderRadius: "4px",
                maxHeight: "300px",
                overflowY: "auto",
              }}
            >
              {executionResult.status ? JSON.stringify(executionResult.variables, null, 2) :JSON.stringify(executionResult.errorInfo, null, 2) }
            </pre>
          </div>
        </div>
      )}

      <Row className="mb-[30px]" gutter={16}>
        <Col span={12}>
         {/* 组件 */}
          <Demo1 ref={demo1Ref} initialValues={initialVariables} updateVariables={updateVariables} />
          <Demo2 ref={demo2Ref} />
        </Col>

        <Col span={12}>
          {/* 执行历史记录 */}
          <Card title="执行历史记录">
            <div
              style={{
                maxHeight: "510px",
                overflowY: "auto",
              }}
            >
              {executionHistory.length === 0 ? (
                <p>暂无执行历史</p>
              ) : (
                executionHistory.map((record, index) => (
                  <div
                    key={index}
                    style={{
                      marginBottom: "15px",
                      padding: "10px",
                      backgroundColor: record.status === 'success' ? '#e8f5e8' : '#ffebee',
                      borderRadius: "4px",
                    }}
                  >
                    <div style={{ fontWeight: "bold" }}>
                      {`${index + 1}. 节点名（id）: ${record.nodeName} (${record.nodeId})`}
                    </div>
                    <div style={{ 
                      color: record.status === 'success' ? '#52c41a' : '#ff4d4f',
                      fontSize: "12px",
                      fontWeight: "bold"
                    }}>
                      执行状态: {record.status}
                    </div>
                     {record.startTime && <div style={{ color: "#666", fontSize: "12px" }}>
                        开始时间: {record.startTime.getTime()}
                      </div>
                      }
                       {record.endTime && <div style={{ color: "#666", fontSize: "12px" }}>
                        结束时间: {record.endTime.getTime()}
                      </div>
                      }
                      <div style={{ color: "#666", fontSize: "12px" }}>
                        耗时: {record.duration}ms
                      </div>
                      {
                        record.decision && (
                           <div style={{ marginTop: "5px", fontSize: "12px" }}>
                        <strong>分支决策信息:</strong>
                        <pre style={{ margin: 0, fontSize: "11px" }}>
                         {JSON.stringify(record.decision, null, 2)}
                        </pre>
                      </div>
                        )
                      }
                    {record.event && (
                      <div style={{ marginTop: "5px", fontSize: "12px" }}>
                        <strong>执行事件:</strong>
                        <pre style={{ margin: 0, fontSize: "11px" }}>
                          事件名: {record.event.type}
                          <br/>
                          参数: {JSON.stringify(record.event.params, null, 2)}
                        </pre>
                      </div>
                    )}
                     {record.eventResult && (
                      <div style={{ marginTop: "5px", fontSize: "12px" }}>
                        <strong>事件执行结果:</strong>
                        <pre style={{ margin: 0, fontSize: "11px" }}>
                         {JSON.stringify(record.eventResult, null, 2)}
                        </pre>
                      </div>
                    )}
                    {record.contextBefore && (
                      <div style={{ marginTop: "5px", fontSize: "12px" }}>
                        <strong>执行前上下文:</strong>
                        <pre style={{ margin: 0, fontSize: "11px", maxHeight: "100px", overflow: "auto" }}>
                          {JSON.stringify(record.contextBefore, null, 2)}
                        </pre>
                      </div>
                    )}
                    {record.contextAfter && (
                      <div style={{ marginTop: "5px", fontSize: "12px" }}>
                        <strong>执行后上下文:</strong>
                        <pre style={{ margin: 0, fontSize: "11px", maxHeight: "100px", overflow: "auto" }}>
                          {JSON.stringify(record.contextAfter, null, 2)}
                        </pre>
                      </div>
                    )}
                     {record.conditions && (
                      <div style={{ marginTop: "5px", fontSize: "12px" }}>
                        <strong>规则:</strong>
                        <pre style={{  margin: 0, fontSize: "11px" }}>
                          {JSON.stringify(record.conditions, null, 2)}
                        </pre>
                      </div>
                    )}
                    {record.engineResult && (
                      <div style={{ marginTop: "5px", fontSize: "12px" }}>
                        <strong>节点执行结果:</strong>
                        <div style={{ margin: 0, fontSize: "11px" }}>
                          {JSON.stringify(record.engineResult,null,2)}
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default PluginDemo;