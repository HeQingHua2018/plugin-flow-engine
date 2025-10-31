/*
 * @File: BranchNodePlugin/schema.ts
 * @desc: 分支节点配置表单_schema
 * @author: heqinghua
 * @date: 2025年10月17日 10:58:34
 * @example: 调用示例
 */
import { BuiltInPluginNodeTypes } from "@plugin-flow-engine/type/core";
import type { NodeConfig } from "@plugin-flow-engine/type/common";

const PluginNodeType = BuiltInPluginNodeTypes.Branch;
const PluginNodeTypeName = "分支节点";

const BranchNodeFormSchema: NodeConfig = {
 schema: {
    type: PluginNodeType,
    label: PluginNodeTypeName,
    config: [
      {
        field: "branch_rule",
        label: "分支条件",
        type:"ant_Input",
        widget:"ant_Input",
        formItemProps: {
          rules: [
            {
              required: true,
              message: "请输入分支条件",
            },
          ],
        },
        widgetProps: {
          placeholder: "请输入分支条件",
        },
      },
    ],                                                                                                                                                                                                                                                                                                     
  },
};

export default BranchNodeFormSchema;
export { PluginNodeType, PluginNodeTypeName };