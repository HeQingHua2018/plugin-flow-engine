/*
 * @File: index.ts
 * @desc: 管理器类，提供组件实例和上下文实例的管理功能
 * @author: heqinghua
 * @date: 2025年11月07日 09:53:27
 * @example: 调用示例
 */

// 导出组件管理器
export {
  ComponentManager,
  createComponentManager,
  createDefaultComponentManager,
  getGlobalComponentManager,
  resetGlobalComponentManager,
} from './ComponentManager';
export type {
  InstanceRegistration,
  GlobalMethodRegistration,
  ComponentInstance,
  ComponentMethod,
  RefObject,
} from './ComponentManager';

// 导出上下文管理器
export * from './ContextManager';
export type {
  ContextSnapshot,
  TransactionSnapshot,
  TransactionStatus,
  TransactionInfo,
} from './ContextManager';
