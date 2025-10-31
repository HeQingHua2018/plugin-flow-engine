/*
 * @File: 
 * @desc: 
 * @author: heqinghua
 * @date: 2025年10月21日 11:42:11
 * @example: 调用示例
 */

import { flowData } from "./data";
import { FlowView } from '@plugin-flow-engine/ui';

import React from 'react'

const basic: React.FC = () => {
  return (
    <FlowView
      data={flowData}
      // 按节点ID提供初始配置
      initialValue={{
        'trigger': { api_key: ["key1"] },
        'show_email_node': { api_key: ["key1", "key2"] },
      }}
      onNodeConfigChange={(nodeId, values) => {
        console.log('配置变化', nodeId, values);
      }}
    />
  )
}


export default basic;