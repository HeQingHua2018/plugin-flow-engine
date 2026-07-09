/*
 * @File: types.ts
 * @desc: 动态配置表单类型定义
 * @author: heqinghua
 * @date: 2025年11月10日 09:57:47
 * @example: 调用示例
 */
import { ReactNode } from 'react';
import type { Schema, FieldBase } from '../../types';
export interface DynamicConfigFormRef {
  form: any; // FormInstance<any>; avoid direct antd type coupling here
}

export type DynamicFormProps = {
  /**
   * 节点 schema，包含字段配置
   */
  schema: Schema;
  /**
   * 当前表单值
   */
  value: Record<string, any>;
  
  onChange?: (value: Record<string, any>) => void;
  /**
   * 自定义页脚
   * @returns ReactNode
   */
  renderFooter?: () => ReactNode; // ReactNode
  [key: string]: any;
}
export type { FieldBase };
