/*
 * @File: index.tsx
 * @desc: 动态配置表单组件
 * @author: heqinghua
 * @date: 2025年08月12日 13:57:49
 * @example: 调用示例
 */

import React, { useEffect, useState, useImperativeHandle, forwardRef } from 'react';
import { Button, Form, message, Space } from 'antd';

import { getWidgetByType } from '../utils/NodeInjector';
import type { DynamicFormProps, DynamicConfigFormRef, FieldBase } from '@plugin-flow-engine/type';

/**
 * 检查字段是否可见，根据依赖条件判断
 * @param field 字段配置
 * @param formValues 当前表单值
 * @returns 是否可见
 */
const checkDependency = (field: FieldBase, formValues: Record<string, any>): boolean => {
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
const DynamicConfigForm = forwardRef<DynamicConfigFormRef, DynamicFormProps>((props, ref) => {
  const { schema, value, onChange, onSave, onValidateSave, showButtons = true, renderButton } = props;

  const [form] = Form.useForm<Record<string, any>>();
  // 通过 ref 暴露 form 实例
  useImperativeHandle(ref, () => ({ form }), [form]);

  // 本地记录当前值用于依赖可见性计算与提升变更
  const [currentValues, setCurrentValues] = useState<Record<string, any>>(value || {});

  // 当value变化时，更新表单值与本地 currentValues
  useEffect(() => {
    if (value && Object.keys(value).length > 0) {
      form.setFieldsValue(value);
      setCurrentValues(value);
    } else {
      // 设置默认值
      const initialValues: Record<string, any> = {};
      schema.config.forEach((field: FieldBase) => {
        if (field.defaultValue !== undefined) {
          initialValues[field.field] = field.defaultValue;
        }
      });
      form.setFieldsValue(initialValues);
      setCurrentValues(initialValues);
    }
  }, [value, schema, form]);

  const handleSave = () => {
    const result = form.getFieldsValue();
    onSave?.(result);
  };

  const handleSaveConfig = async () => {
    try {
      const result = await form.validateFields();
      message.success('校验通过');
      onValidateSave?.(result);
    } catch (e) {
      message.error('校验失败, 请检查表单输入项');
      // 保持抽屉/容器不关闭，由上层决定
    }
  };

  // 渲染自定义按钮（若提供），提供操作 API
  const renderCustomButtons = () => {
    return (
      <Form.Item>
        {renderButton?.()}
      </Form.Item>
    );
  };

  return (
    <Form
      layout="vertical"
      style={{ width: '100%' }}
      form={form}
      onValuesChange={(_, allValues) => {
        setCurrentValues(allValues);
        onChange?.(allValues);
      }}
    >
      {schema.config.map((field: FieldBase) => {
        const Widget = getWidgetByType(field.type, field.widget);
        const isVisible = checkDependency(field, currentValues || {});

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
              {...widgetProps}
            />
          </Form.Item>
        );
      })}

      {renderButton ? (
        renderCustomButtons()
      ) : (
        showButtons && (
          <Form.Item>
            <Space>
              <Button type="primary" onClick={handleSaveConfig}>
                校验并保存配置
              </Button>
              <Button type="primary" onClick={handleSave}>
                保存配置
              </Button>
            </Space>
          </Form.Item>
        )
      )}
    </Form>
  );
});

export default DynamicConfigForm;


