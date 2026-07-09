
/*
 * @File: TriggerNodePlugin/schema.ts
 * @desc: 触发器节点配置表单_schema
 * @author: heqinghua
 * @date: 2025年10月17日 10:58:34
 * @example: 调用示例
 */
import type { NodeConfig } from "@chloehe/logic-engine-ui";
import {BuiltInPluginNodeTypes} from "@chloehe/logic-engine-common";
import CommonConfig from "./CommonConfig";


const PluginNodeType = BuiltInPluginNodeTypes.Trigger;
const PluginNodeTypeName = "触发器节点";

const TriggerNodeFormSchema: NodeConfig = {
  schema: {
    type: PluginNodeType,
    label: PluginNodeTypeName,
    // config: [
    //   {
    //     field: "rule",
    //     label: "规则配置",
    //     type: "rule_editor",
    //     widgetProps: {
    //     },
    //   },
    //   {
    //     field: "event",
    //     label: "触发事件配置",
    //     type: "event_config",
    //     widgetProps: {
    //       placeholder: "请选择事件",
    //     },
    //   }
    // ],
     config: CommonConfig,
  },
};
export { PluginNodeType, PluginNodeTypeName };

export default TriggerNodeFormSchema;
