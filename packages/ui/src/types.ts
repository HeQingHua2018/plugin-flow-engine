/*
 * @File:
 * @desc:
 * @author: heqinghua
 * @date: 2025年11月07日 10:29:42
 * @example: 调用示例
 */
import { FormItemProps } from 'antd';
import { ElementType } from 'react';
import { WidgetKey } from './widget';

export type {
  Edge,
  FlowData,
  PluginNodeType,
} from '@chloehe/logic-engine-common';
export { BuiltInPluginNodeTypes } from '@chloehe/logic-engine-common';

export type { Node } from '@xyflow/react';

export type CoreNode = import('@chloehe/logic-engine-common').Node;

/**
 * 表单字段基础类型
 */
export interface FieldBase {
  type: WidgetKey;
  widget?: WidgetKey;
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
  /**
   * 将表单值转换为流程存储格式，例如 rule_editor 的 engine conditions
   */
  toStorage?: (value: any, field?: FieldBase) => any;
  /**
   * 将存储值转换为表单可编辑格式，例如 engine conditions 转为 rule_editor 可识别结构
   */
  fromStorage?: (value: any, field?: FieldBase) => any;
  [key: string]: any;
}

/**
 * 表单配置
 */
export interface Schema {
  type: string;
  label: string;
  config: FieldBase[];
}

/**
 * 组件映射
 */
export interface WidgetMap {
  [key: string]: ElementType<any>;
}

/**
 * 节点配置
 */
export interface NodeConfig {
  schema: Schema;
  widgets?: WidgetMap;
  [key: string]: any;
}
