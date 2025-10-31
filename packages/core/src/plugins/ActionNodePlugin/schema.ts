/*
 * @File: ActionNodePlugin/schema.ts
 * @desc: 动作节点配置表单_schema
 * @author: heqinghua
 * @date: 2025年10月17日 10:58:34 
 * @example: 调用示例
 */
import { BuiltInPluginNodeTypes } from "@plugin-flow-engine/type/core";
import type { NodeConfig } from "@plugin-flow-engine/type/common";

const PluginNodeType = BuiltInPluginNodeTypes.Action;
const PluginNodeTypeName = "动作节点";

const ActionNodeFormSchema: NodeConfig = {
  schema: {
    type: PluginNodeType,
    label: PluginNodeTypeName,
    config: [
      {
        field: "api_key",
        label: "API密钥",
        type:"ant_Checkbox.Group",
        widget:"ant_Checkbox.Group",
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
      {
        field: "action_type",
        label: "键值对",
        type:"key-value-editor",
        formItemProps: {
          rules: [
            {
              required: true,
              message: "请配置键值对",
            },
            {
              // 自定义校验：键必填且唯一
              validator: (_: any, value: any) => {
                const pairs = Array.isArray(value) ? value : [];
                // 放行空数组的情况交由 required 规则处理
                if (!pairs || pairs.length === 0) {
                  return Promise.resolve();
                }
                const keys = pairs.map((p: any) => ((p?.key ?? "").trim()));
                // 空键校验
                const emptyIndex = keys.findIndex((k: string) => !k);
                if (emptyIndex !== -1) {
                  return Promise.reject(new Error(`存在空键（第${emptyIndex + 1}项）`));
                }
                // 重复键校验
                const seen = new Set<string>();
                const dups = new Set<string>();
                keys.forEach((k: string) => {
                  if (seen.has(k)) {
                    dups.add(k);
                  } else {
                    seen.add(k);
                  }
                });
                if (dups.size > 0) {
                  return Promise.reject(new Error(`存在重复键：${Array.from(dups).join(', ')}`));
                }
                return Promise.resolve();
              },
            },
          ],
        },
        widgetProps: {
        },
      },
    ],                                                                                                                                                                                                                                                                                                     
  },
  // widgets: {
  //   switch:  Switch                                                                                                                                                                                                                                                                                                                                                                                                       ,
  // },
};

export default ActionNodeFormSchema;
export { PluginNodeType, PluginNodeTypeName };
