/*
 * @File: 
 * @desc: 自定义操作插件表单配置
 * @author: heqinghua
 * @date: 2025年10月30日 15:25:36
 * @example: 调用示例
 */

import { AntdWidgetKeys, NodeConfig } from "@plugin-flow-engine/type";
import customInputWidget from "./customInputWidget";

const schema: NodeConfig = {
 schema:{
    type:"MyAction",
    label:"我的操作",
    config:[
      {
        type:AntdWidgetKeys.Input,
        label:"操作名称",
        field:"name",
        formItemProps:{
          required:true,
        }
      },
      {
          type: "custom-input",
          widget: 'custom-input',
          label: "操作参数",
          field: "params",
          formItemProps: {
              required: true,
          },
          widgetProps:{
            placeholder:"请输入操作参数",
          }
      },
    ]
 },
 widgets:{
    'custom-input': customInputWidget,
 }
 
};
export default schema;
