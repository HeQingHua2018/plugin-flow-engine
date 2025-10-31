/*
 * @File: 
 * @desc: 注册自定义插件
 * @author: heqinghua
 * @date: 2025年10月30日 15:34:05
 * @example: 调用示例
 */
// 注册自定义插件
import MyActionPlugin from "./MyAction";
import {  PluginManagerInstance } from "@plugin-flow-engine/core";
const pm = PluginManagerInstance();
pm.registerPlugin(new MyActionPlugin());


// 覆盖插件的默认配置
// import { BuiltInPluginNodeTypes } from "@plugin-flow-engine/core";
// import schema from "./MyAction/schema";
// import { registerPluginUI } from "@plugin-flow-engine/ui";

// registerPluginUI(BuiltInPluginNodeTypes.Action, schema);

