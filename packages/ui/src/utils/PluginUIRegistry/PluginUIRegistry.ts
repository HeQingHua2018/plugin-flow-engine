/*
 * @File: PluginUIRegistry.ts
 * @desc: UI 注册器，负责在 UI 层管理插件的表单 schema 与控件映射
 * 实现核心与UI的完全解耦，插件不再内置UI配置
 */
import type { NodeConfig, Schema, PluginNodeType } from '../../types';
import { injectWidget, getWidgets } from '../FormWidgetInjector';
import React from 'react';

// 存储节点类型到UI配置的映射
const nodeUIConfigs: Map<PluginNodeType | string, NodeConfig> = new Map();

/**
 * 注册控件映射
 * @param type 控件映射键
 * @param component React 组件
 */
export function registerWidget(type: string, component: React.ElementType<any>) {
  injectWidget(type, component);
  return type;
}

/**
 * 注册节点 schema
 * @param pluginNodeType 插件节点类型
 * @param schema 节点 schema
 */
export function registerNodeSchema(pluginNodeType: string | PluginNodeType, schema: Schema) {
  const existing = nodeUIConfigs.get(String(pluginNodeType)) || {};
  nodeUIConfigs.set(String(pluginNodeType), { ...existing, schema });
  return String(pluginNodeType);
}

/**
 * 注册插件 UI 元数据（支持批量控件与 schema）
 * @param pluginNodeType 插件节点类型
 * @param ui 插件提供的 UI 元数据
 */
export function registerPluginUI(pluginNodeType: PluginNodeType | string, ui: NodeConfig) {
  if (ui?.schema) {
    registerNodeSchema(pluginNodeType, ui.schema);
  }
  if (ui?.widgets) {
    Object.entries(ui.widgets).forEach(([key, comp]) => {
      registerWidget(key, comp as React.ElementType<any>);
    });
  }
  nodeUIConfigs.set(pluginNodeType, { ...nodeUIConfigs.get(pluginNodeType), ...ui });
  return pluginNodeType;
}

/**
 * 绑定特定插件到 UI 层
 * 手动为特定节点类型绑定UI配置
 * @param pluginNodeType 插件节点类型
 * @param uiConfig UI配置对象
 */
export function bindPluginUI(pluginNodeType: PluginNodeType | string, uiConfig: NodeConfig) {
  return registerPluginUI(pluginNodeType, uiConfig);
}

/**
 * 获取已注册的所有节点UI配置
 * @returns 节点类型到UI配置的映射
 */
export function getAllNodeUIConfigs(): Record<string, NodeConfig> {
  const result: Record<string, NodeConfig> = {};
  nodeUIConfigs.forEach((config, type) => {
    result[String(type)] = config;
  });
  return result;
}

/**
 * 获取特定节点类型的UI配置
 * @param pluginNodeType 插件节点类型
 * @returns UI配置对象或undefined
 */
export function getNodeUIConfig(pluginNodeType: PluginNodeType | string): NodeConfig | undefined {
  return nodeUIConfigs.get(pluginNodeType);
}

/**
 * 检查节点类型是否已注册UI配置
 * @param pluginNodeType 插件节点类型
 * @returns 是否已注册
 */
export function hasNodeUIConfig(pluginNodeType: PluginNodeType | string): boolean {
  return nodeUIConfigs.has(pluginNodeType);
}

/**
 * 移除节点类型的UI配置
 * @param pluginNodeType 插件节点类型
 * @returns 是否成功移除
 */
export function removeNodeUIConfig(pluginNodeType: PluginNodeType | string): boolean {
  return nodeUIConfigs.delete(pluginNodeType);
}

/**
 * 解析节点的最终表单配置（仅使用UI层注册的配置）
 * @param pluginNodeType 插件节点类型
 * @returns `{ schema?: Schema, widgets?: Record<string, any> }` 或null
 */
export function resolveNodeFormConfig(pluginNodeType: PluginNodeType | string): NodeConfig | null {
  const config = nodeUIConfigs.get(pluginNodeType);
  if (config) {
    return {
      schema: config.schema,
      widgets: config.widgets || {}
    };
  }
  
  return null;
}

/**
 * 批量注册多个插件UI配置
 * @param configs 节点类型到UI配置的映射
 */
export function registerMultiplePluginUI(configs: Record<PluginNodeType | string, NodeConfig>): void {
  Object.entries(configs).forEach(([pluginNodeType, uiConfig]) => {
    registerPluginUI(pluginNodeType, uiConfig);
  });
}

/**
 * 创建UI配置的帮助函数
 * @param schema 表单schema
 * @param widgets 可选的控件映射
 * @returns 完整的NodeConfig对象
 */
export function createNodeConfig(schema: Schema, widgets?: Record<string, React.ElementType<any>>): NodeConfig {
  const config: NodeConfig = { schema };
  if (widgets) {
    config.widgets = widgets;
  }
  return config;
}