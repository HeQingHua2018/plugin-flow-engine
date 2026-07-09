/*
 * @File: DemoForm.tsx
 * @desc: 测试用业务组件 — 表单
 * useExpose 一步完成：注册 + 暴露
 */
import React, { forwardRef } from 'react';
import { Form, Input, Button, message } from 'antd';
import { useExpose } from '@chloehe/logic-engine-react';

interface DemoFormProps {
  onSubmit?: (values: Record<string, any>) => void;
  onChange?: (values: Record<string, any>) => void;
}

export interface DemoFormRef {
  onSubmit: (params?: any) => any;
  onChange: (params?: any) => any;
}

const DemoForm = forwardRef<DemoFormRef, DemoFormProps>(
  ({ onSubmit, onChange }, ref) => {
    const [form] = Form.useForm();

    // 1) 先写方法
    const handleSubmit = (params?: any) => {
      console.log('[DemoForm] 引擎调用 onSubmit', params);
      message.info('DemoForm.onSubmit 被引擎调用');
      const values = form.getFieldsValue();
      onSubmit?.(values);
      return { success: true, message: 'DemoForm.onSubmit 执行成功', values };
    };

    const handleChange = (params?: any) => {
      console.log('[DemoForm] 引擎调用 onChange', params);
      message.info('DemoForm.onChange 被引擎调用');
      onChange?.(params?.allValues || form.getFieldsValue());
      return { success: true, message: 'DemoForm.onChange 执行成功' };
    };

    // 2) 选择暴露哪些
    useExpose(ref, {
      componentName: 'DemoForm',
      displayName: '演示表单',
      category: '表单',
      description: '一个带提交和变更事件的演示表单',
      methods: {
        onSubmit: {
          handler: handleSubmit,
          description: '表单提交事件',
          params: { values: '表单全部字段值', isValid: '是否通过校验' },
        },
        onChange: {
          handler: handleChange,
          description: '表单值变更事件',
          params: { changedFields: '变更的字段及值', allValues: '所有字段值' },
        },
      },
    });

    // 手动提交
    const onFinish = (values: Record<string, any>) => {
      message.success('表单提交');
      onSubmit?.(values);
    };

    return (
      <Form
        form={form}
        onFinish={onFinish}
        layout="vertical"
        style={{ width: 300 }}
      >
        <Form.Item label="用户名" name="username" rules={[{ required: true, message: '请输入用户名' }]}>
          <Input placeholder="请输入用户名" />
        </Form.Item>
        <Form.Item label="邮箱" name="email">
          <Input placeholder="请输入邮箱" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            提交
          </Button>
        </Form.Item>
      </Form>
    );
  }
);

DemoForm.displayName = 'DemoForm';
export default DemoForm;
