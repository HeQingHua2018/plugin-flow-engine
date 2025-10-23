import type { FormItemProps, FormInstance } from "antd";
import type { ReactNode } from "react";

interface DynamicFormProps {
  /** 表单配置项 schema */
  schema: Schema;
  /** 表单初始值 */
  value: Record<string, any>;
  /** 是否校验表单值 */
  isValidate?: boolean;
  /** 表单值改变时触发 */
  onChange?: (value: Record<string, any>) => void;
  /** 点击保存按钮时触发 */
  onSave?: (value: Record<string, any>) => void;
  /** 点击校验并保存按钮时触发 */
  onValidateSave?: (value: Record<string, any>) => void;
  /** 是否显示内置的保存/校验按钮 */
  showButtons?: boolean;
  /** 自定义按钮渲染；若提供则优先生效 */
  renderButton?: () => ReactNode;
  [key: string]: any;
}


interface Field {
  type: string;
  widget?: string;
  field: string;
  label: string;
  formItemProps?: Omit<FormItemProps,'initialValue'>;
  widgetProps?: Record<string,any>;
  defaultValue?: any;
  description?: string;
  dependsOn?: {
    field: string;
    value: any | ((value: any) => boolean);
  };
  [key:string]: any
}

interface Schema {
  type: string,
  label: string,
  config: Field[];
}

interface Option {
  value: string;
  label: string;
}

interface DynamicConfigFormRef {
  /** 暴露 Form 实例，供外部自定义按钮使用 */
  form: FormInstance<any>;
}

export type {
  DynamicFormProps,
  Field,
  Schema,
  Option,
  DynamicConfigFormRef,
}