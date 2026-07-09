/*
 * @File: PerformancePanel.tsx
 * @desc: 性能监控面板组件，用于展示虚拟滚动和规则引擎优化的性能数据
 * @author: heqinghua
 * @date: 2026 年 06 月 15 日
 */

import React from 'react';
import { Card, Statistic, Row, Col, Progress, Tag } from 'antd';
import {
  CheckCircleOutlined,
  SyncOutlined,
  DatabaseOutlined,
  RocketOutlined,
} from '@ant-design/icons';

/**
 * 性能面板属性接口
 */
export interface PerformancePanelProps {
  /**
   * 是否启用虚拟滚动
   */
  virtualScrollEnabled: boolean;
  /**
   * 总节点数
   */
  totalNodes: number;
  /**
   * 可见节点数
   */
  visibleNodes: number;
  /**
   * 渲染比例
   */
  renderRatio: number;
  /**
   * 规则引擎池统计信息（可选）
   */
  ruleEnginePoolStats?: {
    poolSize: number;
    reuseRate: number;
    createCount: number;
    reuseCount: number;
  };
  /**
   * 缓存统计信息（可选）
   */
  cacheStats?: {
    hitRate: number;
    size: number;
    capacity: number;
  };
}

/**
 * 性能监控面板组件
 * 用于展示虚拟滚动和规则引擎优化的性能数据
 */
const PerformancePanel: React.FC<PerformancePanelProps> = ({
  virtualScrollEnabled,
  totalNodes,
  visibleNodes,
  renderRatio,
  ruleEnginePoolStats,
  cacheStats,
}) => {
  // 计算性能提升百分比
  const performanceImprovement = virtualScrollEnabled
    ? ((1 - renderRatio) * 100).toFixed(1)
    : '0';

  return (
    <Card
      title={
        <span>
          <RocketOutlined style={{ marginRight: 8 }} />
          性能监控面板
        </span>
      }
      size="small"
      style={{
        position: 'absolute',
        bottom: 20,
        right: 20,
        width: 320,
        zIndex: 1000,
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
      }}
    >
      <Row gutter={[16, 16]}>
        {/* 虚拟滚动状态 */}
        <Col span={12}>
          <Statistic
            title="虚拟滚动"
            value={virtualScrollEnabled ? '启用' : '禁用'}
            prefix={
              virtualScrollEnabled ? (
                <CheckCircleOutlined style={{ color: '#52c41a' }} />
              ) : (
                <SyncOutlined spin style={{ color: '#8c8c8c' }} />
              )
            }
            valueStyle={{
              fontSize: 14,
              color: virtualScrollEnabled ? '#52c41a' : '#8c8c8c',
            }}
          />
        </Col>

        {/* 性能提升 */}
        <Col span={12}>
          <Statistic
            title="性能提升"
            value={performanceImprovement}
            suffix="%"
            prefix={<RocketOutlined />}
            valueStyle={{
              fontSize: 14,
              color: virtualScrollEnabled ? '#1890ff' : '#8c8c8c',
            }}
          />
        </Col>

        {/* 节点统计 */}
        <Col span={24}>
          <div style={{ marginBottom: 8 }}>
            <Tag color="blue">总节点: {totalNodes}</Tag>
            <Tag color="green">可见节点: {visibleNodes}</Tag>
            <Tag color="orange">渲染比例: {(renderRatio * 100).toFixed(1)}%</Tag>
          </div>
          <Progress
            percent={parseFloat((renderRatio * 100).toFixed(1))}
            strokeColor={{
              '0%': '#108ee9',
              '100%': '#87d068',
            }}
            size="small"
            showInfo={false}
          />
        </Col>

        {/* 规则引擎池统计 */}
        {ruleEnginePoolStats && (
          <Col span={24}>
            <div style={{ marginBottom: 8 }}>
              <DatabaseOutlined style={{ marginRight: 4 }} />
              规则引擎池
            </div>
            <Row gutter={8}>
              <Col span={8}>
                <Statistic
                  title="池大小"
                  value={ruleEnginePoolStats.poolSize}
                  valueStyle={{ fontSize: 12 }}
                />
              </Col>
              <Col span={8}>
                <Statistic
                  title="复用率"
                  value={ruleEnginePoolStats.reuseRate.toFixed(1)}
                  suffix="%"
                  valueStyle={{ fontSize: 12 }}
                />
              </Col>
              <Col span={8}>
                <Statistic
                  title="创建次数"
                  value={ruleEnginePoolStats.createCount}
                  valueStyle={{ fontSize: 12 }}
                />
              </Col>
            </Row>
          </Col>
        )}

        {/* 缓存统计 */}
        {cacheStats && (
          <Col span={24}>
            <div style={{ marginBottom: 8 }}>
              <DatabaseOutlined style={{ marginRight: 4 }} />
              LRU 缓存
            </div>
            <Row gutter={8}>
              <Col span={8}>
                <Statistic
                  title="命中率"
                  value={cacheStats.hitRate.toFixed(1)}
                  suffix="%"
                  valueStyle={{ fontSize: 12 }}
                />
              </Col>
              <Col span={8}>
                <Statistic
                  title="缓存大小"
                  value={cacheStats.size}
                  valueStyle={{ fontSize: 12 }}
                />
              </Col>
              <Col span={8}>
                <Statistic
                  title="容量"
                  value={cacheStats.capacity}
                  valueStyle={{ fontSize: 12 }}
                />
              </Col>
            </Row>
            <Progress
              percent={parseFloat(cacheStats.hitRate.toFixed(1))}
              strokeColor="#52c41a"
              size="small"
              showInfo={false}
              style={{ marginTop: 4 }}
            />
          </Col>
        )}
      </Row>
    </Card>
  );
};

export default PerformancePanel;