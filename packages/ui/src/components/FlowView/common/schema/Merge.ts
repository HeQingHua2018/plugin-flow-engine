/*
 * @File: MergeNodePlugin/schema.ts
 * @desc: 合并节点配置表单_schema
 * @author: heqinghua
 * @date: 2025年10月17日 10:58:34
 * @example: 调用示例
 */
import type { NodeConfig } from "@chloehe/logic-engine-ui";
import { BuiltInPluginNodeTypes } from "@chloehe/logic-engine-common";
import CommonConfig from "./CommonConfig";


// 直接定义类型和名称，避免循环导入
const PluginNodeType = BuiltInPluginNodeTypes.Merge;
const PluginNodeTypeName = "合并节点";

const MergeNodeFormSchema: NodeConfig = {
  schema: {
    type: PluginNodeType,
    label: PluginNodeTypeName,
    // config: [
    //    {
    //     field: "api_key",
    //     label: "API密钥",
    //     type: "ant_Checkbox.Group",
    //     formItemProps: {
    //       rules: [
    //         {
    //           required: true,
    //           message: "请选择API密钥",
    //         },
    //       ],
    //     },
    //     widgetProps: {
    //       placeholder: "请输入Dify API密钥",
    //       options: [
    //         { value: "key1", label: "密钥1" },
    //         { value: "key2", label: "密钥2" },
    //       ],
    //     },
    //   },
    //   {
    //     field: "project_id",
    //     label: "项目ID",
    //     type: "ant_Input",
    //     formItemProps: {
    //       rules: [
    //         {
    //           required: true,
    //           message: "请输入项目ID",
    //         },
    //       ],
    //     },
    //     widgetProps: {
    //       placeholder: "请输入项目ID",
    //     },
    //   },
    //   {
    //     field: "model",
    //     label: "模型选择",
    //     type: "ant_Select",
    //     widgetProps: {
    //       placeholder: "请选择模型",
    //       options: [
    //         { value: "gpt-4", label: "GPT-4" },
    //         { value: "gpt-4o", label: "GPT-4o" },
    //         { value: "qwen-long", label: "Qwen-Long" },
    //       ],
    //     },
    //   },
    // ],
     config: CommonConfig,
  },
};

export default MergeNodeFormSchema;
export { PluginNodeType, PluginNodeTypeName };