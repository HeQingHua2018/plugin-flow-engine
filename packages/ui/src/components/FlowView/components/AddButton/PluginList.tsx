/*
 * @File: 
 * @desc: 
 * @author: heqinghua
 * @date: 2025年10月27日 14:09:46
 * @example: 调用示例
 */

import { type PluginNodeType } from '@plugin-flow-engine/type';
import { PluginManagerInstance } from '@plugin-flow-engine/core';
import React from 'react'

type PluginListProps = {
  onItemClick: (key: PluginNodeType) => void;
}

const PluginList: React.FC<PluginListProps> = ({ onItemClick }) => {
  const pm = PluginManagerInstance();
  const nodeTypeSelect = pm.getAllPluginNodeTypes();
  return (
    <div style={{ minWidth: 160 }}>
      {nodeTypeSelect.map((item) => (
        <div 
          key={item.value} 
          onClick={() => onItemClick(item.value)}
          style={{ padding: '6px 8px', cursor: 'pointer' }}
        >
          {item.label}
        </div>
      ))}
    </div>
  )
}

export default PluginList
