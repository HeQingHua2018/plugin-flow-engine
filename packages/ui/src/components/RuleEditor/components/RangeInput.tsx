/*
 * @File: 
 * @desc: 
 * @author: heqinghua
 * @date: 2025年11月04日 14:52:38
 * @example: 调用示例
 */
import React from 'react';
import { InputNumber } from 'antd';

interface RangeInputProps {
  value?: (string | number)[];
  onChange: (value: (string | number)[]) => void;
  fieldProps?: any;
}

/**
 * 范围输入组件，用于输入数值范围
 * 提供两个输入框，用于输入范围的起始值和结束值
 */
const RangeInput: React.FC<RangeInputProps> = (props) => {
  const { value = [], onChange, fieldProps = {} } = props;
  
  // 确保value是数组，并且有两个元素
  const safeValue = Array.isArray(value) ? value : [];
  const startValue = safeValue[0] !== undefined ? safeValue[0] : "";
  const endValue = safeValue[1] !== undefined ? safeValue[1] : "";
  
  const handleStartChange = (val: any) => {
    onChange([val, endValue]);
  };
  
  const handleEndChange = (val: any) => {
    onChange([startValue, val]);
  };
  
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <InputNumber {...fieldProps} placeholder='起始数' value={startValue} onChange={handleStartChange} />
      <span>~</span>
      <InputNumber {...fieldProps} placeholder='结束数' value={endValue} onChange={handleEndChange} />
    </div>
  );
};

export default RangeInput;