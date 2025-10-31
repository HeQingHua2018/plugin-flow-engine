/*
 * @File: MergeNodePlugin/schema.ts
 * @desc: 合并节点配置表单_schema
 * @author: heqinghua
 * @date: 2025年10月17日 10:58:34
 * @example: 调用示例
 */
import { BuiltInPluginNodeTypes } from "@plugin-flow-engine/type/core";
import type { NodeConfig } from "@plugin-flow-engine/type/common";

// 直接定义类型和名称，避免循环导入
const PluginNodeType = BuiltInPluginNodeTypes.Merge;
const PluginNodeTypeName = "合并节点";

const MergeNodeFormSchema: NodeConfig = {
  schema: {
    type: PluginNodeType,
    label: PluginNodeTypeName,
    config: [
      {
        field: "api_key",
        label: "API密钥",
        type:"ant_Radio.Group",
        widget:"ant_Radio.Group",
        formItemProps: {
          rules: [
            {
              required: true,
              message: "请选择API密钥",
            },
          ],
        },
        widgetProps: {
          options: [
            { value: "key1", label: "密钥1" },
            { value: "key2", label: "密钥2" },
          ],
        },
      },
    ],                                                                                                                                                                                                                                                                                                     
  },
};

export default MergeNodeFormSchema;
export { PluginNodeType, PluginNodeTypeName };