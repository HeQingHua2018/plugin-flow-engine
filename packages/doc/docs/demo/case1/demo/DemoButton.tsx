/*
 * @File: DemoButton.tsx
 * @desc: 先写方法，后选择暴露 — 手动点击 & 引擎调用走同一个方法
 */
import React, { forwardRef, useState } from 'react';
import { Button, message } from 'antd';
import { useExpose } from '@chloehe/logic-engine-react';

interface DemoButtonProps {
  label?: string;
}

export interface DemoButtonRef {
  onClick: (params?: any) => any;
}

const DemoButton = forwardRef<DemoButtonRef, DemoButtonProps>(
  ({ label = 'Demo 按钮', }, ref) => {
    const [labelTxt,setLabel] = useState(label);
    // 1) 先写方法（只写一次，手动 && 引擎都用它）
    const handleClick = (params={}) => {
      console.log('[DemoButton] 执行 onClick', params);
      message.info(`DemoButton.onClick 被引擎调用 ${JSON.stringify(params)}`);
    };

    const handleSetLabel = (params?: any) => {
      console.log('[DemoButton] 执行 setLabel', params);
      debugger;
      setLabel(params?.label || 'Demo 按钮');
    };

    // 2) 选择暴露哪些方法给引擎
    useExpose(ref, {
      componentName: 'DemoButton',
      displayName: '演示按钮',
      category: '通用',
      description: '一个带点击事件的演示按钮',
      methods: {
        onClick: {
          handler: handleClick,
          description: '按钮点击事件',
          params: { key: '点击的按钮标识', timestamp: '点击时间戳' },
        },
        setLabel: {
          handler: handleSetLabel,
          description: '更新按钮文本',
          params: { label: '新文本' },
        }
      },
    });

    // 3) 手动点击也用同一个方法
    return (
      <Button type="primary" onClick={() => handleClick()}>
        {labelTxt}
      </Button>
    );
  }
);

DemoButton.displayName = 'DemoButton';
export default DemoButton;
