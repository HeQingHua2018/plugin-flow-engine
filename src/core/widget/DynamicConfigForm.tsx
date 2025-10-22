/*
 * @File: index.tsx
 * @desc: 动态配置表单组件
 * @author: heqinghua
 * @date: 2025年08月12日 13:57:49
 * @example: 调用示例
 */

import React, { useEffect } from 'react';
import { Button, Form, message } from 'antd';

import { getWidgetByType } from '../utils/NodeInjector';

import type { DynamicFormProps, Field } from './type';

/**
 * 根据字段类型获取对应的控件组件
 * @param type 字段类型
 * @param widget 可选的指定控件类型
 * @returns 对应的控件组件
 */
// 删除本地 getWidgetByType，统一使用注入器提供的方法

/**
 * 检查字段是否可见，根据依赖条件判断
 * @param field 字段配置
 * @param formValues 当前表单值
 * @returns 是否可见
 */
const checkDependency = (field: Field, formValues: Record<string, any>): boolean => {
  if (!field.dependsOn) return true;

  const { field: dependField, value: dependValue } = field.dependsOn;
  const currentValue = formValues[dependField];

  if (typeof dependValue === 'function') {
    return dependValue(currentValue);
  }

  return currentValue === dependValue;
};

/**
 * 动态配置表单组件
 * @param schema 节点 schema，包含字段配置
 * @param value 当前表单值
 * @param onChange 值变化回调
 * @returns 动态配置表单组件实例
 */
const DynamicConfigForm: React.FC<DynamicFormProps> = ({ schema, value, onChange }: DynamicFormProps) => {
  const [form] = Form.useForm<Record<string, any>>();
  // 当value变化时，更新表单值
  useEffect(() => {
    if (value) {
      form.setFieldsValue(value);
    } else {
      // 设置默认值
      const initialValues: Record<string, any> = {};
      schema.config.forEach((field: Field) => {
        if (field.defaultValue !== undefined) {
          initialValues[field.field] = field.defaultValue;
        }
      });
      form.setFieldsValue(initialValues);
    }
  }, [value, schema, form]);

  const handleFieldChange = (fieldName: string, fieldValue: any) => {
    onChange({
      ...value,
      [fieldName]: fieldValue,
    });
  };
  const handleSaveConfig = async () => {
    try {
      const result = await form.validateFields();
      message.success('校验通过');
      console.log('校验通过的配置', result);
    } catch (e) {
      message.error('校验失败, 请检查表单输入项');
      console.log(e);
    }
  };
  return (
    <Form layout="vertical" style={{ width: '100%' }} form={form}>
      {schema.config.map((field) => {
        const Widget = getWidgetByType(field.type, field.widget);
        const isVisible = checkDependency(field, value || {});

        if (!isVisible) return null;

        // 分离formItemProps和widgetProps
        const { formItemProps = {}, widgetProps = {} } = field;

        return (
          <Form.Item
            key={field.field}
            name={field.field}
            label={field.label}
            {...formItemProps}
          >
            <Widget
              value={value ? value[field.field] : field.defaultValue}
              onChange={(val: any) => handleFieldChange(field.field, val)}
              {...widgetProps}
            />
          </Form.Item>
        );
      })}
      <Form.Item>
        <Button type="primary" onClick={handleSaveConfig}>
          保存配置
        </Button>
      </Form.Item>
    </Form>
  );
};

export default DynamicConfigForm;


