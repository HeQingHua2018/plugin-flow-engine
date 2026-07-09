/*
 * @File: 
 * @desc: 
 * @author: heqinghua
 * @date: 2025年10月27日 14:09:46
 * @example: 调用示例
 */

import type { PluginNodeType } from '../../../../types';
import { getAllPluginNodeTypes } from '../../utils/NodeTypeUtils';
import React from 'react'

type PluginListProps = {
  onItemClick: (key: PluginNodeType) => void;
}

const PluginList: React.FC<PluginListProps> = ({ onItemClick }) => {
  const nodeTypeSelect = getAllPluginNodeTypes();
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
