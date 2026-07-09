import { getGlobalPluginManager } from '@chloehe/logic-engine-core';
import type { PluginNodeType } from '../types';

/**
 * 获取所有插件节点类型
 * @returns 插件节点类型列表
 */
export const getAllPluginNodeTypes = () => {
  const pm = getGlobalPluginManager();
  return pm.getAllPluginNodeTypes();
};

/**
 * 根据插件类型值获取对应的标签
 * @param pluginType 插件类型值
 * @returns 显示标签，如果未找到则返回类型值本身
 */
export const getLabelByNodeType = (pluginType: string): string => {
  const list = getAllPluginNodeTypes();
  const item = list.find((i: any) => i.value === pluginType);
  return item?.label ?? pluginType;
};

/**
 * 根据插件类型值获取完整的节点类型信息
 * @param pluginType 插件类型值
 * @returns 节点类型信息对象，如果未找到则返回undefined
 */
export const getNodeTypeInfo = (pluginType: string) => {
  const list = getAllPluginNodeTypes();
  return list.find((i: any) => i.value === pluginType);
};