/*
 * @File: FlowView.tsx
 * @desc: 流程视图组件
 */
import {
  addEdge,
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  Panel,
  ReactFlow,
  useEdgesState,
  useNodesState,
} from '@xyflow/react';
// @ts-ignore: no module declaration for CSS import
import {
  ClearOutlined,
  CodeOutlined,
  LoadingOutlined,
  PlayCircleOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { BuiltInPluginNodeTypes } from '@chloehe/logic-engine-common';
import type { Node as XYFlowNode } from '@xyflow/react';
import {
  registerMultiplePluginUI,
  removeNodeUIConfig,
  resolveNodeFormConfig,
} from '@chloehe/logic-engine-ui';
import '@xyflow/react/dist/style.css';
import { Button, message, Modal, Select, Space } from 'antd';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import FlowConsole from '../FlowConsole';
import type { RuleFieldData } from '../RuleEditor/types';
import { ConfigDrawer, edgeTypes, nodeTypes } from './components';
import type { FlowData, FlowViewProps } from './types';
import {
  debounce,
  FlowGraphOps,
  getLabelByNodeType,
  getAllPluginNodeTypes,
  mergeNodeDefaultConfigs,
  onPaneMouseMove,
  onPaneMouseUp,
  PerformanceMonitor,
} from './utils';
import {
  normalizeConfigFormValues,
  prepareConfigFormValues,
} from './utils/helpers';
// 默认节点的配置表单
import './common/schema';
// 边配置 schema
import edgeConfigSchema from './common/schema/EdgeConfig';

// ============================================================================
// 流程视图组件
// ============================================================================

const FlowView: React.FC<FlowViewProps> = ({
  data,
  initialValue,
  nodeConfigs,
  customPluginManager,
  onNodeConfigChange,
  isValidate = true,
  onExecute,
  executionHistory = [],
  showPerformance = false,
  executionResult,
  onSaveFlowData,
}) => {
  const [consoleOpen, setConsoleOpen] = useState(false);
  const [localLoading, setLocalLoading] = useState(false);
  const [performanceEnabled, setPerformanceEnabled] = useState(false);

  // 统一配置状态：type: 'node' | 'edge' | null, item: 选中的节点或边, schema: 表单配置, value: 表单值, savedValue: 保存时的值
  const [configState, setConfigState] = useState<{
    type: 'node' | 'edge' | null;
    item: any;
    schema: any;
    value: Record<string, any>;
    savedValue: Record<string, any>;
  }>({
    type: null,
    item: null,
    schema: null,
    value: {},
    savedValue: {},
  });

  const formRef = useRef<any>(null);

  // 受控节点与边状态
  const [nodes, setNodes, onNodesChange] = useNodesState(data?.nodes as XYFlowNode[] ?? []);
  const [edges, setEdges, onEdgesChange] = useEdgesState(data?.edges ?? []);

  // 性能监控初始化
  useEffect(() => {
    PerformanceMonitor.init();
    return () => {
      PerformanceMonitor.reset();
    };
  }, []);

  // 注册节点配置到全局注册表
  useEffect(() => {
    if (!nodeConfigs) return;
    registerMultiplePluginUI(nodeConfigs);
    return () => {
      Object.keys(nodeConfigs).forEach((pt: any) => removeNodeUIConfig(pt));
    };
  }, [nodeConfigs]);

  // 初始化节点默认配置（仅在挂载时执行一次，不响应 data prop 后续变化）
  useEffect(() => {
    if (!data?.nodes) return;
    try {
      setNodes(mergeNodeDefaultConfigs(data.nodes, nodeConfigs));
    } catch (e) {
      console.warn('初始化默认配置失败', e);
    }
  }, []);

  // 获取可用字段（用于规则编辑器）
  const availableFacts = useMemo((): RuleFieldData[] => {
    const variables = data?.context?.variables || {};
    return Object.keys(variables).map((key) => ({
      key,
      label: variables[key].description || key,
      fieldName: key,
      type: variables[key].type || 'string',
    }));
  }, [data?.context?.variables]);

  // 打开节点配置抽屉
  const openConfigDrawer = useCallback(
    (node: any) => {
      try {
        const schema = resolveNodeFormConfig(node.data?.pluginNodeType);
        if (!schema) return;

        const defaults: Record<string, any> = {};
        schema.schema.config?.forEach((field: any) => {
          if (field?.defaultValue !== undefined)
            defaults[field.field] = field.defaultValue;
        });

        const dataLevelValues: Record<string, any> = {};
        schema.schema.config?.forEach((field: any) => {
          if (node.data?.[field.field] !== undefined) {
            dataLevelValues[field.field] = node.data[field.field];
          }
        });

        const rawValues = {
          ...defaults,
          ...dataLevelValues,
          ...(node.data?.config ?? {}),
          ...(initialValue?.[node.id] ?? {}),
        };

        const enhancedSchema = {
          ...schema.schema,
          config: schema.schema.config?.map((field: any) => {
            if (field?.type === 'rule_editor' || field?.widget === 'rule_editor') {
              return {
                ...field,
                widgetProps: {
                  ...field.widgetProps,
                  fields: availableFacts,
                },
              };
            }
            return field;
          }),
        };

        setTimeout(() => {
          setConfigState({
            type: 'node',
            item: node,
            schema: enhancedSchema,
            value: prepareConfigFormValues(rawValues, enhancedSchema),
            savedValue: { ...dataLevelValues, ...(node.data?.config ?? {}) },
          });
        }, 0);
      } catch (e) {
        console.error(e);
        message.error('加载节点配置失败');
      }
    },
    [initialValue, availableFacts],
  );

  const ops = useMemo(
    () =>
      new FlowGraphOps({
        getNodes: () => nodes as any,
        setNodes: setNodes as any,
        getEdges: () => edges as any,
        setEdges: setEdges as any,
        getLabelByType: getLabelByNodeType,
        openConfigDrawer,
      }),
    [nodes, edges, openConfigDrawer],
  );

  // 使用 useRef 缓存 debounced 函数，避免每次渲染创建新的 debounce 实例
  const debouncedFormChangeRef = useRef<(val: Record<string, any>) => void>(
    debounce((val: Record<string, any>) => {
      setConfigState((prev) => ({ ...prev, value: val }));
    }, 150),
  );

  const handleFormChange = useCallback((val: Record<string, any>) => {
    debouncedFormChangeRef.current(val);
  }, []);

  // 统一保存配置
  const handleConfigSave = useCallback(() => {
    const { type, item, schema } = configState;
    if (!type || !item?.id) return;

    const form = formRef.current?.form;
    if (!form) return;

    const currentValues = form.getFieldsValue();
    const normalizedValues = normalizeConfigFormValues(currentValues, schema);

    if (type === 'node') {
      const dataLevelFields = new Set<string>();
      schema?.config?.forEach((field: any) => {
        if (
          field?.level === 'data' ||
          (item.data?.[field?.field] !== undefined && field?.field !== 'config')
        ) {
          dataLevelFields.add(field.field);
        }
      });

      const dataLevelValues: Record<string, any> = {};
      const configLevelValues: Record<string, any> = {};

      Object.keys(normalizedValues).forEach((key) => {
        if (dataLevelFields.has(key)) {
          dataLevelValues[key] = normalizedValues[key];
        } else {
          configLevelValues[key] = normalizedValues[key];
        }
      });

      setNodes((prev) => {
        const updated = (prev as any[]).map((n) =>
          n.id === item.id
            ? {
                ...n,
                data: {
                  ...n.data,
                  ...dataLevelValues,
                  config: configLevelValues,
                },
              }
            : n,
        );
        const completeFlowData: FlowData = {
          flow: data.flow,
          context: data.context,
          nodes: updated,
          edges: edges as any,
          global_config: data.global_config,
        };
        onSaveFlowData?.(completeFlowData);
        onNodeConfigChange?.(item.id, {
          ...dataLevelValues,
          config: configLevelValues,
        });
        return updated;
      });
      message.success('已保存当前节点配置');
    } else {
      setEdges((prev) => {
        const updated = prev.map((e) =>
          e.id === item.id
            ? { ...e, data: { ...e.data, ...normalizedValues } }
            : e,
        );
        const completeFlowData: FlowData = {
          flow: data.flow,
          context: data.context,
          nodes: nodes as any,
          edges: updated,
          global_config: data.global_config,
        };
        onSaveFlowData?.(completeFlowData);
        return updated;
      });
      message.success('边配置已保存');
    }

    setConfigState((prev) => ({ ...prev, savedValue: normalizedValues }));
  }, [configState, data, nodes, edges, onSaveFlowData, onNodeConfigChange]);

  // 统一关闭配置抽屉
  const handleConfigClose = useCallback(() => {
    const { type, item, schema, savedValue } = configState;
    const form = formRef.current?.form;

    if (!form || !type || !item?.id) {
      setConfigState((prev) => ({
        ...prev,
        type: null,
        item: null,
        schema: null,
        value: {},
        savedValue: {},
      }));
      return;
    }

    const currentValues = form.getFieldsValue();
    const normalizedCurrentValues = normalizeConfigFormValues(
      currentValues,
      schema,
    );

    if (
      JSON.stringify(savedValue) === JSON.stringify(normalizedCurrentValues)
    ) {
      setConfigState((prev) => ({
        ...prev,
        type: null,
        item: null,
        schema: null,
        value: {},
        savedValue: {},
      }));
      return;
    }

    Modal.confirm({
      title: '是否保存当前配置？',
      content:
        type === 'node' && isValidate
          ? '保存前将进行校验。'
          : '是否保存对配置所做的更改？',
      okText: '保存',
      cancelText: '取消',
      onOk: async () => {
        try {
          if (type === 'node' && isValidate) {
            await form.validateFields();
          }
          handleConfigSave();
          setConfigState((prev) => ({
            ...prev,
            type: null,
            item: null,
            schema: null,
            value: {},
            savedValue: {},
          }));
          message.success(
            type === 'node' && isValidate ? '校验通过并已保存' : '已保存配置',
          );
        } catch {
          message.error('校验失败，请检查表单输入项');
        }
      },
      onCancel: () =>
        setConfigState((prev) => ({
          ...prev,
          type: null,
          item: null,
          schema: null,
          value: {},
          savedValue: {},
        })),
    });
  }, [configState, isValidate, handleConfigSave]);

  // 边点击事件处理
  const onEdgeClick = useCallback(
    (event: React.MouseEvent, edge: any) => {
      event.stopPropagation();

      const sourceNode = nodes.find((n: any) => n.id === edge.source);

      if (sourceNode?.data?.pluginNodeType === BuiltInPluginNodeTypes.Branch) {
        const edgeConfig = edge.data || {};
        const schema = {
          ...edgeConfigSchema,
          config: edgeConfigSchema.config.map((field: any) => {
            if (field.type === 'rule_editor') {
              return {
                ...field,
                widgetProps: {
                  ...field.widgetProps,
                  fields: availableFacts,
                },
              };
            }
            return field;
          }),
        };
        setConfigState({
          type: 'edge',
          item: edge,
          schema,
          value: prepareConfigFormValues(edgeConfig, schema),
          savedValue: edgeConfig,
        });
      }
    },
    [nodes, availableFacts],
  );

  // 保存流程 — 整合完整 FlowData
  const handleSaveFlow = useCallback(() => {
    const completeFlowData: FlowData = {
      flow: data.flow,
      context: data.context,
      nodes: nodes as any,
      edges: edges as any,
      global_config: data.global_config,
    };
    onSaveFlowData?.(completeFlowData);
    console.log('保存流程数据:', completeFlowData);
  }, [data, nodes, edges, onSaveFlowData]);

  // 添加节点
  const handleAddNode = useCallback(
    (pluginNodeType: string) => {
      if (!pluginNodeType) return;
      const label = getLabelByNodeType(pluginNodeType) || pluginNodeType;
      const newNode: any = {
        id: `n_${Date.now()}`,
        type: 'basic_node',
        position: {
          x: 100 + Math.random() * 200,
          y: 100 + Math.random() * 200,
        },
        data: { name: label, label, pluginNodeType },
      };
      setNodes((prev) => [...prev, newNode]);
      openConfigDrawer(newNode);
    },
    [setNodes, openConfigDrawer],
  );

  // 清空画布
  const handleClearCanvas = useCallback(() => {
    Modal.confirm({
      title: '确认清空画布？',
      content: '此操作将删除画布上所有节点和连线，不可恢复。',
      okText: '确认清空',
      okType: 'danger',
      cancelText: '取消',
      onOk: () => {
        setNodes([]);
        setEdges([]);
        setConfigState({
          type: null,
          item: null,
          schema: null,
          value: {},
          savedValue: {},
        });
        message.success('画布已清空');
      },
    });
  }, [setNodes, setEdges]);

  // 获取装饰后的边（传递额外数据）
  const getDecoratedEdges = useMemo(() => {
    return ops
      .decorateEdges(edges as any, ops.insertNodeOnEdge)
      .map((edge: any) => {
        const sourceNode = nodes.find((n: any) => n.id === edge.source);
        const isBranchEdge =
          sourceNode?.data?.pluginNodeType === BuiltInPluginNodeTypes.Branch;
        return {
          ...edge,
          data: {
            ...edge.data,
            availableFacts,
            nodeConfig: sourceNode?.data?.config,
            onEdgeClick: isBranchEdge
              ? () => {
                  const edgeConfig = edge.data || {};
                  const schema = {
                    ...edgeConfigSchema,
                    config: edgeConfigSchema.config.map((field: any) => {
                      if (field.type === 'rule_editor') {
                        return {
                          ...field,
                          widgetProps: {
                            ...field.widgetProps,
                            fields: availableFacts,
                          },
                        };
                      }
                      return field;
                    }),
                  };
                  setConfigState({
                    type: 'edge',
                    item: edge,
                    schema,
                    value: prepareConfigFormValues(edgeConfig, schema),
                    savedValue: edgeConfig,
                  });
                }
              : undefined,
          },
        };
      });
  }, [ops, edges, nodes, availableFacts]);

  // 合并全局插件和自定义插件列表
  const mergedNodeTypes = useMemo(() => {
    const globalTypes = getAllPluginNodeTypes();
    if (!customPluginManager) {
      return globalTypes;
    }
    const customTypes = customPluginManager.getAllPluginNodeTypes();
    // 使用 Map 去重，customTypes 覆盖 globalTypes
    const merged = new Map(globalTypes.map((t) => [t.value, t]));
    customTypes.forEach((t) => merged.set(t.value, t));
    return Array.from(merged.values());
  }, [customPluginManager]);

  // ============================================================================
  // 渲染
  // ============================================================================

  return (
    <div
      id="flow-box"
      style={{ position: 'relative', width: '100%', height: '100%' }}
    >
      {performanceEnabled && (
        <div
          style={{
            position: 'absolute',
            top: 8,
            right: 8,
            zIndex: 10,
            padding: '8px 12px',
            background: 'rgba(255,255,255,0.95)',
            borderRadius: 4,
            fontSize: 12,
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          }}
        >
          <div>渲染次数：{PerformanceMonitor.metrics.renderCount}</div>
          <div>
            平均渲染：{PerformanceMonitor.metrics.avgRenderTime.toFixed(2)}ms
          </div>
          <div>
            最后缩放：{PerformanceMonitor.metrics.lastZoomLevel.toFixed(2)}x
          </div>
          <div>
            最后位置：{PerformanceMonitor.metrics.lastPanX.toFixed(0)},
            {PerformanceMonitor.metrics.lastPanY.toFixed(0)}
          </div>
        </div>
      )}

      <div style={{ height: '100%' }}>
        <ReactFlow
          nodes={ops.decorateNodes(nodes, ops.addNodeAfter)}
          edges={getDecoratedEdges}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          fitView
          fitViewOptions={{
            padding: 0.1,
            duration: 200,
            interpolate: 'smooth',
          }}
          selectionKeyCode={null}
          minZoom={0.5}
          maxZoom={2}
          defaultEdgeOptions={{
            type: 'basic_edge',
            animated: false,
            style: { strokeWidth: 1.5 },
          }}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={(_, node) => openConfigDrawer(node)}
          onEdgeClick={onEdgeClick}
          onMouseMove={onPaneMouseMove}
          onMouseUp={onPaneMouseUp}
          onConnect={(connection) => {
            const edgeType =
              connection.source === connection.target
                ? 'self_edge'
                : 'basic_edge';
            setEdges((els) =>
              addEdge(
                { ...connection, type: edgeType, style: { strokeWidth: 1.5 } },
                els,
              ),
            );
          }}
          isValidConnection={(edge) => {
            // 允许自环边（用于迭代节点），但禁止其他无效连接
            if (edge.target === edge.source) {
              // 检查源节点是否为迭代节点
              const sourceNode = nodes.find((n: any) => n.id === edge.source);
              return (
                sourceNode?.data?.pluginNodeType ===
                BuiltInPluginNodeTypes.Iteration
              );
            }
            return true;
          }}
        >
          <Background
            color="#ccc"
            gap={8}
            size={1}
            variant={BackgroundVariant.Dots}
          />
          <MiniMap
            style={{
              backgroundColor: '#f8fafc',
              borderRadius: 8,
              boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
            }}
            pannable
            zoomable
            ariaLabel="小地图"
          />
          <Controls />
          <Panel position="top-left">
            <Space>
            <Button type="primary" size="small" onClick={handleSaveFlow}>
              保存流程
            </Button>

            <Select
              placeholder="添加节点"
              size="small"
              style={{ minWidth: 110 }}
              value={undefined}
              onChange={handleAddNode}
              options={mergedNodeTypes}
              suffixIcon={<PlusOutlined />}
              popupMatchSelectWidth={false}
              notFoundContent="暂无可用节点类型"
            />

            <Button
              size="small"
              icon={<ClearOutlined />}
              danger
              onClick={handleClearCanvas}
            >
              清空画布
            </Button>

            {showPerformance && (
              <Button
                type={performanceEnabled ? 'primary' : 'default'}
                onClick={() => setPerformanceEnabled(!performanceEnabled)}
                size="small"
              >
                性能监控
                {performanceEnabled &&
                  ` (${(PerformanceMonitor.getReport() as any).fps}fps)`}
              </Button>
            )}
            {!!onExecute && (
              <>
                <Button
                  type="primary"
                  icon={
                    localLoading ? <LoadingOutlined /> : <PlayCircleOutlined />
                  }
                  onClick={() => {
                    // 先构建最新流程数据
                    const latestData: FlowData = {
                      flow: data.flow,
                      context: data.context,
                      nodes: nodes as any,
                      edges: edges as any,
                      global_config: data.global_config,
                    };
                    setLocalLoading(true);
                    setTimeout(() => {
                      Promise.resolve()
                        .then(() => onExecute?.(latestData))
                        .finally(() => setLocalLoading(false));
                    }, 0);
                  }}
                  disabled={!onExecute || localLoading}
                  loading={localLoading}
                  size="small"
                >
                  {localLoading ? '执行中...' : '执行流程'}
                </Button>
                <Button
                  type={consoleOpen ? 'primary' : 'default'}
                  onClick={() => setConsoleOpen(!consoleOpen)}
                  size="small"
                  icon={<CodeOutlined />}
                >
                  控制台
                  {executionHistory.length > 0 &&
                    ` (${executionHistory.length})`}
                </Button>
              </>
            )}
            </Space>
          </Panel>
        </ReactFlow>
      </div>

      {/* 统一配置抽屉 */}
      {configState.type && (
        <ConfigDrawer
          open={!!configState.type}
          onClose={handleConfigClose}
          title={
            configState.type === 'node'
              ? `${configState.item?.data?.label ?? ''}（${
                  configState.item?.data?.pluginNodeType
                }）`
              : `${
                  nodes.find((n: any) => n.id === configState.item?.source)
                    ?.data?.label || '分支节点'
                }——分支条件配置`
          }
          schema={configState.schema}
          value={configState.value}
          onChange={handleFormChange}
          formRef={formRef}
          isValidate={configState.type === 'node' ? isValidate : undefined}
          onSave={handleConfigSave}
        />
      )}

      {!!onExecute && (
        <FlowConsole
          open={consoleOpen}
          onClose={() => setConsoleOpen(false)}
          executionHistory={executionHistory}
          executionResult={executionResult}
        />
      )}
    </div>
  );
};

export default FlowView;
