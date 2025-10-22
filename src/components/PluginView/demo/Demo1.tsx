/* eslint-disable @typescript-eslint/no-unused-expressions */
/*
 * @File: 
 * @desc: 
 * @author: heqinghua
 * @date: 2025年09月18日 09:28:42
 * @example: 调用示例
 */
import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import { Form, Input, Button, Checkbox, Card, Tag, message } from "antd";


/**
 * 使用方法注册中心与规则引擎交互的组件
 */
interface Demo1Props {
  initialValues?: Record<string, any>;
  updateVariables?: (variables: Record<string, any>) => void;
}

export interface Demo1Ref {
  showEmail: (params: Record<string, any>) => void;
  requireEmail: (params: Record<string, any>) => void;
  trigger: (params: Record<string, any>) => void;
  setFormValue: (params: Record<string, any>) => any;
  getData: () => Record<string, any>;
}

const Demo1 = forwardRef<Demo1Ref, Demo1Props>((props, ref) => {
  const [form] = Form.useForm();
  const [showEmail, setShowEmail] = useState(false);
  const [requireEmail, setRequireEmail] = useState(false);
  // 显示邮箱
  const handleShowEmail = (params: Record<string, any>) => {
    console.log(`显示邮箱:`, params);
    
    setShowEmail(params.show);
  };

  // 设置邮箱必填
  const handleRequireEmail = (params: Record<string, any>) => {
    console.log(`设置邮箱必填:`, params);
    setRequireEmail(params.required);
  };

  // 触发器执行事件
  const handleTrigger = (params: Record<string, any>) => {
    console.log(`触发器:`, params.message);
    message.info("满足条件开始执行");
  };

  // 设置表单值
  const handleSetFormValue = (params: Record<string, any>) => {
    if (params && typeof params.field === "string") {
      console.log(`设置表单字段:`, params.field, "为", params.value);

      // 同步更新表单
      form.setFieldValue(params.field, params.value);
      return {
        [params.field]: params.value,
      };
    }
  };

  // 获取当前表单数据
  const getData = () => {
    return form.getFieldsValue();
  };

  // 处理表单提交
  const handleSubmit = () => {
    form.validateFields().then((values) => {
      console.log(`表单提交:`, values);
      // 同步到上下文管理器
      if (props.updateVariables) {
        props.updateVariables(values);
      }
    });
  };

  // 自定义表单验证规则
  const validateUsername = (_rule: any, value: string) => {
    if (!value || value.length < 3) {
      return Promise.reject(new Error("用户名至少需要3个字符"));
    }
    return Promise.resolve();
  };

  const validatePassword = (_rule: any, value: string) => {
    if (!value || value.length < 6) {
      return Promise.reject(new Error("密码至少需要6个字符"));
    }
    return Promise.resolve();
  };

  const validateEmail = (_rule: any, value: string) => {
    if (requireEmail && !value) {
      return Promise.reject(new Error("邮箱为必填项"));
    }
    if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return Promise.reject(new Error("邮箱格式不正确"));
    }
    return Promise.resolve();
  };

  // 使用useImperativeHandle暴露方法给父组件
  useImperativeHandle(ref, () => ({
    showEmail: handleShowEmail,
    requireEmail: handleRequireEmail,
    trigger: handleTrigger,
    setFormValue: handleSetFormValue,
    getData,
    showTip:(params:any)=>{
       return new Promise((resolve) => {
          setTimeout(()=>{
            message.info(params?.msg || "Demo1并行")
            // reject(new Error('模拟异常Demo1'))
            resolve(params?.msg || "Demo1并行")
          },1000)
        })
    }
  }));
  useEffect(()=>{
    props.initialValues && form.setFieldsValue(props.initialValues);
  },[props.initialValues])
  return (
    <Card
      title="组件Demo1"
      style={{ maxWidth: "500px" ,marginBottom: 12}}
      extra={<Tag color="blue">组件ID: {Demo1.displayName}</Tag>}
    >
      <Form
        form={form}
        layout="vertical"
        style={{marginBottom: 12}}
        onValuesChange={(changedValues, allValues) => {
          // 只在有实际变化时更新上下文
          if (Object.keys(changedValues).length > 0) {
            console.log('表单值变化:', changedValues, '全部值:', allValues);
            if (props.updateVariables) {
              props.updateVariables(allValues);
            }
          }
        }}
      >
        <Form.Item
          name="username"
          label="用户名"
          rules={[{ required: true, validator: validateUsername }]}
        >
          <Input placeholder="请输入用户名" autoComplete="off" />
        </Form.Item>

        <Form.Item
          name="password"
          label="密码"
          rules={[{ required: true, validator: validatePassword }]}
        >
          <Input.Password placeholder="请输入密码" autoComplete="off" />
        </Form.Item>

        {showEmail && (
          <Form.Item
            name="email"
            label="邮箱"
            rules={[{ required: requireEmail, validator: validateEmail }]}
          >
            <Input placeholder="请输入邮箱" autoComplete="off" />
          </Form.Item>
        )}

        <Form.Item
          name="agreeTerms"
          valuePropName="checked"
          rules={[{ required: true, message: "请同意服务条款" }]}
        >
          <Checkbox>我同意服务条款</Checkbox>
        </Form.Item>

        <Form.Item>
          <Button type="primary" onClick={handleSubmit}>
            提交
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
});
Demo1.displayName = "Demo1";
export default Demo1;
