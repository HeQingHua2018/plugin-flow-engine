/*
 * @File: events.ts
 * @desc: 业务组件事件元数据 + 全局事件池类型定义
 */

/**
 * 组件单个事件定义
 */
export interface ComponentEventMeta {
  /** 事件名称，如 "onClick"、"onSubmit" */
  eventName: string;
  /** 事件参数描述 { paramName: description } */
  params?: Record<string, string>;
  /** 事件说明 */
  description?: string;
}

/**
 * 组件单个方法定义
 */
export interface ComponentMethodMeta {
  /** 方法名，如 "setValue"、"validate" */
  methodName: string;
  /** 方法参数描述 { paramName: description } */
  params?: Record<string, string>;
  /** 返回值描述 */
  returnType?: string;
  /** 方法说明 */
  description?: string;
}

/**
 * 业务组件元数据标准格式
 */
export interface ComponentMeta {
  /** 组件唯一标识名，如 "MyButton"、"UserForm" */
  componentName: string;
  /** 展示名称 */
  displayName?: string;
  /** 组件描述 */
  description?: string;
  /** 事件列表 */
  events: ComponentEventMeta[];
  /** 方法列表（可选） */
  methods?: ComponentMethodMeta[];
  /** 组件类别，用于分组 */
  category?: string;
  /** 组件图标的名称或 URL */
  icon?: string;
}

/**
 * 注册的组件实例信息（运行时）
 */
export interface RegisteredComponent {
  /** 组件元数据 */
  meta: ComponentMeta;
  /** 组件实例引用 */
  ref?: React.RefObject<any>;
  /** 注册时间戳 */
  registeredAt: number;
}
