/*
 * @File: FlowView.tsx
 * @desc: 流程视图组件
 */
import { Background, BackgroundVariant, Controls, MiniMap, ReactFlow, useEdgesState, useNodesState } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Button, Drawer, message, Modal, Space } from 'antd';
import DynamicConfigForm from '../../widget/DynamicConfigForm';
import { bindPluginsToUI, resolveNodeFormConfig } from '../../utils/PluginUIRegistry';
import { PluginManagerInstance } from '@plugin-flow-engine/core';

import { FlowGraphOps } from './GraphOps';
import React, { useEffect, useRef, useState } from 'react';
import type { FlowData } from '@plugin-flow-engine/type';
import { nodeTypes, edgeTypes } from './components';


export interface FlowViewProps {
  /**
   * 流程数据（完整结构）
   */
  data: FlowData;
  /**
   * 节点的初始配置（按节点 id 索引）
   */
  initialValue?: Record<string, Record<string, any>>;
  /**
   * 节点配置变更时的回调（向外抛出）
   * @param nodeId 节点 id
   * @param formValues 节点配置表单值
   */
  onNodeConfigChange?: (
    nodeId: string,
    formValues: Record<string, any>,
  ) => void;
  /** 关闭抽屉时是否进行校验 */
  isValidate?: boolean;
}

/**
 * 流程视图组件（库版本）
 * - 通过 props 输入节点与边数据
 * - 支持点击节点打开动态配置表单
 * - 可在抽屉关闭时进行校验与保存
 */
