// UI-specific types centralized here

// 提供“已知键的智能提示 + 保持字符串开放”的联合类型工具
export type LiteralUnion<T extends U, U = string> = T | (U & Record<never, never>);

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

export type AntdWidgetKey = LiteralUnion<(typeof AntdWidgetKeys)[keyof typeof AntdWidgetKeys], string>;

export interface BaseWidgetProps<T> {
  value: T;
  onChange: (value: T) => void;
  [key: string]: any;
}

export type WidgetProps<T, U = object> = BaseWidgetProps<T> & U;

// Dynamic form aux types
export interface Option {
  value: string;
  label: string;
}

export interface DynamicConfigFormRef {
  form: any; // FormInstance<any>; avoid direct antd type coupling here
}

export interface DynamicFormProps {
  schema: import('./common').Schema;
  value: Record<string, any>;
  isValidate?: boolean;
  onChange?: (value: Record<string, any>) => void;
  onSave?: (value: Record<string, any>) => void;
  onValidateSave?: (value: Record<string, any>) => void;
  showButtons?: boolean;
  renderButton?: () => any; // ReactNode
  [key: string]: any;
}