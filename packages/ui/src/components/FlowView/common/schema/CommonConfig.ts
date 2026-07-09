const commonConfig = [
      {
        field:"label",
        label:"节点名称",
        type:"ant_Input",
        widget:"ant_Input",
        level: "data",
        widgetProps: {
          placeholder: "请输入节点名称",
        },
        formItemProps: {
          rules: [
            {
              required: true,
              message: "请输入节点名称",
            },
          ],
        },
      },
      {
        field: "conditions",
        label: "规则配置",
        type: "rule_editor",
        widgetProps: {
        },
      },
      {
        field: "event",
        label: "触发事件配置",
        type: "event_config",
        widgetProps: {
          placeholder: "请选择事件",
        },
      }
    
];
export default commonConfig;