/*
 * @File: 
 * @desc: 
 * @author: heqinghua
 * @date: 2026年06月15日 17:24:38
 * @example: 调用示例
 */
const edgeConfigSchema = {
  type: 'edge',
  label: '边配置',
  config: [
    {
      field: "conditions",
      label: "规则配置",
      type: "rule_editor",
      widgetProps: {
        fields: [],
      },
    },
  ],
};

export default edgeConfigSchema;