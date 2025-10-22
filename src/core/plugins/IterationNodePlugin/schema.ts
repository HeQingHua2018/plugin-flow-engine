/*
 * @File: IterationNodePlugin/schema.ts
 * @desc: 迭代节点配置表单_schema
 * @author: heqinghua
 * @date: 2025年10月17日 10:58:34
 * @example: 调用示例
 */
import type { NodeConfig } from "../../type.d";

// 直接定义类型和名称，避免循环导入
const nodeType = "Iteration";
const nodeName = "迭代节点";

const IterationNodeFormSchema: NodeConfig = {
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

export default IterationNodeFormSchema;
export { nodeType, nodeName };