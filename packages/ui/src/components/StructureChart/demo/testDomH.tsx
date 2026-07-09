/*
 * @File: 
 * @desc: 
 * @author: heqinghua
 * @date: 2025年09月04日 14:53:08
 * @example: 调用示例
 */
import { StructureChart } from '@chloehe/logic-engine-ui';
import React from 'react';
import { domDataH } from './data/testDomH';

export default () => {
  return (
    <StructureChart
      type={'H'}
      mode={'html'}
      toolbar={true}
      hideParentIcon={true}
      dataSource={domDataH}
    />
  );
};
