/*
 * @File: 
 * @desc: 自定义操作插件
 * @author: heqinghua
 * @date: 2025年10月30日 15:25:28
 * @example: 调用示例
 */

import { BaseNodePlugin } from "@plugin-flow-engine/core";
import { NodeConfig } from "@plugin-flow-engine/type";
import schema from "./schema";
class MyActionPlugin extends BaseNodePlugin {
  pluginNodeTypeName = '我的操作';
  pluginNodeType = 'MyAction';
  getNodeFormConfig(): NodeConfig | null {
    return schema;
  }
}
export default MyActionPlugin;