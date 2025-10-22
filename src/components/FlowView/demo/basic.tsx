/*
 * @File: 
 * @desc: 
 * @author: heqinghua
 * @date: 2025年10月21日 11:42:11
 * @example: 调用示例
 */

import { initialNodes, initialEdges } from "./data";
import { FlowView } from 'plugin-flow-engine';

import React from 'react'

const basic: React.FC = () => {
  return (
    <FlowView
      initialNodes={initialNodes}
      initialEdges={initialEdges}
      getNodeConfig={(nodeId) => {
        console.log('获取节点配置', nodeId);
        return {};
      }}
      onNodeConfigChange={(nodeId, values) => {
        console.log('配置变化', nodeId, values);
      }}
    />
  )
}


export default basic;