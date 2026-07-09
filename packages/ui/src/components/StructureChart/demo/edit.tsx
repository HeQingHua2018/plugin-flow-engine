/*
 * @File: 
 * @desc: 
 * @author: heqinghua
 * @date: 2025年09月04日 14:53:08
 * @example: 调用示例
 */
import { StructureChart } from '@chloehe/logic-engine-ui';
import { random } from 'lodash';
import React from 'react';
import { editData } from './data/edit';
import './test.less';

export default () => {
  return (
    <StructureChart
      type={'TB'}
      edit={true}
      endArrow={'show'}
      request={() => {
        return new Promise((resolve) => {
          resolve(editData);
        });
      }}
      onNodeAdd={(model) => {
        return {
          id: `${random(1000)}`,
          skin: 'red',
          title: `新增节点-${model.id}-${random(1000)}`,
          hideIcon: (model?.depth ?? 0) >= 3,
          label: '全资100%',
        };
      }}
      onNodeClick={(model, callback) => {
        model.title = `节点数据修改-${model.id}-${random(1000)}`;
        callback(model);
      }}
      // onNodeClick={(model)=>{
      //     console.log('节点点击----->', model);
      // }}
    />
  );
};
