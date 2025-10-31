/*
 * @File: PluginUIRegistry.ts
 * @desc: UI 注册器，负责在 UI 层绑定/覆写插件的表单 schema 与控件映射
 */
import type { NodeConfig, Schema, PluginNodeType } from '@plugin-flow-engine/type';
import { injectNodeSchema, injectWidget, getNodeSchemas } from './NodeInjector';
import type { PluginManager } from '@plugin-flow-engine/core';

/**
 * 注册控件映射
 * @param type 控件映射键
 * @param component React 组件
 */
export function registerWidget(type: string, component: React.ElementType<any>) {
  injectWidget(type, component);
}

/**
 * 注册节点 schema
 * @param nodeType 节点类型
 * @param schema 节点 schema
 */
export function registerNodeSchema(nodeType: string, schema: Schema) {
  injectNodeSchema(nodeType, schema);
}

/**
 * 注册插件 UI 元数据（支持批量控件与 schema）
 * @param nodeType 插件节点类型
 * @param ui 插件提供的 UI 元数据
 */
export function registerPluginUI(nodeType: PluginNodeType | string, ui: NodeConfig) {
  if (ui?.schema) {
    injectNodeSchema(String(nodeType), ui.schema);
  }
  if (ui?.widgets) {
    Object.entries(ui.widgets).forEach(([key, comp]) => {
      injectWidget(key, comp as React.ElementType<any>);
    });
  }
}

/**
 * 批量绑定所有插件到 UI 层
 * 从插件管理器读取每个插件的 UI 元数据，并统一注册到注入器
 */
export function bindPluginsToUI(pm: PluginManager) {
  const plugins = pm.getAllPlugins();
  const injectedSchemas = getNodeSchemas();
  plugins.forEach((plugin) => {
    const cfg = plugin.getNodeFormConfig?.();
    if (!cfg) return;
    const nodeTypeKey = String(plugin.pluginNodeType);

    // 优先保留手动注册的 schema；仅在未注入时回填插件默认 schema
    if (!injectedSchemas[nodeTypeKey] && cfg.schema) {
      injectNodeSchema(nodeTypeKey, cfg.schema);
    }

    // widgets 始终注入（包含覆盖与补充）
    if (cfg.widgets) {
      Object.entries(cfg.widgets).forEach(([key, comp]) => {
        injectWidget(key, comp as React.ElementType<any>);
      });
    }
  });
}

/**
 * 解析节点的最终表单配置（UI 层优先 → 插件默认作为回退）
 * @param pm 插件管理器实例
 * @param nodeType 节点类型
 * @returns `{ schema?: Schema, widgets?: Record<string, any }`
 */
export function resolveNodeFormConfig(pm: PluginManager, nodeType: PluginNodeType) {
  const injectedSchemas = getNodeSchemas();
  const injected = injectedSchemas[nodeType as string];

  const plugin = pm.getPlugin(nodeType);
  const pluginCfg = plugin.getNodeFormConfig?.();

  // 确保插件提供的 widgets 被注入（避免未获取到对应 widgets 的情况）
  if (pluginCfg?.widgets) {
    Object.entries(pluginCfg.widgets).forEach(([key, comp]) => {
      injectWidget(key, comp as React.ElementType<any>);
    });
  }

  if (injected) {
    if (pluginCfg?.widgets) {
      return { schema: injected, widgets: pluginCfg.widgets };
    }
    return { schema: injected };
  }
  return pluginCfg;
}