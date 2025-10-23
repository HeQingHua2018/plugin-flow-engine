/*
 * @File: 
 * @desc: 
 * @author: heqinghua
 * @date: 2025年10月21日 11:36:56
 * @example: 调用示例
 */


const flowData = {
  nodes: [
    { id: 'trigger', type: 'input', position: { x: 0, y: 0 }, data: { label: '触发节点', nodeType: 'Trigger' } },
  { id: 'show_email_node', type: 'output', position: { x: 0, y: 120 }, data: { label: '显示邮箱节点', nodeType: 'Action' } },
  ],
  edges: [
    { id: 'e1-2', source: 'trigger', target: 'show_email_node' },
  ],
}

export {
  flowData
}