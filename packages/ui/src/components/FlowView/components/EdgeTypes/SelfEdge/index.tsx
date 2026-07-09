import React from 'react';
import { BaseEdge, BezierEdge, EdgeLabelRenderer, type EdgeProps } from '@xyflow/react';

export default function SelfConnectingEdge(props: EdgeProps) {
  if (props.source !== props.target) {
    return <BezierEdge {...props} />;
  }

  const { sourceX, sourceY, targetX, targetY, id, markerEnd, data } = props;
  const radiusX = (sourceX - targetX) * 0.6;
  const radiusY = 50;
  const edgePath = `M ${sourceX - 5} ${sourceY} A ${radiusX} ${radiusY} 0 1 0 ${
    targetX + 2
  } ${targetY}`;

  const customData = data as Record<string, any>;
  const iterationCount = customData?.iteration_count || customData?.nodeConfig?.iteration_count || 1;
  const labelX = sourceX - 80;
  const labelY = sourceY - radiusY - 30;
  
  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} />
      <EdgeLabelRenderer>
        <div
          className="nodrag nopan"
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            background: '#52c41a',
            color: '#fff',
            padding: '3px 10px',
            borderRadius: 4,
            fontSize: 12,
            boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
            whiteSpace: 'nowrap',
          }}
        >
          x{iterationCount}
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
