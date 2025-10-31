/*
 * @File: AddButton.tsx
 * @desc: 添加按钮
 * @author: heqinghua
 * @date: 2025年10月27日 14:05:42
 * @example: 调用示例
 */

import { Popover } from "antd";
import React, { useState, memo } from 'react'
import PluginList from "./PluginList";
import type { PluginNodeType } from '@plugin-flow-engine/type';

type AddButtonProps ={
    onAddNode: (pluginNodeType: PluginNodeType) => void;
    placement?: 'top' | 'left' | 'right' | 'bottom';
    getPopupContainer?: (triggerNode: HTMLElement) => HTMLElement;
    className?: string;
}

const defaultContainer = () => document.getElementById('flow-box') || document.body;

const AddButton: React.FC<AddButtonProps> = ({onAddNode, placement = 'right', getPopupContainer, className}) => {
  const [open, setOpen] = useState<boolean>(false);
  const handleListItemClick = (key: PluginNodeType) => {
    onAddNode(key);
    setOpen(false);
  }
  return (
    <Popover 
      trigger="click" 
      content={<PluginList onItemClick={handleListItemClick} />} 
      open={open} 
      onOpenChange={(open)=>{setOpen(open)}} 
      style={{ padding: 0 }} 
      placement={placement} 
      arrow={false} 
      zIndex={10000}
      getPopupContainer={getPopupContainer ?? defaultContainer}
    >
      <span className={['handle-plus', className].filter(Boolean).join(' ')} title="添加节点" aria-label="添加节点" onClick={(e) => { e.stopPropagation(); }}>+</span>
    </Popover>
  );
}
export default memo(AddButton);