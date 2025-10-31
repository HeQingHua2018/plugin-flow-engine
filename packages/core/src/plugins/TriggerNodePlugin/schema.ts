
/*
 * @File: TriggerNodePlugin/schema.ts
 * @desc: 触发器节点配置表单_schema
 * @author: heqinghua
 * @date: 2025年10月17日 10:58:34
 * @example: 调用示例
 */
import { BuiltInPluginNodeTypes } from "@plugin-flow-engine/type/core";
import type { NodeConfig } from "@plugin-flow-engine/type/common";

const PluginNodeType = BuiltInPluginNodeTypes.Trigger;
const PluginNodeTypeName = "触发器节点";

const TriggerNodeFormSchema: NodeConfig = {
  schema: {
    type: PluginNodeType,
    label: PluginNodeTypeName,
    config: [
      {
        field: "api_key",
        label: "API密钥",
        type: "ant_Checkbox.Group",
        // type:"key-value-editor",
        formItemProps: {
          rules: [
            {
              required: true,
              message: "请选择API密钥",
            },
          ],
        },
        widgetProps: {
          placeholder: "请输入Dify API密钥",
          options: [
            { value: "key1", label: "密钥1" },
            { value: "key2", label: "密钥2" },
          ],
        },
      },
      {
        field: "project_id",
        label: "项目ID",
        type: "ant_Input",
        formItemProps: {
          rules: [
            {
              required: true,
              message: "请输入项目ID",
            },
          ],
        },
        widgetProps: {
          placeholder: "请输入项目ID",
        },
      },
      {
        field: "model",
        label: "模型选择",
        type: "ant_Select",
        widgetProps: {
          placeholder: "请选择模型",
          options: [
            { value: "gpt-4", label: "GPT-4" },
            { value: "gpt-4o", label: "GPT-4o" },
            { value: "qwen-long", label: "Qwen-Long" },
          ],
        },
      },
    ],
  },
};
export { PluginNodeType, PluginNodeTypeName };

export default TriggerNodeFormSchema;