const FlowView: React.FC<FlowViewProps> = ({
  data,
  initialValue,
  onNodeConfigChange,
  isValidate = true,
}) => {
  const pm = PluginManagerInstance();
  const nodeTypeSelect = pm.getAllPluginNodeTypes();
  console.log(nodeTypeSelect);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [nodeFormSchema, setNodeFormSchema] = useState<any>(null);
  const [nodeFormValue, setNodeFormValue] = useState<Record<string, any>>({});
  const [nodeConfigs, setNodeConfigs] = useState<
    Record<string, Record<string, any>>
  >({});
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const formRef = useRef<any>(null);

  // 受控节点与边状态，使拖拽生效
  const [nodes, setNodes, onNodesChange] = useNodesState(data?.nodes ?? []);
  const [edges, setEdges, onEdgesChange] = useEdgesState(data?.edges ?? []);

  // 打开节点配置抽屉（提升到插入函数前，避免 use-before-define）
  function openConfigDrawer(node: any) {
    try {
      const schema = resolveNodeFormConfig(pm as any, node.data?.pluginNodeType);

      if (!schema) {
        message.warning(`节点 ${node.id} 暂无配置表单`);
        return;
      }

      setSelectedNode(node);
      setNodeFormSchema(schema.schema);
      const defaults: Record<string, any> = {};
      schema.schema.config?.forEach((field: any) => {
        if (field?.defaultValue !== undefined) {
          defaults[field.field] = field.defaultValue;
        }
      });
      const initVal = nodeConfigs[node.id] ?? {
        ...defaults,
        ...(initialValue?.[node.id] ?? {}),
      };
      setNodeFormValue(initVal);
      setDrawerOpen(true);
    } catch (e) {
      console.error(e);
      message.error('加载节点配置失败');
    }
  }

  const ops = React.useMemo(() => new FlowGraphOps({
    getNodes: () => nodes as any,
    setNodes: setNodes as any,
    getEdges: () => edges as any,
    setEdges: setEdges as any,
    getLabelByType: (pluginType: string) => {
      const list = pm.getAllPluginNodeTypes();
      const item = list.find((i: any) => i.value === pluginType);
      return item?.label ?? pluginType;
    },
    openConfigDrawer,
  }), [nodes, edges]);

  useEffect(() => {
    setNodes(data?.nodes ?? []);
    setEdges(data?.edges ?? []);
  }, [data?.nodes, data?.edges]);

  useEffect(() => {
    bindPluginsToUI(pm as any);
  }, []);

  useEffect(() => {
    if (!data?.nodes || data.nodes.length === 0) return;
    try {
      const initConfigs: Record<string, Record<string, any>> = {};
      data.nodes.forEach((node: any) => {
        const nodeId = node.id;
        const pluginNodeType = node.data?.pluginNodeType;
        const formConf = resolveNodeFormConfig(pm as any, pluginNodeType);
        const defaults: Record<string, any> = {};
        if (formConf?.schema?.config) {
          formConf.schema.config.forEach((field: any) => {
            if (field?.defaultValue !== undefined) {
              defaults[field.field] = field.defaultValue;
            }
          });
        }
        const fromProps = initialValue?.[nodeId] ?? {};
        initConfigs[nodeId] = { ...defaults, ...fromProps };
      });
      setNodeConfigs((prev) => {
        const merged: Record<string, Record<string, any>> = {};
        Object.keys(initConfigs).forEach((id) => {
          merged[id] = initConfigs[id];
        });
        Object.keys(prev).forEach((id) => {
          merged[id] = { ...initConfigs[id], ...prev[id] };
        });
        return merged;
      });
    } catch (e) {
      console.warn('初始化默认配置失败', e);
    }
  }, [data?.nodes, initialValue]);

  const updateNodeConfig = (nodeId: string, values: Record<string, any>) => {
    setNodeConfigs((prev) => ({ ...prev, [nodeId]: values }));
    onNodeConfigChange?.(nodeId, values);
  };

  const handleFormChange = (val: Record<string, any>) => {
    setNodeFormValue(val);
  };

  const handleFormSave = (vals: Record<string, any>) => {
    if (selectedNode?.id) {
      updateNodeConfig(selectedNode.id, vals);
      message.success('已保存当前节点配置');
    }
  };

  const handleFormValidateSave = (vals: Record<string, any>) => {
    if (selectedNode?.id) {
      updateNodeConfig(selectedNode.id, vals);
      message.success('校验通过并已保存');
      setDrawerOpen(false);
    }
  };

  const handleDrawerClose = async () => {
    const form = formRef.current?.form;
    if (!form || !selectedNode?.id) {
      setDrawerOpen(false);
      return;
    }

    const currentValues = form.getFieldsValue();
    const savedValues = nodeConfigs[selectedNode.id] ?? {};
    const isSame =
      JSON.stringify(savedValues) === JSON.stringify(currentValues);
    if (isSame) {
      setDrawerOpen(false);
      return;
    }

    Modal.confirm({
      title: '是否保存当前配置？',
      content: isValidate ? '保存前将进行校验。' : '不校验，直接保存当前值。',
      okText: '保存并关闭',
      cancelText: '不保存关闭',
      onOk: async () => {
        try {
          let values: Record<string, any>;
          if (isValidate) {
            values = await form.validateFields();
          } else {
            values = form.getFieldsValue();
          }
          updateNodeConfig(selectedNode.id, values);
          setDrawerOpen(false);
          message.success(
            isValidate ? '校验通过并已保存' : '已保存当前节点配置',
          );
        } catch (e) {
          message.error('校验失败, 请检查表单输入项');
        }
      },
      onCancel: () => {
        setDrawerOpen(false);
      },
    });
  };

  const handleSaveFlow = () => {
    setSaveModalOpen(true);
  };

  return (
    <div style={{ width: '100%', height: '100vh', position: 'relative', overflow: 'hidden' }} id="flow-box">
      <Space style={{ padding: 8 }}>
        <Button type="primary" onClick={handleSaveFlow}>
          保存流程
        </Button>
      </Space>
      <div style={{ height: 'calc(100vh - 64px)' }}>
        <ReactFlow
          nodes={ops.decorateNodes(nodes as any, ops.addNodeAfter)}
          edges={ops.decorateEdges(edges as any, ops.insertNodeOnEdge)}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          fitView
          selectionKeyCode={null} //禁用按住shift拖拽鼠标多选功能
          minZoom={0.5}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={(event, node) => {
            openConfigDrawer(node);
          }}
          isValidConnection={(edge) => {
            const { target, source } = edge;
            //不能自相连
            if (target === source) {
              return false;
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
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            }}
            pannable={true}
            zoomable={true}
            ariaLabel="小地图"
          />
          <Controls />
        </ReactFlow>
      </div>

      <Drawer
        open={drawerOpen}
        onClose={handleDrawerClose}
        width={420}
        title={
          selectedNode
            ? `${(selectedNode.data?.label ?? selectedNode.data?.name) ?? ''}（${selectedNode?.data?.pluginNodeType}）`
            : '节点配置'
        }
        rootStyle={{ position: 'absolute', zIndex: 9 }}
        getContainer={() =>
          document.getElementById('flow-box') || document.body
        }
        destroyOnHidden
      >
        {nodeFormSchema ? (
          <DynamicConfigForm
            key={selectedNode?.id}
            ref={formRef}
            schema={nodeFormSchema}
            value={nodeFormValue}
            isValidate={isValidate}
            showButtons={false}
            onChange={handleFormChange}
            onSave={handleFormSave}
            onValidateSave={handleFormValidateSave}
          />
        ) : (
          <div>该节点暂不支持配置</div>
        )}
      </Drawer>

      <Modal
        open={saveModalOpen}
        onCancel={() => setSaveModalOpen(false)}
        footer={[
          <Button key="close" onClick={() => setSaveModalOpen(false)}>
            关闭
          </Button>,
        ]}
        title="流程配置"
        width={600}
      >
        <pre style={{ maxHeight: 360, overflow: 'auto', margin: 0 }}>
          {JSON.stringify(nodeConfigs, null, 2)}
        </pre>
      </Modal>
    </div>
  );
};

export default FlowView;
