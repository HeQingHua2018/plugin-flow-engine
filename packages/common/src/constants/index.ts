/*
 * @File: 
 * @desc: 公共常量定义
 * @author: heqinghua
 * @date: 2025年11月11日 15:29:31
 * @example: 调用示例
 */
// --- 内置插件节点类型常量 ---
export const BuiltInPluginNodeTypes = {
  Trigger: 'Trigger',
  Action: 'Action',
  Branch: 'Branch',
  Parallel: 'Parallel',
  Iteration: 'Iteration',
  Merge: 'Merge',
  End: 'End',
} as const;
// 节点状态枚举
export enum NodeStatus {
  PENDING = 'pending', // 待执行状态
  WAITING = 'waiting', // 等待状态
  RUNNING = 'running', // 运行中状态
  SUCCESS = 'success', // 成功状态
  FAILED = 'failed', // 失败状态
}

// 边来源类型枚举
export enum EdgeType {
  INCOMING = 'in', // 所有入边
  OUTGOING = 'out', // 所有出边
  ALL = 'all', // 所有边（包括入边和出边）
}

// 并行策略枚举
export enum ParallelStrategy {
  ALL = 'all', // 所有子节点都成功才算成功
  ANY = 'any', // 任意子节点成功就算成功
}

// 迭代模式枚举
export enum IterationMode {
  ALL_SUCCESS = 1, // 所有子节点成功才算成功
  ANY_SUCCESS = 2, // 任意子节点成功就算成功
  ANY_FAILURE = 3, // 任意子节点失败就算失败
}

