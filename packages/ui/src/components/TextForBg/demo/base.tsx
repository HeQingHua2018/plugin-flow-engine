/*
 * @File: 
 * @desc: 
 * @author: heqinghua
 * @date: 2025年04月24日 11:35:07
 * @example: 调用示例
 */
import { ColorPicker, Flex, Input } from 'antd';
import { Color } from 'antd/es/color-picker';
import { TextForBg } from '@chloehe/logic-engine-ui';
import React, { useState } from 'react';  
import imageUrl from '../../../assets/text_bg.jpg';

const Base: React.FC = () => {
  const [config, setConfig] = useState({
    imageUrl: imageUrl,
    text: 'HQHUI',
    textColor: '#e56637',
    fontSize: '10em',
    x: '50%',
    y: '50%',
  });

  return (
    <div>
      <Flex style={{ marginBottom: 10 }}>
        <Input
          placeholder="请输入文本"
          defaultValue={config.text}
          onChange={(e) => {
            setConfig({ ...config, text: e.target.value });
          }}
          style={{ width: 200, marginRight: 10 }}
        />
        <ColorPicker
          defaultValue={config.textColor}
          size="large"
          showText
          onChangeComplete={(value: Color): void => {
            setConfig({ ...config, textColor: value.toHexString() });
          }}
        />
      </Flex>
      <TextForBg {...config} />
    </div>
  );
};

export default Base;
