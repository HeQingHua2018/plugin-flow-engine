/*
 * @File: 
 * @desc: 
 * @author: heqinghua
 * @date: 2025年10月27日 14:00:02
 * @example: 调用示例
 */

import BasicEdge from './BasicEdge';
import SelfEdge from './SelfEdge';
import type { EdgeTypes } from '@xyflow/react';



const edgeTypes:EdgeTypes = {
  'basic_edge': BasicEdge,
  'self_edge': SelfEdge,
}

export default edgeTypes;