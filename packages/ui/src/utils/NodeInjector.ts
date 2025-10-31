/*
 * @File: 
 * @desc: 注入器，仅负责注入 schema 与自定义控件
 * @author: heqinghua
 * @date: 2025年08月15日 09:10:48
 * @example: 调用示例
 */
import type { Schema } from '@plugin-flow-engine/type';
import React from 'react';
import defaultWidgets from '../widget/defaultWidget';
import { Input } from 'antd';

// 定义注入器接口
interface BaseInjector {
  injectNodeSchema(type: string, schema: Schema): void;
  injectWidget(type: string, widget: React.ElementType<any>): void;
  getNodeSchemas(): Record<string, Schema>;
  getWidgets(): Record<string, React.ElementType<any>>;
  subscribe(callback: () => void): () => void;
}

/**
 * 节点注入器，负责注入 schema 与自定义控件
 */
class NodeInjector implements BaseInjector {
  private nodeSchemas: Record<string, Schema> = {};
  private widgets: Record<string, React.ElementType<any>> = {};
  private subscribers: Array<() => void> = [];
  /**
   * 通知所有订阅者，数据已更新
   */
  private notifySubscribers(): void {
    this.subscribers.forEach(callback => callback());
  }
  /**
   * 注入节点 schema
   * @param type 节点类型
   * @param schema 节点 schema
   */
  constructor(
    initialSchemas: Record<string, Schema> = {},
    initialWidgets: Record<string, React.ElementType<any>> = {}
  ) {
    this.nodeSchemas = { ...initialSchemas };
    // 默认加载默认控件映射，并叠加外部自定义
    this.widgets = { ...defaultWidgets, ...initialWidgets };
  }
  /**
   * 注入节点 schema
   * @param type 节点类型
   * @param schema 节点 schema
   */
  injectNodeSchema(type: string, schema: Schema): void {
    this.nodeSchemas[type] = schema;
    this.notifySubscribers();
  }
  /**
   * 注入自定义控件
   * @param type 控件类型
   * @param widget 自定义控件组件
   */
  injectWidget(type: string, widget: React.ElementType<any>): void {
    this.widgets[type] = widget;
    this.notifySubscribers();
  }
  /**
   * 获取所有自定义控件
   * @returns 自定义控件映射
   */
  getNodeSchemas(): Record<string, Schema> {
    return { ...this.nodeSchemas };
  }
  /**
   * 获取所有自定义控件
   * @returns 自定义控件映射
   */
  getWidgets(): Record<string, React.ElementType<any>> {
    return { ...this.widgets };
  }
  /**
   * 订阅数据更新事件
   * @param callback 回调函数，数据更新时调用
   * @returns 取消订阅函数
   */
  subscribe(callback: () => void): () => void {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter(cb => cb !== callback);
    };
  }
}

let injector: NodeInjector | null = null;
// 一次性警告去重：在开发环境中仅对每个未命中的键提示一次
const warnedKeys = new Set<string>();

/**
 * 初始化注入器
 * @param initialSchemas 初始节点 schema 映射
 * @param initialWidgets 初始自定义控件映射
 * @returns 节点注入器实例
 */
export function initializeInjector(
  initialSchemas: Record<string, Schema> = {},
  initialWidgets: Record<string, React.ElementType<any>> = {}
): NodeInjector {
  if (!injector) {
    injector = new NodeInjector(initialSchemas, initialWidgets);
  }
  return injector;
}

/**
 * 获取注入器实例（懒加载初始化）
 * @returns 节点注入器实例
 */
export function getInjector(): NodeInjector {
  if (!injector) {
    // 懒加载默认初始化，避免外部必须显式调用 initializeInjector
    initializeInjector();
  }
  return injector as NodeInjector;
}

/**
 * 注入节点 schema
 * @param type 节点类型
 * @param schema 节点 schema
 */
export function injectNodeSchema(type: string, schema: Schema): void {
  getInjector().injectNodeSchema(type, schema);
}

/**
 * 注入自定义控件
 * @param type 控件类型
 * @param widget 自定义控件组件
 */
export function injectWidget(type: string, widget: React.ElementType<any>): void {
  getInjector().injectWidget(type, widget);
}

/**
 * 获取所有节点 schema
 * @returns 节点 schema 映射
 */
export function getNodeSchemas(): Record<string, Schema> {
  return getInjector().getNodeSchemas();
}

/**
 * 获取所有自定义控件
 * @returns 自定义控件映射
 */
export function getWidgets(): Record<string, React.ElementType<any>> {
  return getInjector().getWidgets();
}

/**
 * 集中式控件查找：根据优先级选择渲染控件
 * 优先级：widget 指定键 > type 键 > ant_Input 兜底 > 简单 Input
 */
export function getWidgetByType(type: string, widget?: string): React.ElementType<any> {
  const injectedWidgets = getInjector().getWidgets();
  // 首选显式 widget 键，否则使用 type
  const rawKey = widget || type;



  const candidates = [
    rawKey,
  ].filter(Boolean) as string[];

  for (const key of candidates) {
    if (injectedWidgets[key]) return injectedWidgets[key];
  }

  // 开发期警告：未找到指定控件键
  const warnKey = candidates[0] || rawKey;
  if (process.env.NODE_ENV !== 'production' && !warnedKeys.has(warnKey)) {
    const source = widget ? `widget:"${widget}"` : `type:"${type}"`;
    console.warn(`[Widgets] 未找到控件映射: ${source}（尝试: ${candidates.join(', ')}），将回退到 ant_Input 或 Input`);
    warnedKeys.add(warnKey);
  }
  if (injectedWidgets['ant_Input']) return injectedWidgets['ant_Input'];
  const FallbackInput: React.ElementType<any> = (props: any) => {
    const { value, onChange, ...rest } = props || {};
    return React.createElement(Input as any, {
      value,
      onChange: (e: any) => onChange && onChange(e?.target?.value),
      ...rest,
    });
  };
  return FallbackInput;
}
