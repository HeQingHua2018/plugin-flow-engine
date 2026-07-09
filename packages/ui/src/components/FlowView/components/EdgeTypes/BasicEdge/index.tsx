import React, { memo, useState, useMemo } from 'react';
import { getBezierPath, EdgeLabelRenderer, BaseEdge, EdgeProps } from '@xyflow/react';
import AddButton from '../../AddButton';
import { getRuleDesc, transformFromEngineConditions } from '../../../../RuleEditor/rule_utils/utils';

const BasicEdge: React.FC<EdgeProps> = ({ id, selected, data, sourceX, sourceY, targetX, targetY, ...props }) => {
  const [hovered, setHovered] = useState(false);
  const [edgePath, labelX, labelY] = getBezierPath({ ...props, sourceX, sourceY, targetX, targetY });

  const showAdd = selected || hovered;
  const customData = data as Record<string, any>;

  const edgeLabel = useMemo(() => {
    if (customData?.label) {
      return customData.label;
    }
    if (customData?.conditions && customData?.availableFacts) {
      try {
        const ruleData = transformFromEngineConditions(customData.conditions, customData.availableFacts);
        const desc = getRuleDesc(ruleData, customData.availableFacts);
        return desc !== '暂无规则' ? desc : '';
      } catch (e) {
        console.error('解析边条件失败:', e);
        return '';
      }
    }
    return '';
  }, [customData]);

  const labelRotation = useMemo(() => {
    const dx = (targetX || 0) - (sourceX || 0);
    const dy = (targetY || 0) - (sourceY || 0);
    return Math.atan2(dy, dx) * (180 / Math.PI);
  }, [sourceX, sourceY, targetX, targetY]);

  const handleLabelClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    customData?.onEdgeClick?.();
  };

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        markerEnd={props.markerEnd}
        style={{ 
          ...props.style, 
          cursor: 'pointer',
          stroke: selected ? '#1890ff' : props.style?.stroke || '#888',
          strokeWidth: selected ? 2 : props.style?.strokeWidth || 1.5,
        }}
      />
      <EdgeLabelRenderer>
        {edgeLabel && (
          <div
            className="nodrag nopan"
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY - 10}px) rotate(${labelRotation}deg)`,
              background: '#fff',
              color: '#333',
              padding: '3px 10px',
              borderRadius: 4,
              fontSize: 12,
              boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
              whiteSpace: 'nowrap',
              cursor: customData?.onEdgeClick ? 'pointer' : 'default',
              transition: 'all 0.2s',
            }}
            onClick={handleLabelClick}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            {edgeLabel}
          </div>
        )}

        {showAdd && (
          <div
            className="nodrag nopan"
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              pointerEvents: 'all',
              zIndex: 1000,
            }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            <AddButton
              onAddNode={(pluginNodeType) => {
                customData?.onAddNode?.(pluginNodeType);
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