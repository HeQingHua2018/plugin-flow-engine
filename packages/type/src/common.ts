/*
 * @File: 
 * @desc: 
 * @author: heqinghua
 * @date: 2025年10月29日 11:56:33
 * @example: 调用示例
 */
import { FormItemProps } from 'antd';
import type { ElementType } from 'react';

// Common cross-package types independent of runtime
export interface FieldBase {
  type: string;
  widget?: string;
  field: string;
  label: string;
  formItemProps?: Omit<FormItemProps, 'initialValue'>;
  widgetProps?: Omit<Record<string, any>, 'value' | 'onChange'>;
  defaultValue?: any;
  description?: string;
  dependsOn?: {
    field: string;
    value: any | ((value: any) => boolean);
  };
  [key: string]: any;
}

export interface Schema {
  type: string;
  label: string;
  config: FieldBase[];
}

export interface WidgetMap {
  [key: string]: ElementType<any>;
}

export interface NodeConfig {
  schema: Schema;
  widgets?: WidgetMap;
  [key: string]: any;
}