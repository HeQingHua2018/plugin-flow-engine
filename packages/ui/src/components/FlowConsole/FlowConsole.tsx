/*
 * @File: FlowConsole.tsx
 * @desc: 流程执行控制台 — 直接使用 core 包 ExecutionHistory 类型
 */
import React from 'react';
import { Drawer, Tag, Typography, Space, Card, Empty, Descriptions, Divider } from 'antd';
import { LoadingOutlined, CheckCircleOutlined, CloseCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { ParallelStrategy, type ExecutionHistory } from '@chloehe/logic-engine-core';
import moment from 'moment';

const { Text } = Typography;

export type FlowConsoleProps = {
  // 是否打开控制台抽屉
  open: boolean;
  // 关闭控制台抽屉的回调函数
  onClose: () => void;
  // 执行历史记录，直接使用 core 包的 ExecutionHistory 类型
  executionHistory: ExecutionHistory[];
  // 执行结果，包含状态、消息、变量和错误信息
  executionResult?: { status: boolean; message: string; variables?: any; errorInfo?: any; executionReport?: any } | null;
}

const statusLabel: Record<string, { color: string; icon: React.ReactNode; label: string }> = {
  pending:  { color: '#d9d9d9', icon: <ClockCircleOutlined />,   label: '待执行' },
  waiting:  { color: '#faad14', icon: <ClockCircleOutlined />,   label: '等待中' },
  running:  { color: '#1890ff', icon: <LoadingOutlined />,       label: '执行中' },
  success:  { color: '#52c41a', icon: <CheckCircleOutlined />,  label: '成功' },
  failed:   { color: '#ff4d4f', icon: <CloseCircleOutlined />,  label: '失败' },
};

const iterationModeLabel: Record<number, string> = {
  0: '全部成功',
  1: '任一成功',
  2: '任一失败',
};

const fmtTime = (d?: Date): string => {
  return d ? moment(d).format('YYYY-MM-DD HH:mm:ss') : '-';
};

const fmtJSON = (data: any): string => {
  if (data === undefined || data === null) return '-';
  if (typeof data === 'string') return data;
  return JSON.stringify(data, null, 2);
};

const JsonBlock: React.FC<{ data: any; maxHeight?: number }> = ({ data, maxHeight = 160 }) => {
  const str = fmtJSON(data);
  if (str === '-') return <Text type="secondary">-</Text>;
  return (
    <pre style={{
      margin: '4px 0 0', fontSize: 11, lineHeight: 1.5, maxHeight, overflow: 'auto',
      background: '#f6f8fa', padding: '6px 8px', borderRadius: 4,
      border: '1px solid #e8e8e8', whiteSpace: 'pre-wrap', wordBreak: 'break-all',
    }}>{str}</pre>
  );
};

const NodeCard: React.FC<{ exec: ExecutionHistory }> = ({ exec }) => {
  const cfg = statusLabel[exec.status] || statusLabel.pending;
  return (
    <Card size="small" style={{ marginBottom: 12, border: `1px solid ${cfg.color}20` }}
          styles={{ body: { padding: '12px 16px' } }}>
      {/* 头部 */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <Space>
          <Text strong style={{ fontSize: 14 }}>{exec.nodeName}</Text>
          <Text code style={{ fontSize: 11, color: '#999' }}>{exec.nodeId}</Text>
        </Space>
        <Space>
          <Tag color={cfg.color} style={{ margin: 0, borderRadius: 10 }}>{cfg.icon} {cfg.label}</Tag>
          {exec.duration !== undefined && <Text style={{ fontSize: 12, color: '#666' }}>{exec.duration}ms</Text>}
        </Space>
      </div>
      {/* 时间 */}
      <Descriptions size="small" column={2} style={{ marginBottom: 6 }}>
        <Descriptions.Item label="开始时间">{fmtTime(exec.startTime)}</Descriptions.Item>
        <Descriptions.Item label="结束时间">{fmtTime(exec.endTime)}</Descriptions.Item>
      </Descriptions>
      <Divider style={{ margin: '6px 0' }} />
      {/* 上下文 */}
      {(exec.contextBefore || exec.contextAfter) && (
        <div style={{ marginBottom: 8 }}>
          <Text strong style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>上下文</Text>
          <div style={{ display: 'flex', gap: 8 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <Text type="secondary" style={{ fontSize: 10 }}>执行前:</Text>
              <JsonBlock data={exec.contextBefore} maxHeight={100} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <Text type="secondary" style={{ fontSize: 10 }}>执行后:</Text>
              <JsonBlock data={exec.contextAfter} maxHeight={100} />
            </div>
          </div>
        </div>
      )}
      {/* 规则 */}
      {exec.conditions && typeof exec.conditions === 'object' && Object.keys(exec.conditions).length > 0 && (
        <div style={{ marginBottom: 8 }}>
          <Text strong style={{ fontSize: 12, display: 'block', marginBottom: 2 }}>规则</Text>
          <JsonBlock data={exec.conditions} maxHeight={120} />
        </div>
      )}
      {/* 执行事件 */}
      {exec.event?.type && (
        <div style={{ marginBottom: 8 }}>
          <Text strong style={{ fontSize: 12, display: 'block', marginBottom: 2 }}>执行事件</Text>
          <Descriptions size="small" column={1}>
            <Descriptions.Item label="事件名"><Text code style={{ fontSize: 11 }}>{exec.event.type}</Text></Descriptions.Item>
          </Descriptions>
          {exec.event.params && Object.keys(exec.event.params).length > 0 && (
            <div>
              <Text type="secondary" style={{ fontSize: 11 }}>参数:</Text>
              <JsonBlock data={exec.event.params} maxHeight={100} />
            </div>
          )}
        </div>
      )}
      {/* 事件执行结果 */}
      {exec.eventResult !== undefined && exec.eventResult !== null && (
        <div style={{ marginBottom: 8 }}>
          <Text strong style={{ fontSize: 12, display: 'block', marginBottom: 2 }}>事件执行结果</Text>
          <JsonBlock data={exec.eventResult} maxHeight={80} />
        </div>
      )}
      {/* 节点执行结果 */}
      {exec.engineResult !== undefined && exec.engineResult !== null && (
        <div style={{ marginBottom: 8 }}>
          <Text strong style={{ fontSize: 12, display: 'block', marginBottom: 2 }}>节点执行结果</Text>
          <JsonBlock data={exec.engineResult} maxHeight={80} />
        </div>
      )}
      {/* 分支决策 */}
      {exec.decision && (
        <div style={{ marginBottom: 8 }}>
          <Text strong style={{ fontSize: 12, display: 'block', marginBottom: 2 }}>分支决策</Text>
          <Descriptions size="small" column={2}>
            <Descriptions.Item label="选中路径"><Text code style={{ fontSize: 11 }}>{exec.decision.selectPath}</Text></Descriptions.Item>
            <Descriptions.Item label="是否默认">{exec.decision.isDefault ? '是' : '否'}</Descriptions.Item>
          </Descriptions>
          {exec.decision.conditions && (
            <div>
              <Text type="secondary" style={{ fontSize: 11 }}>决策条件:</Text>
              <JsonBlock data={exec.decision.conditions} maxHeight={100} />
            </div>
          )}
        </div>
      )}
      {/* 并行策略 */}
      {exec.parallel_strategy && (
        <div style={{ marginBottom: 8 }}>
          <Text strong style={{ fontSize: 12, display: 'block', marginBottom: 2 }}>并行策略</Text>
          <Tag color={exec.parallel_strategy === ParallelStrategy.ALL ? 'blue' : 'orange'}>
            {exec.parallel_strategy === ParallelStrategy.ALL ? '全部成功' : '任一成功'}
          </Tag>
          {exec.parallel_edges && exec.parallel_edges.length > 0 && (
            <div style={{ marginTop: 6 }}>
              <Text type="secondary" style={{ fontSize: 11 }}>并行路径:</Text>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 4 }}>
                {exec.parallel_edges.map((edge, idx) => (
                  <Tag key={idx}  color={edge.isDefault ? 'default' : 'processing'}>
                    {edge.target}
                  </Tag>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
      {/* 结束节点标记 */}
      {exec.is_end_node && (
        <div>
          <Tag color="default" icon={<ClockCircleOutlined />}>流程结束节点</Tag>
        </div>
      )}
      {/* 迭代模式 */}
      {exec.iteration_mode !== undefined && (
        <div style={{ marginBottom: 8 }}>
          <Text strong style={{ fontSize: 12, display: 'block', marginBottom: 2 }}>迭代配置</Text>
          <Descriptions size="small" column={2}>
            <Descriptions.Item label="迭代模式"><Tag color="purple">{iterationModeLabel[exec.iteration_mode] || '未知'}</Tag></Descriptions.Item>
            <Descriptions.Item label="迭代次数"><Text code style={{ fontSize: 11 }}>{exec.iteration_count || 1}</Text></Descriptions.Item>
          </Descriptions>
        </div>
      )}
    </Card>
  );
};

const FlowConsole: React.FC<FlowConsoleProps> = ({ open, onClose, executionHistory, executionResult }) => {
  return (
    <Drawer
      title={
        <Space>
          <span style={{ fontWeight: 600, fontSize: 15 }}>执行控制台</span>
          <Tag color={ executionResult ? (executionResult.status ? 'success' : 'error') : 'default' }>
            {executionResult ? executionResult.message : '尚未执行'}
          </Tag>
        </Space>
      }
      placement="bottom"
      height={420}
      open={open}
      onClose={onClose}
      styles={{ body: { overflowY: 'auto' } }}
      rootStyle={{ position: 'absolute', zIndex: 9 }}
      getContainer={() => document.getElementById('flow-box') || document.body}
      destroyOnHidden
    >
      {executionHistory.length === 0 ? (
        <Empty description="暂无执行记录，请点击「执行流程」按钮" image={Empty.PRESENTED_IMAGE_SIMPLE} />
      ) : (
        <div>
          <Card size="small" style={{ marginBottom: 12, background: '#fafafa' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Text strong>执行节点数: {executionHistory.length}</Text>
              <Text type="secondary" style={{ fontSize: 12 }}>
                成功: {executionHistory.filter(n => n.status === 'success').length} |
                失败: {executionHistory.filter(n => n.status === 'failed').length} |
                运行中: {executionHistory.filter(n => n.status === 'running').length}
              </Text>
            </div>
          </Card>
          {executionHistory.map((exec, idx) => (
            <NodeCard key={`${exec.nodeId}-${idx}`} exec={exec} />
          ))}
        </div>
      )}
    </Drawer>
  );
};

export default FlowConsole;
