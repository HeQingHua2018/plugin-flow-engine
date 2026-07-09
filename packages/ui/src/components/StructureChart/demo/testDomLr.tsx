/*
 * @File: 
 * @desc: 
 * @author: heqinghua
 * @date: 2025年09月04日 14:53:08
 * @example: 调用示例
 */
import { StructureChart } from '@chloehe/logic-engine-ui';
import React from 'react';
import { domDataLr } from './data/testDomLr';

export default () => {
  return (
    <StructureChart
      type={'LR'}
      mode={'html'}
      width={320}
      height={178}
      toolbar={true}
      endArrow={'show'}
      dataSource={domDataLr}
    />
  );
};
