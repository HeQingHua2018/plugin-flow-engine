/*
 * @File: FlowView.tsx
 * @desc: 流程视图组件（库版本） - 通过 props 输入节点与边数据
 */
import { Controls, ReactFlow } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Button, Drawer, message, Modal, Space } from 'antd';
import { DynamicConfigForm, PluginManagerInstance } from 'plugin-flow-engine';
import React, { useRef, useState, useEffect } from 'react';
import type { FlowData } from './type.d';

export interface FlowViewProps {
  /**
   * 流程数据（节点与边）
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
  // 使用单例实例
  const pm = PluginManagerInstance();
  // 收集所有注册的节点类型（可用于自定义节点渲染）
  const nodeTypes = pm.getAllNodeTypes();
  console.log(nodeTypes);
  // 右侧抽屉开关与当前选中节点
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedNode, setSelectedNode] = useState<any>(null);
  // 动态表单的渲染 schema 与表单值
  const [nodeFormSchema, setNodeFormSchema] = useState<any>(null);
  const [nodeFormValue, setNodeFormValue] = useState<Record<string, any>>({});
  // 本地存储每个节点的配置：key 为节点 id
  const [nodeConfigs, setNodeConfigs] = useState<
    Record<string, Record<string, any>>
  >({});
  // “保存流程”弹窗的开关
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  // 表单实例引用：用于取值或校验
  const formRef = useRef<any>(null);

  // 初始化每个节点的默认配置（defaultValue）并与 initialValue 合并
  useEffect(() => {
    if (!data?.nodes || data.nodes.length === 0) return;
    try {
      const initConfigs: Record<string, Record<string, any>> = {};
      data.nodes.forEach((node: any) => {
        const nodeId = node.id;
        const nodeType = node.data?.nodeType;
        const formConf = pm.getNodeFormConfig(nodeType);
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
      // 不覆盖已有的用户编辑值，已有值优先生效
      setNodeConfigs((prev) => {
        const merged: Record<string, Record<string, any>> = {};
        // 先放入初始化值
        Object.keys(initConfigs).forEach((id) => {
          merged[id] = initConfigs[id];
        });
        // 再叠加已有值（已有值覆盖初始化值）
        Object.keys(prev).forEach((id) => {
          merged[id] = { ...initConfigs[id], ...prev[id] };
        });
        return merged;
      });
    } catch (e) {
      // 初始化失败时忽略，保持空对象
      console.warn('初始化默认配置失败', e);
    }
  }, [data?.nodes, initialValue]);

  // 更新指定节点的配置（同时更新本地缓存并向外抛出）
  const updateNodeConfig = (nodeId: string, values: Record<string, any>) => {
    setNodeConfigs((prev) => ({ ...prev, [nodeId]: values }));
    onNodeConfigChange?.(nodeId, values);
  };

  /**
   * 打开节点配置抽屉：
   * - 从插件管理器获取表单 schema
   * - 初始值按“本地缓存 > props.initialValue(nodeId) > schema.defaultValue > 空对象”的优先级
   */
  const openConfigDrawer = (node: any) => {
    try {
      // 在渲染表单时获取 schema
      const schema = pm.getNodeFormConfig(node.data?.nodeType);

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
      // 初始值来源优先级：本地缓存 > props.initialValue[node.id] > schema.defaultValue > {}
      const initVal = nodeConfigs[node.id] ?? { ...defaults, ...(initialValue?.[node.id] ?? {}) };
      setNodeFormValue(initVal);
      setDrawerOpen(true);
    } catch (e) {
      console.error(e);
      message.error('加载节点配置失败');
    }
  };

  const handleFormChange = (val: Record<string, any>) => {
    // 仅更新本地表单值，不持久化到 nodeConfigs
    setNodeFormValue(val);
    // 如需实时外抛变更，可在此调用 onNodeConfigChange（当前需求要求取消关闭不保存）
    // if (selectedNode?.id) {
    //   onNodeConfigChange?.(selectedNode.id, val);
    // }
  };

  // 自定义按钮：仅保存当前节点配置
  const handleFormSave = (vals: Record<string, any>) => {
    if (selectedNode?.id) {
      updateNodeConfig(selectedNode.id, vals);
      message.success('已保存当前节点配置');
    }
  };

  // 自定义按钮：校验并保存后关闭抽屉
  const handleFormValidateSave = (vals: Record<string, any>) => {
    if (selectedNode?.id) {
      updateNodeConfig(selectedNode.id, vals);
      message.success('校验通过并已保存');
      setDrawerOpen(false);
    }
  };

  /**
   * 关闭抽屉：
   * - 弹窗确认保存
   * - 根据 `isValidate` 决定是否进行校验
   * - 成功后保存当前节点配置并关闭抽屉
   * - 校验失败时保留抽屉
   */
  const handleDrawerClose = async () => {
    const form = formRef.current?.form;
    // 若没有表单或未选中节点，直接关闭
    if (!form || !selectedNode?.id) {
      setDrawerOpen(false);
      return;
    }

    // 当没有修改时，直接关闭不弹确认框
    const currentValues = form.getFieldsValue();
    const savedValues = nodeConfigs[selectedNode.id] ?? {};
    const isSame = JSON.stringify(savedValues) === JSON.stringify(currentValues);
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
          message.success(isValidate ? '校验通过并已保存' : '已保存当前节点配置');
        } catch (e) {
          message.error('校验失败, 请检查表单输入项');
          // 不关闭抽屉
        }
      },
      onCancel: () => {
        // 不保存，直接关闭
        setDrawerOpen(false);
      },
    });
  };

  // 打开“保存流程”弹窗，预览所有节点配置
  const handleSaveFlow = () => {
    setSaveModalOpen(true);
  };

  return (
    <div style={{ width: '100%', height: '600px', border: '1px solid #ccc' }}>
      <Space style={{ padding: 8 }}>
        <Button type="primary" onClick={handleSaveFlow}>
          保存流程
        </Button>
      </Space>

      <ReactFlow
        nodes={data.nodes}
        edges={data.edges}
        onNodeClick={(event, node) => {
          openConfigDrawer(node);
        }}
        fitView
      >
        <Controls />
      </ReactFlow>

      <Drawer
        open={drawerOpen}
        onClose={handleDrawerClose}
        width={420}
        title={
          selectedNode
            ? `${selectedNode.data?.label}（${selectedNode?.data?.nodeType}）`
            : '节点配置'
        }
        destroyOnClose
      >
        {nodeFormSchema ? (
          <DynamicConfigForm
            key={selectedNode?.id}
            ref={formRef}
            schema={nodeFormSchema}
            value={nodeFormValue}
            isValidate={isValidate}
            showButtons={false}
            // renderButton={() => (
            //   <Button
            //     type="primary"
            //     onClick={async () => {
            //       const form = formRef.current?.form;
            //       if (!form) return;
            //       try {
            //         const values = await form.validateFields();
            //         console.log('校验通过，值：', values);
            //       } catch {
            //         console.warn('校验失败');
            //       }
            //     }}
            //   >
            //     自定义校验并保存
            //   </Button>
            // )}
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
