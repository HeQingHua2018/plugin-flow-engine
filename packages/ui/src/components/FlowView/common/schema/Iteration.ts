/*
 * @File: IterationNodePlugin/schema.ts
 * @desc: 迭代节点配置表单_schema
 * @author: heqinghua
 * @date: 2025年10月17日 10:58:34
 * @example: 调用示例
 */
import type { NodeConfig } from "@chloehe/logic-engine-ui";
import { BuiltInPluginNodeTypes, IterationMode } from "@chloehe/logic-engine-common";
import CommonConfig from "./CommonConfig";


const PluginNodeType = BuiltInPluginNodeTypes.Iteration;
const PluginNodeTypeName = "迭代节点";

const IterationNodeFormSchema: NodeConfig = {
  schema: {
    type: PluginNodeType,
    label: PluginNodeTypeName,
    config: [
      ...CommonConfig,
      {
        field: "iteration_count",
        label: "迭代次数",
        type:"ant_InputNumber",
        widget:"ant_InputNumber",
        widgetProps: {
          step: 1,
          min: 1,
          precision: 0,
          defaultValue: 1,
        },
        formItemProps: {
                   rules: [
            {
              required: true,
              message: "请输入迭代次数",
            },
            {
              type: "number",
              min: 1,
              max: 100,
              message: "迭代次数必须在1到100之间",
            },
            {
              pattern: /^\d+$/,
              message: "迭代次数必须是数字",
            },
          ],
        },
      },
      {
        field: "iteration_mode",
        label: "迭代模式",
        type:"ant_Radio.Group",
        widget:"ant_Radio.Group",
        formItemProps: {
          rules: [
            {
              required: true,
              message: "请选择迭代模式",
            },
          ],
        },
        widgetProps: {
          options: [
            { value: IterationMode.ALL_SUCCESS, label: "全部成功" },
            { value: IterationMode.ANY_SUCCESS, label: "任一子节点成功" },
            { value: IterationMode.ANY_FAILURE, label: "任一子节点失败" },
          ],
        },
      },
    ],
  },
};

export default IterationNodeFormSchema;
export { PluginNodeType, PluginNodeTypeName };