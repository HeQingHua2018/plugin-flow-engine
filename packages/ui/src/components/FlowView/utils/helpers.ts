/*
 * @File: helpers.ts
 * @desc: 通用工具函数
 */

import PerformanceMonitor from './PerformanceMonitor';
import type { PluginNodeType } from '../../../types';
import { debounce, throttle } from 'lodash';
import { normalizeConfigFormValues, prepareConfigFormValues } from '../../DynamicConfigForm/helpers';

// ============================================================================
// 范围转换 helper
// ============================================================================

export { debounce, throttle };

// ============================================================================
// 合并节点默认配置
// ============================================================================

export function mergeNodeDefaultConfigs(
  nodes: any[],
  nodeConfigs: Record<PluginNodeType, any> | undefined,
): any[] {
  if (!nodeConfigs) return nodes;

  return nodes.map((node: any) => {
    const type = node.data?.pluginNodeType;
    const config = nodeConfigs[type];
    if (!config) return node;

    const defaults: Record<string, any> = {};
    config?.schema?.config?.forEach((field: any) => {
      if (field?.defaultValue !== undefined) {
        if (node.data?.config?.[field.field] === undefined) {
          defaults[field.field] = field.defaultValue;
        }
      }
    });

    if (Object.keys(defaults).length === 0) return node;
    return {
      ...node,
      data: {
        ...node.data,
        config: { ...defaults, ...(node.data?.config ?? {}) },
      },
    };
  });
}

// ============================================================================
// 画布交互
// ============================================================================

export function onPaneMouseMove(e: React.MouseEvent) {
  PerformanceMonitor.recordPan(e.clientX, e.clientY);
}

export function onPaneMouseUp() {
  PerformanceMonitor.recordDragEnd();
}

export { normalizeConfigFormValues, prepareConfigFormValues };
