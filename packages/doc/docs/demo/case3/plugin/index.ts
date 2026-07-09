/*
 * @File: 
 * @desc: 插件节点类型
 * @param pluginNodeType 插件节点类型
 * @param pluginNodeTypeName 插件节点类型名称
 * @author: heqinghua
 * @date: 2026年06月17日 17:26:21
 * @example: 调用示例
 */
import { createPluginManager } from "@chloehe/logic-engine-core";

import {TestPlugin} from './TestPlugin';

const pluginManager = createPluginManager();
pluginManager.registerPlugin(new TestPlugin());

