import React, { forwardRef, useState } from "react";
import { Card, message, Tag } from "antd";
import { useExpose } from '@chloehe/logic-engine-react';

interface DemoProps {
  [key: string]: any;
}

export interface Demo2Ref {
  showOther: (params?: Record<string, any>) => Promise<string>;
  end: (params?: Record<string, any>) => void;
}

const Demo2 = forwardRef<Demo2Ref, DemoProps>((props, ref) => {
  const [status, setStatus] = useState("pending");

  const showOther = (params?: Record<string, any>): Promise<string> => {
    console.log('Demo2: showOther方法被调用，参数:', params);
    return new Promise((resolve) => {
      setTimeout(() => {
        setStatus("active");
        console.log('Demo2: 状态已更新为 "active"');
        resolve("showOther方法被调用");
      }, 1000);
    });
  };

  const end = (params?: Record<string, any>) => {
    console.log('Demo2: end方法被调用，当前状态:', status, '参数:', params);
    setStatus("end");
    console.log('Demo2: 状态已更新为 "end"');
  };

  useExpose(ref, {
    componentName: 'Demo2',
    displayName: '组件Demo2',
    category: '通用',
    description: '演示组件，展示状态管理和异步操作',
    methods: {
      showOther: {
        handler: showOther,
        description: '显示其他内容',
        params: { message: '消息内容' },
      },
      end: {
        handler: end,
        description: '结束流程',
        params: { msg: '结束消息' },
      },
      showMsg: {
        handler: (params?: Record<string, any>) => {
          message.info(params?.msg || "默认提示信息");
        },
        description: '显示提示消息',
        params: { msg: '提示信息' },
      },
      showTip: {
        handler: (params?: Record<string, any>) => {
          return new Promise((resolve) => {
            setTimeout(() => {
              message.info(params?.msg || "并行");
              resolve(params?.msg || "并行");
            }, 2000);
          });
        },
        description: '显示异步提示',
        params: { msg: '提示消息' },
      },
      merge: {
        handler: () => {
          message.info("执行了聚合节点了");
        },
        description: '执行聚合逻辑',
      },
    },
  });

  return (
    <div>
      <Card
        title="组件Demo2"
        style={{ maxWidth: "500px", marginBottom: 12 }}
        extra={<Tag color="blue">组件ID: {Demo2.displayName}</Tag>}
      >
        我是另外一个 Demo2 组件
        <div>
          {status}
          状态：<Tag color={status === "pending" ? "orange" : status === "active" ? "green" : status === "end" ? "blue" : "default"}>{status}</Tag>
        </div>
      </Card>
    </div>
  );
});

Demo2.displayName = "Demo2";

export default Demo2;