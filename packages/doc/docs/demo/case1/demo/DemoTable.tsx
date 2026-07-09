/*
 * @File: DemoTable.tsx
 * @desc: 测试用业务组件 — 表格
 * useExpose 一步完成：注册 + 暴露
 */
import React, { forwardRef } from 'react';
import { Table, Tag, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useExpose } from '@chloehe/logic-engine-react';

interface DataRecord {
  key: string;
  name: string;
  age: number;
  status: string;
}

interface DemoTableProps {
  onRowClick?: (record: DataRecord) => void;
  onRowSelect?: (keys: string[], rows: DataRecord[]) => void;
}

export interface DemoTableRef {
  onRowClick: (params?: any) => any;
  onRowSelect: (params?: any) => any;
}

const data: DataRecord[] = [
  { key: '1', name: '张三', age: 28, status: 'active' },
  { key: '2', name: '李四', age: 32, status: 'inactive' },
  { key: '3', name: '王五', age: 25, status: 'active' },
];

const columns: ColumnsType<DataRecord> = [
  { title: '姓名', dataIndex: 'name', key: 'name' },
  { title: '年龄', dataIndex: 'age', key: 'age' },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    render: (s: string) => (
      <Tag color={s === 'active' ? 'green' : 'default'}>{s}</Tag>
    ),
  },
];

const DemoTable = forwardRef<DemoTableRef, DemoTableProps>(
  ({ onRowClick, onRowSelect }, ref) => {
    // 1) 先写方法
    const handleRowClick = (params?: any) => {
      console.log('[DemoTable] 引擎调用 onRowClick', params);
      message.info('DemoTable.onRowClick 被引擎调用');
      onRowClick?.(params?.record || data[0]);
      return { success: true, message: 'DemoTable.onRowClick 执行成功' };
    };

    const handleRowSelect = (params?: any) => {
      console.log('[DemoTable] 引擎调用 onRowSelect', params);
      message.info('DemoTable.onRowSelect 被引擎调用');
      onRowSelect?.(params?.selectedKeys || [], params?.selectedRows || []);
      return { success: true, message: 'DemoTable.onRowSelect 执行成功' };
    };

    // 2) 选择暴露哪些
    useExpose(ref, {
      componentName: 'DemoTable',
      displayName: '演示表格',
      category: '数据展示',
      description: '一个带行点击和选择事件的演示表格',
      methods: {
        onRowClick: {
          handler: handleRowClick,
          description: '行点击事件',
          params: { record: '点击行的数据', index: '行索引' },
        },
        onRowSelect: {
          handler: handleRowSelect,
          description: '行选择事件',
          params: { selectedKeys: '选中行的key数组', selectedRows: '选中行的数据数组' },
        },
      },
    });

    return (
      <Table
        dataSource={data}
        columns={columns}
        size="small"
        onRow={(record) => ({
          onClick: () => onRowClick?.(record),
        })}
        rowSelection={{
          type: 'checkbox',
          onChange: (keys, rows) => onRowSelect?.(keys as string[], rows),
        }}
        pagination={false}
      />
    );
  }
);

DemoTable.displayName = 'DemoTable';
export default DemoTable;
