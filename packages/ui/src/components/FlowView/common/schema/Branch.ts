/*
 * @File: BranchNodePlugin/schema.ts
 * @desc: 分支节点配置表单_schema
 * @author: heqinghua
 * @date: 2025年10月17日 10:58:34
 * @example: 调用示例
 */
import { type NodeConfig, WidgetKeys } from "@chloehe/logic-engine-ui";
import { BuiltInPluginNodeTypes } from "@chloehe/logic-engine-common";
import CommonConfig from "./CommonConfig";


const PluginNodeType = BuiltInPluginNodeTypes.Branch;
const PluginNodeTypeName = "分支节点";

const BranchNodeFormSchema: NodeConfig = {
 schema: {
    type: PluginNodeType,
    label: PluginNodeTypeName,
    // config: [
    //   {
    //     field: "branch_rule",
    //     label: "分支条件",
    //     type: WidgetKeys.Input,
    //     widget: WidgetKeys.Input,
    //     formItemProps: {
    //       rules: [
    //         {
    //           required: true,
    //           message: "请输入分支条件",
    //         },
    //       ],
    //     },
    //     widgetProps: {
    //       placeholder: "请输入分支条件",
    //     },
    //   },
    //   {
    //     field:'event',
    //     label:"事件配置",
    //     type: WidgetKeys.EventConfig,
    //     formItemProps:{},
    //     widgetProps:{},
    //   }
    // ],
     config: CommonConfig,
  },
};

export default BranchNodeFormSchema;
export { PluginNodeType, PluginNodeTypeName };