/*
 * @File: ParallelNodePlugin/schema.ts
 * @desc: 并行节点配置表单_schema
 * @author: heqinghua
 * @date: 2025年10月17日 10:58:34
 * @example: 调用示例
 */
import { BuiltInPluginNodeTypes } from "@plugin-flow-engine/type/core";
import type { NodeConfig } from "@plugin-flow-engine/type/common";

const PluginNodeType = BuiltInPluginNodeTypes.Parallel;
const PluginNodeTypeName = "并行节点";

const ParallelNodeFormSchema: NodeConfig = {
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

export default ParallelNodeFormSchema;
export { PluginNodeType, PluginNodeTypeName };