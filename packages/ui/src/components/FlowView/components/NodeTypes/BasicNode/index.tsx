/* eslint-disable react-hooks/rules-of-hooks */
/*
 * @File: 
 * @desc: 
 * @author: heqinghua
 * @date: 2025年10月24日 11:29:29
 * @example: 调用示例
 */
import { Handle, Position } from '@xyflow/react';


import React from 'react'
import '../../index.less'
import type { NodePropsBase } from '../type';
import AddButton from '../../AddButton';



const BasicNode: React.FC<NodePropsBase> = ({data,isConnectable}) => {
  console.log(data)
  return (
    <div className="custom-node" >
      {
        data.pluginNodeType !== 'Trigger'  &&
        <Handle type="target" position={Position.Left} isConnectable={isConnectable} className='custom-node-handle custom-node-handle-target'>
        </Handle>
      }
      <div>{data.label ?? data.name}</div>
      {
        data?.pluginNodeType !== 'End'  &&
        <Handle type="source" position={Position.Right} isConnectable={isConnectable} className='custom-node-handle custom-node-handle-source' onClick={(e) => { e.stopPropagation(); }} >
       <AddButton 
         onAddNode={(pluginNodeType) => {
           (data as any)?.onAddNode?.(pluginNodeType);
         }}
         getPopupContainer={() => document.getElementById('flow-box') || document.body}
       />
      </Handle>
      }
    </div>
  )
}
export default React.memo(BasicNode);
