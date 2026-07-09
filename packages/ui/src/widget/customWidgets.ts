/*
 * 自定义控件映射
 * 通过注入器作为默认映射，避免在动态表单内部硬编码
 */
import React from 'react';
import { KeyValueEditor, EventConfig } from './components'
import RuleEditor from '../components/RuleEditor';

/**
 * 自定义组件映射，包含 KeyValueEditor 等组件
 */
const customWidgets: Record<string, React.ElementType<any>> = {
  'key_value_editor': KeyValueEditor,
  'event_config': EventConfig,
  'rule_editor': RuleEditor,
};
export default customWidgets;
