/*
 * @File: index.tsx
 * @desc: 动态配置表单组件
 * @author: heqinghua
 * @date: 2025年08月12日 13:57:49
 * @example: 调用示例
 */

import React, { useEffect, useState, useImperativeHandle, forwardRef, useMemo, useCallback, useRef } from 'react';
import { Form } from 'antd';

import { getWidgetByType } from '../../utils/FormWidgetInjector';
import type { DynamicFormProps, DynamicConfigFormRef, FieldBase } from './types';
import { prepareConfigFormValues } from './helpers';

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

// 创建稳定 MemoizedWidget 组件，用于渲染表单字段
const MemoizedWidget = React.memo<{ field: FieldBase }>(({ field }) => {
  const Widget = getWidgetByType(field.type, field.widget);
  const { formItemProps = {}, widgetProps = {} } = field;
  
  // 兜底校验策略：如果标记了 required 但未提供 rules，则自动添加必填规则
  const needRequiredRule = (formItemProps as any).required && !(formItemProps as any).rules;
  const safeFormItemProps = needRequiredRule
    ? {
        ...formItemProps,
        rules: [{ required: true, message: `请输入${field.label || field.field}` }],
      }
    : formItemProps;

  return (
    <Form.Item
      key={field.field}
      name={field.field}
      label={field.label}
      {...safeFormItemProps}
    >
      <Widget {...widgetProps} />
    </Form.Item>
  );
});

/**
 * 动态配置表单组件
 * @param schema 节点 schema，包含字段配置
 * @param value 当前表单值
 * @param onChange 值变化回调
 * @returns 动态配置表单组件实例
 */
const DynamicConfigForm = forwardRef<DynamicConfigFormRef, DynamicFormProps>((props, ref) => {
  const { schema, value, onChange, renderFooter, } = props;

  const [form] = Form.useForm<Record<string, any>>();
  // 通过 ref 暴露 form 实例
  useImperativeHandle(ref, () => ({ form }), [form]);

  // 本地记录当前值用于依赖可见性计算与提升变更
  const [currentValues, setCurrentValues] = useState<Record<string, any>>(value || {});

  // 缓存 onChange 回调，避免 useEffect 频繁触发
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  // 缓存 form 实例，避免在 useEffect 依赖中使用
  const formRef = useRef(form);
  formRef.current = form;

  // 当value变化时，更新表单值与本地 currentValues
  useEffect(() => {
    // 只在外部 value 真正变化时才更新（避免内部表单变化导致的循环）
    const preparedValues = prepareConfigFormValues(value || {}, schema);
    const currentFormValues = formRef.current.getFieldsValue();
    
    // 比较是否有真正的变化
    const hasChanges = Object.keys({ ...preparedValues, ...currentFormValues }).some(
      key => JSON.stringify(preparedValues[key]) !== JSON.stringify(currentFormValues[key])
    );
    
    if (hasChanges) {
      formRef.current.setFieldsValue(preparedValues);
      setCurrentValues(preparedValues);
    }
  }, [value, schema]);

  // 稳定 onValuesChange 处理函数
  const handleValuesChange = useCallback((_: any, allValues: Record<string, any>) => {
    setCurrentValues(allValues);
    onChangeRef.current?.(allValues);
  }, []);

  // 使用 useMemo 缓存 schema.config，避免每次渲染重新计算
  const fieldConfigs = useMemo(() => schema.config, [schema.config]);

  return (
    <Form
      layout="vertical"
      style={{ width: '100%' }}
      form={form}
      onValuesChange={handleValuesChange}
    >
      {fieldConfigs.map((field: FieldBase) => {
        const isVisible = checkDependency(field, currentValues || {});
        if (!isVisible) return null;
        return <MemoizedWidget key={field.field} field={field} />;
      })}
       {renderFooter?.()}
    </Form>
  );
});

export default DynamicConfigForm;
