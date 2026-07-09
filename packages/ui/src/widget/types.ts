/*
 * @File: 
 * @desc: 组件库-类型定义
 * @author: heqinghua
 * @date: 2025年11月10日 09:52:08
 * @example: 调用示例
 */

// 提供"已知键的智能提示 + 保持字符串开放"的联合类型工具
export type LiteralUnion<T extends U, U = string> = T | (U & Record<never, never>);

// 默认控件的所有 key 列表
export const WidgetKeys = {
  // Ant Design 组件
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
  
  // 自定义组件
  KeyValueEditor: 'key_value_editor',
  EventConfig: 'event_config'
} as const;

// WidgetKey 联合类型：可以是默认控件的任意 key，也可以是任意 string 类型
export type WidgetKey = LiteralUnion<(typeof WidgetKeys)[keyof typeof WidgetKeys], string>;

export interface BaseWidgetProps<T> {
  value: T;
  onChange: (value: T) => void;
  [key: string]: any;
}

export type WidgetProps<T, U = object> = BaseWidgetProps<T> & U;


