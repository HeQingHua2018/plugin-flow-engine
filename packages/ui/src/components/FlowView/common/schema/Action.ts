/*
 * @File: ActionNodePlugin/schema.ts
 * @desc: 动作节点配置表单_schema
 * @author: heqinghua
 * @date: 2025年10月17日 10:58:34 
 * @example: 调用示例
 */
import { type NodeConfig, WidgetKeys } from "@chloehe/logic-engine-ui";
import { BuiltInPluginNodeTypes } from "@chloehe/logic-engine-common";
import CommonConfig from "./CommonConfig";


const PluginNodeType = BuiltInPluginNodeTypes.Action;
const PluginNodeTypeName = "动作节点";

const ActionNodeFormSchema: NodeConfig = {
  schema: {
    type: PluginNodeType,
    label: PluginNodeTypeName,
    // config: [
    //   {
    //     field: "api_key",
    //     label: "API密钥",
    //     type: WidgetKeys.CheckboxGroup,
    //     widget: WidgetKeys.CheckboxGroup,
    //     formItemProps: {
    //       rules: [
    //         {
    //           required: true,
    //           message: "请选择API密钥",
    //         },
    //       ],
    //     },
    //     widgetProps: {
    //       options: [
    //         { value: "key1", label: "密钥1" },
    //         { value: "key2", label: "密钥2" },
    //       ],
    //     },
    //   },
    //   {
    //     field: "action_type",
    //     label: "键值对",
    //     type:"key_value_editor",
    //     formItemProps: {
    //       rules: [
    //         {
    //           required: true,
    //           message: "请配置键值对",
    //         },
    //         {
    //           // 自定义校验：键必填且唯一
    //           validator: (_: any, value: any) => {
    //             if (!value || !Array.isArray(value)) {
    //               return Promise.resolve();
    //             }
                
    //             // 检查是否有空键
    //             const hasEmptyKey = value.some((item: any) => !item.key || item.key.trim() === '');
    //             if (hasEmptyKey) {
    //               return Promise.reject('键不能为空');
    //             }
                
    //             // 检查键是否重复
    //             const keys = value.map((item: any) => item.key);
    //             const uniqueKeys = new Set(keys);
    //             if (keys.length !== uniqueKeys.size) {
    //               return Promise.reject('存在重复的键');
    //             }
                
    //             return Promise.resolve();
    //           },
    //         },
    //       ],
    //     },
    //     widgetProps: {
    //     },
    //   },
    // ],
    config: CommonConfig,
  },
};

export default ActionNodeFormSchema;
export { PluginNodeType, PluginNodeTypeName };