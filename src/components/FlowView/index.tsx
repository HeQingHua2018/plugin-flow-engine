/*
 * @File: FlowView.tsx
 * @desc: 流程视图组件（库版本） - 通过 props 输入节点与边数据
 */
import React, { useCallback, useState } from 'react';
import { ReactFlow, applyNodeChanges, applyEdgeChanges, addEdge, Controls } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Drawer, message } from 'antd';
import { PluginManagerInstance, DynamicConfigForm } from 'plugin-flow-engine';


export interface FlowViewProps {
  initialNodes: any[];
  initialEdges: any[];
  getNodeConfig?: (nodeId: string) => Record<string, any> | undefined;
  onNodeConfigChange?: (nodeId: string, formValues: Record<string, any>) => void;
}

const FlowView: React.FC<FlowViewProps> = ({ initialNodes, initialEdges, getNodeConfig, onNodeConfigChange }) => {
  // 使用单例实例
  const pm = PluginManagerInstance();
  const nodeTypes = pm.getAllNodeTypes();
  console.log(nodeTypes)
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);

  // 右侧抽屉：动态配置表单
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [nodeFormSchema, setNodeFormSchema] = useState<any>(null);
  const [nodeFormValue, setNodeFormValue] = useState<Record<string, any>>({});
  const onNodesChange = useCallback(
    (changes: any) => setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
    [],
  );
  const onEdgesChange = useCallback(
    (changes: any) => setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
    [],
  );
  const onConnect = useCallback(
    (params: any) => setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
    [],
  );


  const openConfigDrawer = (node: any) => {
    try {
      // 在渲染表单时获取 schema
      // const schema = PluginManager.getInstance().getNodeFormConfig(node.data?.nodeType);
      // 改为单例
      const schema = pm.getNodeFormConfig(node.data?.nodeType);

      if (!schema) {
        message.warning(`节点 ${node.id} 暂无配置表单`);
        return;
      }

      setSelectedNode(node);
      setNodeFormSchema(schema.schema);
      const initialValue = getNodeConfig?.(node.id) || {};
      setNodeFormValue(initialValue);
      setDrawerOpen(true);
    } catch (e) {
      console.error(e);
      message.error('加载节点配置失败');
    }
  };

  const handleFormChange = (val: Record<string, any>) => {
    setNodeFormValue(val);
    if (selectedNode?.id) {
      onNodeConfigChange?.(selectedNode.id, val);
    }
  };

  return (
    <div style={{ width: '100%', height: '600px', border: '1px solid #ccc' }}>
      <ReactFlow
        style={{ width: '100%', height: '100%' }}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={(event, node) => {
          openConfigDrawer(node);
        }}
        fitView
      >
        <Controls />
      </ReactFlow>

      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        width={420}
        title={selectedNode ? `${selectedNode.data?.label}（${selectedNode?.data?.nodeType}）` : '节点配置'}
      >
        {nodeFormSchema ? (
          <DynamicConfigForm
            schema={nodeFormSchema}
            value={nodeFormValue}
            onChange={handleFormChange}
          />
        ) : (
          <div>该节点暂不支持配置</div>
        )}
      </Drawer>
    </div>
  );
};

export default FlowView;
