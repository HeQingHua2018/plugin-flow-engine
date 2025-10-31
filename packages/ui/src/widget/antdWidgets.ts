/*
 * Antd 默认数据录入组件映射（统一 value/onChange 适配）
 * 使用 ant_ 前缀，子组件以 . 分隔，如 ant_Input.Search、ant_DatePicker.RangePicker
 */
import React from 'react';
import {
  Input,
  InputNumber,
  Select,
  Checkbox,
  Radio,
  Switch,
  DatePicker,
  TimePicker,
  Slider,
  Cascader,
  TreeSelect,
  Rate,
  AutoComplete,
  Mentions,
  Upload,
  Transfer,
  ColorPicker,
} from 'antd';

const prefix = 'ant_';

/**
 * Ant Design 组件映射，包含 Input、InputNumber、Select、Checkbox、Radio、Switch、DatePicker、TimePicker、Slider、Cascader、TreeSelect、Rate、AutoComplete、Mentions、Upload、Transfer、ColorPicker 等组件
 */
const antdWidgets: Record<string, React.ElementType<any>> = {
  // Input 系列
  [prefix + 'Input']: ({ value, onChange, ...props }: any) => (
    React.createElement(Input, { value, onChange: (e: any) => onChange(e.target.value), ...props })
  ),
  [prefix + 'Input.Password']: ({ value, onChange, ...props }: any) => (
    React.createElement(Input.Password as any, { value, onChange: (e: any) => onChange(e.target.value), ...props })
  ),
  [prefix + 'Input.TextArea']: ({ value, onChange, ...props }: any) => (
    React.createElement(Input.TextArea as any, { value, onChange: (e: any) => onChange(e.target.value), ...props })
  ),
  [prefix + 'Input.Search']: ({ value, onChange, ...props }: any) => (
    React.createElement(Input.Search as any, {
      value,
      onChange: (e: any) => onChange(e.target.value),
      onSearch: (v: any) => onChange(v),
      ...props,
    })
  ),

  // 数字输入
  [prefix + 'InputNumber']: ({ value, onChange, ...props }: any) => (
    React.createElement(InputNumber, { value, onChange: (v: any) => onChange(v), style: { width: '100%' }, ...props })
  ),

  // 选择器
  [prefix + 'Select']: ({ value, onChange, options = [], ...props }: any) => (
    React.createElement(
      Select,
      { value, onChange: (v: any) => onChange(v), style: { width: '100%' }, ...props },
      (options || []).map((opt: any) => React.createElement((Select as any).Option, { key: opt.value, value: opt.value }, opt.label))
    )
  ),

  // 复选框
  [prefix + 'Checkbox']: ({ value, onChange, ...props }: any) => (
    React.createElement(Checkbox, { checked: !!value, onChange: (e: any) => onChange(e.target.checked), ...props })
  ),
  [prefix + 'Checkbox.Group']: ({ value, onChange, options = [], ...props }: any) => (
    React.createElement(Checkbox.Group as any, { value, onChange: (vals: any) => onChange(vals), options, ...props })
  ),

  // 单选框
  [prefix + 'Radio.Group']: ({ value, onChange, options = [], ...props }: any) => (
    React.createElement(
      Radio.Group,
      { value, onChange: (e: any) => onChange(e.target.value), ...props },
      (options || []).map((opt: any) => React.createElement(Radio, { key: opt.value, value: opt.value }, opt.label))
    )
  ),

  // 开关
  [prefix + 'Switch']: ({ value, onChange, ...props }: any) => (
    React.createElement(Switch, { checked: !!value, onChange: (checked: boolean) => onChange(checked), ...props })
  ),

  // 日期选择器
  [prefix + 'DatePicker']: ({ value, onChange, ...props }: any) => (
    React.createElement(DatePicker, { value, onChange: (d: any) => onChange(d), style: { width: '100%' }, ...props })
  ),
  [prefix + 'DatePicker.RangePicker']: ({ value, onChange, ...props }: any) => (
    React.createElement((DatePicker as any).RangePicker, { value, onChange: (d: any) => onChange(d), style: { width: '100%' }, ...props })
  ),

  // 时间选择器
  [prefix + 'TimePicker']: ({ value, onChange, ...props }: any) => (
    React.createElement(TimePicker, { value, onChange: (t: any) => onChange(t), style: { width: '100%' }, ...props })
  ),

  // 滑块
  [prefix + 'Slider']: ({ value, onChange, ...props }: any) => (
    React.createElement(Slider, { value, onChange: (v: any) => onChange(v), ...props })
  ),

  // 级联、树选择
  [prefix + 'Cascader']: ({ value, onChange, options = [], ...props }: any) => (
    React.createElement(Cascader, { value, onChange: (v: any) => onChange(v), options, ...props })
  ),
  [prefix + 'TreeSelect']: ({ value, onChange, ...props }: any) => (
    React.createElement(TreeSelect, { value, onChange: (v: any) => onChange(v), treeDefaultExpandAll: true, style: { width: '100%' }, ...props })
  ),

  // 评分
  [prefix + 'Rate']: ({ value, onChange, ...props }: any) => (
    React.createElement(Rate, { value, onChange: (v: any) => onChange(v), ...props })
  ),

  // 自动完成、提及
  [prefix + 'AutoComplete']: ({ value, onChange, options = [], ...props }: any) => (
    React.createElement(AutoComplete, { value, onChange: (v: any) => onChange(v), options, style: { width: '100%' }, ...props })
  ),
  [prefix + 'Mentions']: ({ value, onChange, ...props }: any) => (
    React.createElement(Mentions, { value, onChange: (v: any) => onChange(v), ...props })
  ),

  // 上传（默认以 fileList 作为值）
  [prefix + 'Upload']: ({ value, onChange, ...props }: any) => (
    React.createElement(Upload, { fileList: value, onChange: ({ fileList }: any) => onChange(fileList), ...props })
  ),

  // 穿梭框：以 targetKeys 作为 value，dataSource 从 props 获取
  [prefix + 'Transfer']: ({ value, onChange, dataSource = [], ...props }: any) => (
    React.createElement(Transfer, { targetKeys: value, onChange: (keys: any) => onChange(keys), dataSource, ...props })
  ),

  // 颜色选择器：将颜色以 hex 字符串传递
  [prefix + 'ColorPicker']: ({ value, onChange, ...props }: any) => (
    React.createElement(ColorPicker, {
      value,
      onChange: (color: any) => onChange(color?.toHexString?.() || color),
      ...props,
    })
  ),
};
export default antdWidgets;