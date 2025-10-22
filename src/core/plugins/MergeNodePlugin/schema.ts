/*
 * @File: MergeNodePlugin/schema.ts
 * @desc: 合并节点配置表单_schema
 * @author: heqinghua
 * @date: 2025年10月17日 10:58:34
 * @example: 调用示例
 */
import type { NodeConfig } from "../../type.d";

// 直接定义类型和名称，避免循环导入
const nodeType = "Merge";
const nodeName = "合并节点";

const MergeNodeFormSchema: NodeConfig = {
  schema: {
    type: nodeType,
    label: nodeName,
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
export { nodeType, nodeName };