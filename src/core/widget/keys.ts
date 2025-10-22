/*
 * @File: keys.ts
 * @desc: 已知控件键常量导出（仅用于提示，不做强约束）
 */
export const AntdWidgetKeys = {
  Input: 'ant_Input',
  InputPassword: 'ant_Input.Password',
  InputTextArea: 'ant_Input.TextArea',
  InputSearch: 'ant_Input.Search',
  InputNumber: 'ant_InputNumber',
  Select: 'ant_Select',
  Checkbox: 'ant_Checkbox',
  CheckboxGroup: 'ant_Checkbox.Group',
  RadioGroup: 'ant_Radio.Group',
  Switch: 'ant_Switch',
  DatePicker: 'ant_DatePicker',
  DatePickerRangePicker: 'ant_DatePicker.RangePicker',
  TimePicker: 'ant_TimePicker',
  Slider: 'ant_Slider',
  Cascader: 'ant_Cascader',
  TreeSelect: 'ant_TreeSelect',
  Rate: 'ant_Rate',
  AutoComplete: 'ant_AutoComplete',
  Mentions: 'ant_Mentions',
  Upload: 'ant_Upload',
  Transfer: 'ant_Transfer',
  ColorPicker: 'ant_ColorPicker',
} as const;

export type AntdWidgetKey = typeof AntdWidgetKeys[keyof typeof AntdWidgetKeys];