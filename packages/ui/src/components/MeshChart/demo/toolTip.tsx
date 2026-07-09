import { MeshChart } from '@chloehe/logic-engine-ui';
import React from 'react';
import { gridData } from './data';

export default () => {
  return (
    <MeshChart
      toolbar={true}
      request={(params) => {
        console.log('params', params);
        return new Promise((resolve) => {
          resolve(gridData);
        });
      }}
      /* 图表图例 */
      legend={{
        node: [
          { label: '一级公司', color: '#F54640' },
          { label: '二级公司', color: '#FFA219' },
          { label: '三级公司', color: '#49C248' },
          { label: '四级公司', color: '#1D76FE' },
          { label: '五级公司', color: '#6F40F5' },
          { label: '六级公司', color: '#909399' },
        ],
        edge: [
          { label: '全资', color: '#FDA523' },
          { label: '控股', color: '#49C248' },
          { label: '参股', color: '#1D76FE' },
        ],
      }}
      tooltip={(nodeData) => {
        const { category, title } = nodeData;
        return `<div class="treeChartTest">
                            <div class="label">${title}</div>
                            <div class="tag">${category}</div>
                        </div>`;
      }}
    />
  );
};
