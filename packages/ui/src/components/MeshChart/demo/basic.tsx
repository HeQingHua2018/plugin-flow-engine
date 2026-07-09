/*
 * @File: MeshChart
 * @title: 网格图表
 * @desc: 基本网格图表组件
 * @author: heqinghua
 * @date: 2025年09月04日 14:53:07
 * @example: 调用示例
 */
import { MeshChart } from '@chloehe/logic-engine-ui';
import { gridData } from './data';

export default () => {
  return (
    <MeshChart
      toolbar={{
        onDownload: (url) => {
          console.log('onDownload', url);
        },
      }}
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
      onNodeClick={(e) => {
        console.log('onNodeClick', e);
      }}
    />
  );
};
