/*
 * @File: KeyValueEditor
 * @desc: 键值对编辑器控件
 * @author: heqinghua
 * @date: 2025年08月12日 13:51:08
 * @example: 调用示例
 */
import React, { useState, useEffect } from 'react';
import { Input, Button, Row, Col } from 'antd';
import type { WidgetProps } from './BaseWidgetProps';

type KeyValuePair = { key: string; value: string };

type KeyValueEditorProps = WidgetProps<KeyValuePair[], Record<string, any>>;

const KeyValueEditor: React.FC<KeyValueEditorProps> = ({ value, onChange }: KeyValueEditorProps) => {
  const [pairs, setPairs] = useState<KeyValuePair[]>(value ?? [{ key: '', value: '' }]);

  useEffect(() => {
    if (value) setPairs(value);
  }, [value]);

  const handleKeyChange = (index: number, key: string) => {
    const newPairs = [...pairs];
    newPairs[index].key = key;
    setPairs(newPairs);
    onChange(newPairs);
  };

  const handleValueChange = (index: number, val: string) => {
    const newPairs = [...pairs];
    newPairs[index].value = val;
    setPairs(newPairs);
    onChange(newPairs);
  };

  const addPair = () => {
    const newPairs = [...pairs, { key: '', value: '' }];
    setPairs(newPairs);
    onChange(newPairs);
  };

  const removePair = (index: number) => {
    if (pairs.length <= 1) return;
    const newPairs = pairs.filter((_, i) => i !== index);
    setPairs(newPairs);
    onChange(newPairs);
  };

  return (
    <div style={{ marginTop: 8 }}>
      {pairs.map((pair, index) => (
        <Row key={index} gutter={[8, 8]} align="middle" style={{ marginBottom: 12 }}>
          <Col flex="1">
            <Input
              placeholder="键"
              value={pair.key}
              onChange={(e) => handleKeyChange(index, e.target.value)}
              style={{ borderRadius: 4 }}
            />
          </Col>
          <Col flex="1">
            <Input
              placeholder="值"
              value={pair.value}
              onChange={(e) => handleValueChange(index, e.target.value)}
              style={{ borderRadius: 4 }}
            />
          </Col>
          <Col>
            <Button
              type="default"
              danger
              size="small"
              onClick={() => removePair(index)}
              disabled={pairs.length <= 1}
            >
              - 移除
            </Button>
          </Col>
        </Row>
      ))}
      <Button type="primary" size="small" onClick={addPair} style={{ marginTop: 8 }}>
        + 添加参数
      </Button>
    </div>
  );
};

export default KeyValueEditor;