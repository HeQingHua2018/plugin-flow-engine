/*
 * @File: KeyValueEditor
 * @desc: 键值对编辑器控件
 * @author: heqinghua
 * @date: 2025年08月12日 13:51:08
 * @example: 调用示例
 */
import React from 'react';
import { Input, Button, Space } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import type { WidgetProps } from './BaseWidgetProps';

type KeyValuePair = { key: string; value: string };

type KeyValueEditorProps = WidgetProps<KeyValuePair[], Record<string, any>>;

const KeyValueEditor: React.FC<KeyValueEditorProps> = ({ value, onChange }: KeyValueEditorProps) => {
  const pairs: KeyValuePair[] = Array.isArray(value) ? value : [];

  const handleKeyChange = (index: number, key: string) => {
    const next = pairs.map((p, i) => (i === index ? { ...p, key } : p));
    onChange(next);
  };

  const handleValueChange = (index: number, val: string) => {
    const next = pairs.map((p, i) => (i === index ? { ...p, value: val } : p));
    onChange(next);
  };

  const addPair = () => {
    onChange([...pairs, { key: '', value: '' }]);
  };

  const removePair = (index: number) => {
    const next = pairs.filter((_, i) => i !== index);
    onChange(next);
  };

  // 校验：键必填且唯一
  const normalizedKeys = pairs.map((p) => (p.key || '').trim());
  const keyCounts = normalizedKeys.reduce<Record<string, number>>((acc, k) => {
    if (!k) return acc;
    acc[k] = (acc[k] || 0) + 1;
    return acc;
  }, {});
  const duplicateKeys = new Set(Object.keys(keyCounts).filter((k) => keyCounts[k] > 1));
  const hasEmptyKey = normalizedKeys.some((k) => !k);

  const isKeyError = (key?: string) => {
    const k = (key || '').trim();
    if (!k) return true;
    if (duplicateKeys.has(k)) return true;
    return false;
  };

  return (
    <div style={{ marginTop: 8 }}>
      <Space direction="vertical" style={{ width: '100%' }} size={8}>
        {pairs.map((pair, index) => (
          <div key={index} style={{ display: 'flex', gap: 8, width: '100%' }}>
            <Input
              placeholder="键（必填且唯一）"
              allowClear
              size="small"
              value={pair.key}
              status={isKeyError(pair.key) ? 'error' : undefined}
              onChange={(e) => handleKeyChange(index, e.target.value)}
              style={{ flex: '1 1 0' }}
            />
            <Input
              placeholder="值"
              allowClear
              size="small"
              value={pair.value}
              onChange={(e) => handleValueChange(index, e.target.value)}
              style={{ flex: '1 1 0' }}
            />
            <Button
              type="text"
              danger
              size="small"
              icon={<MinusCircleOutlined />}
              onClick={() => removePair(index)}
              style={{ minWidth: 0, width: 24, height: 24, padding: 0 }}
              aria-label="移除一项"
            />
          </div>
        ))}
        <Button type="dashed" size="small" onClick={addPair} icon={<PlusOutlined />}>添加参数</Button>
        {(hasEmptyKey || duplicateKeys.size > 0) && (
          <div style={{ color: '#ff4d4f', fontSize: 12 }}>
            键必填且唯一：
            {hasEmptyKey && <span>存在空键；</span>}
            {duplicateKeys.size > 0 && (
              <span>重复键：{Array.from(duplicateKeys).join(', ')}</span>
            )}
          </div>
        )}
      </Space>
    </div>
  );
};

export default KeyValueEditor;