import { Key } from 'react';
import { NativeType } from './utils';
import type { OperatorType } from '@chloehe/logic-engine-common';
export type RuleType = OperatorType;
export type LinkType = 'and' | 'or';
export type ModeType = 'edit' | 'show';
export type optionsType = { value: string; label: string };

export type RuleFieldData = {
  /**
   * 唯一标识
   */
  key: Key;
  /**
   * 数据类型
   */
  type: NativeType | string;
  /**
   * 字段显示名称
   */
  label: string;
  /**
   * 字段名称
   */
  fieldName: string;
  /**
   * 不同类型字段配置
   */
  props?: {
    format?: string;
    multi?: boolean;
    options?: Array<optionsType>;
    [name: string]: any;
  };
  /**
   * 自定义规则
   */
  rules?: Array<RuleType>;
};
export interface RuleItemDataProp {
  /**
   * 唯一标识
   */
  key: Key;
  /**
   * 类型
   */
  type: 'group' | 'rule';
  /**
   * 关系，仅type为group时生效
   */
  link?: LinkType;
  /**
   * 匹配规则
   */
  rule?: RuleType;
  /**
   * 对应fields 中的key
   */
  field?:string;
  /**
   * 匹配字段
   */
  fieldName?: string;
  /**
   * 匹配字段数据类型
   */
  fieldType?: NativeType;
  /**
   * 匹配值
   */
  value?: Array<any>;
  /**
   * 匹配值数据类型
   */
  valueType?: NativeType | string;
  /**
   * 子项（类别为group时才存在）
   */
  children?: Array<RuleItemDataProp>;
  /**
   * 规则语义化描述
   */
  desc?: string;
}

export interface RuleItemData extends RuleItemDataProp {
  _isEdit?: boolean;
  _isAdd?: boolean;
}

export type RuleEditorProps = {
  /**
   * 字段数据
   */
  fields?: Array<RuleFieldData>;
  /**
   * 规则数据（兼容旧 API）
   */
  rules?: RuleItemDataProp;
  /**
   * 受控规则数据
   */
  value?: RuleItemDataProp;
  /**
   *  模式, 编辑：edit，显示：show
   */
  mode?: ModeType;
  /**
   * 值变更事件
   */
  onChange?: (rules: RuleItemDataProp, currentRule: RuleItemDataProp) => void;
};
export type RuleEditorState = {
  fields: Array<RuleFieldData>;
  rules: Array<RuleItemData>;
  count: number;
  editKey: string;
};

export interface RuleContextProps {
  editKey?: string;
  editable?: boolean;
  mode?: ModeType;
  rules?: Array<RuleItemData>;
  dispatch?: any;
}

export type RuleItemProps = {
  mode: ModeType; // 模式
  prefixCls: string; // 样式前缀
  fields?: Array<RuleFieldData>; // 字段数据
  rule: RuleItemData; // 规则数据
  group: Key; // 父级key
  onAdd?: () => void; // 添加规则
  onChange?: (rule: RuleItemDataProp) => void; // 值变更事件
};

export type RuleGroupProps = {
  /**
   * 样式前缀
   */

  prefixCls: string;
  /**
   * 编辑key
   */
  editKey?: string;
  /**
   * 字段数据
   */
  fields?: Array<RuleFieldData>;
  /**
   * 规则数据
   */
  rules?: Array<RuleItemData>;
  /**
   * 父级key
   */
  group?: Key;
  /**
   * 删除事件
   */
  onRemove?: (key: Key, type: 'group' | 'rule') => void;
  /**
   * 编辑事件
   */
  onEditRow?: (val: RuleItemData) => void;
};
