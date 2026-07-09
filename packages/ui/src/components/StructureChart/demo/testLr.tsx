import { StructureChart } from '@chloehe/logic-engine-ui';
import React from 'react';
import { treeDataLr } from './data/testLr';

export default () => {
  return (
    <StructureChart
      type={'LR'}
      toolbar={true}
      endArrow={'show'}
      request={(params) => {
        console.log(params);
        return new Promise((resolve) => {
          resolve(treeDataLr);
        });
      }}
    />
  );
};
