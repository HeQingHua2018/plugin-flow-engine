/*
 * @File: 
 * @desc: 
 * @author: heqinghua
 * @date: 2026年06月16日 10:39:29
 * @example: 调用示例
 */
import React from 'react';
import { Drawer } from 'antd';
import DynamicConfigForm from '../../DynamicConfigForm';
import type { Schema } from '../../../types';

interface ConfigDrawerProps {
  open: boolean;
  onClose: () => void;
  title: string | React.ReactNode;
  schema: Schema;
  value: Record<string, any>;
  onChange: (val: Record<string, any>) => void;
  formRef: React.RefObject<any>;
  renderFooter?: () => React.ReactNode;
  [key: string]: any;
}

const ConfigDrawer: React.FC<ConfigDrawerProps> = ({
  open,
  onClose,
  title,
  schema,
  value,
  onChange,
  formRef,
  renderFooter,
  ...rest
}) => {
  return (
    <Drawer
      open={open}
      onClose={onClose}
      width={420}
      title={title}
      rootStyle={{ position: 'absolute', zIndex: 10 }}
      getContainer={() => document.getElementById('flow-box') || document.body}
      destroyOnHidden
    >
      <DynamicConfigForm
        key={open ? 'active' : 'empty'}
        ref={formRef}
        schema={schema}
        value={value}
        onChange={onChange}
        renderFooter={renderFooter}
        {...rest}
      />
    </Drawer>
  );
};

export default ConfigDrawer;