/*
 * @File: data.ts
 * @desc: 自定义表单配置示例
 * @author: heqinghua
 * @date: 2025年11月11日 16:49:20
 * @example: 调用示例
 */

import type { Schema } from '@chloehe/logic-engine-ui';
/**
 * 内置的控件常量
 */
import { WidgetKeys } from '@chloehe/logic-engine-ui';
export const schema: Schema = {
  type: 'custom',
  label: '自定义表单配置',
  config: [
    {
      field: 'api_key',
      label: 'API密钥',
      //  type:"ant_Checkbox.Group",
      //  widget:"ant_Checkbox.Group",
      type: WidgetKeys.CheckboxGroup,
       widget:WidgetKeys.CheckboxGroup,
      formItemProps: {
        rules: [
          {
            required: true,
            message: '请选择API密钥',
          },
        ],
      },
      widgetProps: {
        options: [
          { value: 'key1', label: '密钥1' },
          { value: 'key2', label: '密钥2' },
        ],
      },
    },
    {
      field: 'action_type',
      label: '键值对',
      type: 'key_value_editor',
      formItemProps: {
        rules: [
          {
            required: true,
            message: '请配置键值对',
          },
          {
            // 自定义校验：键必填且唯一
            validator: (_: any, value: any) => {
              if (!value || !Array.isArray(value)) {
                return Promise.resolve();
              }

              // 检查是否有空键
              const hasEmptyKey = value.some(
                (item: any) => !item.key || item.key.trim() === '',
              );
              if (hasEmptyKey) {
                return Promise.reject('键不能为空');
              }

              // 检查键是否重复
              const keys = value.map((item: any) => item.key);
              const uniqueKeys = new Set(keys);
              if (keys.length !== uniqueKeys.size) {
                return Promise.reject('存在重复的键');
              }

              return Promise.resolve();
            },
          },
        ],
      },
      widgetProps: {},
    },
    {
      field: 'color',
      label: '颜色选择',
      type: 'custom_widget',
      formItemProps: {
        // rules: [
        //   {
        //     required: true,
        //     message: '请选择颜色',
        //   },
        // ],
      },
      widgetProps: {},
    },
  ],
};
