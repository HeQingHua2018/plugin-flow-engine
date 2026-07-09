/*
 * @File: 
 * @desc: 插件节点类型
 * @param pluginNodeType 插件节点类型
 * @param pluginNodeTypeName 插件节点类型名称
 * @author: heqinghua
 * @date: 2026年06月17日 17:26:21
 * @example: 调用示例
 */
import { createPluginManager, getGlobalPluginManager } from "@chloehe/logic-engine-core";

import {TestPlugin} from './TestPlugin';

// const pm = getGlobalPluginManager();
// pm.registerPlugin(new TestPlugin());

const customPluginManager = createPluginManager();
customPluginManager.registerPlugin(new TestPlugin());

export default customPluginManager;


