/*
 * @File: 
 * @desc: 
 * @author: heqinghua
 * @date: 2025年10月27日 14:00:29
 * @example: 调用示例
 */
import React, { memo } from 'react';
import { getBezierPath, EdgeLabelRenderer, BaseEdge, EdgeProps } from '@xyflow/react';
import AddButton from '../../AddButton';
import '../../index.less'
 
const BasicEdge: React.FC<EdgeProps> = ({ id, selected, ...props }) => {
  const [edgePath, labelX, labelY] = getBezierPath(props);
 
  return (
    <>
      <BaseEdge id={id} path={edgePath} markerEnd={props.markerEnd} />
      <EdgeLabelRenderer>
        {selected && (
          <div
            className="nodrag nopan"
            style={{
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              pointerEvents: 'all',
            }}
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <AddButton
              onAddNode={(pluginNodeType) => {
                (props.data as any)?.onAddNode?.(pluginNodeType);
              }}
              getPopupContainer={() =>
                document.getElementById('flow-box') || document.body
              }
            />
          </div>
        )}
      </EdgeLabelRenderer>
    </>
  );
};
 
export default memo(BasicEdge);