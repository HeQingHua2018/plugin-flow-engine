/*
 * @File: defaultWidget.ts
 * @desc: 内置默认控件映射
 * @author: heqinghua
 * @date: 2025年10月20日 15:01:10
 * @example: 调用示例
 */
import antdWidgets from './antdWidgets';
import customWidgets from './customWidgets';

/**
 * 内置默认控件映射，包含 Ant Design 组件和自定义组件
 */
export default{
  ...antdWidgets,
  ...customWidgets,
};
