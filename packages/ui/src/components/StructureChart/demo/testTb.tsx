/*
 * @File: 
 * @desc: 
 * @author: heqinghua
 * @date: 2025年09月04日 14:53:08
 * @example: 调用示例
 */
import { StructureChart } from '@chloehe/logic-engine-ui';
import React from 'react';
import { treeDataTb } from './data/testTb';
import './test.less';

export default () => {
  return (
    <StructureChart
      type={'TB'}
      toolbar={true}
      endArrow={'show'}
      request={(params) => {
        console.log(params);
        return new Promise((resolve) => {
          resolve(treeDataTb);
        });
      }}
      tooltip={(nodeData) => {
        return `<div class="treeChartTest">
                            <div class="label">${nodeData.title}</div>
                            <div class="tag">一级公司</div>
                            <div class="text">法定代表人：<span>张三</span></div>
                            <div class="text">注册资本：<span>234万元人民币</span></div>
                            <div class="text">成立日期：<span>2021-09-09</span></div>
                        </div>`;
      }}
    />
  );
};
