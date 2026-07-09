/*
 * @File: EventConfig.tsx
 * @desc: 事件配置组件 - 级联选择器（全局/组件/windows）+ 参数输入
 * @author: heqinghua
 * @date: 2025年11月03日 16:11:31
 */
import React, { useState, useEffect, useMemo } from 'react';
import { Cascader, Input, Typography, Tag, Space } from 'antd';
import type { WidgetProps } from '../types';

import { getGlobalComponentManager } from '@chloehe/logic-engine-common';
import type { InstanceRegistration, GlobalMethodRegistration } from '@chloehe/logic-engine-common';

const { Text } = Typography;

type EventPair = { event?: string; type?: string; params: any };
type EventConfigProps = WidgetProps<EventPair>;
type CascaderOption = { value: string; label: string; children?: CascaderOption[]; isLeaf?: boolean };

const EventConfig: React.FC<EventConfigProps> = ({ value, onChange }: EventConfigProps) => {
  const valueObj = value || {};
  const event = valueObj.event || valueObj.type || '';
  const params = valueObj.params;
  // 字符串参数直接显示，非字符串用 JSON.stringify 格式化
  const [paramsInput, setParamsInput] = useState<string>(
    params !== undefined && params !== null
      ? (typeof params === 'string' ? params : JSON.stringify(params))
      : ''
  );

  // 只当事件选择变化时重置参数输入框
  useEffect(() => {
    setParamsInput(
      params !== undefined && params !== null
        ? (typeof params === 'string' ? params : JSON.stringify(params))
        : ''
    );
  }, [event]);

  const options: CascaderOption[] = useMemo(() => {
    const compManager = getGlobalComponentManager();

    // ---- 一级：全局方法 ----
    const globalMethods = compManager.getAllGlobalMethods();
    const globalChildren: CascaderOption[] = globalMethods.map((m: GlobalMethodRegistration) => ({
      value: m.name, label: `${m.name}${m.description ? ` - ${m.description}` : ''}`,
    }));

    // ---- 二级：组件事件（从 EventPool 读取）----
    const allEvents = compManager.getAllEvents();
    const componentChildren: CascaderOption[] = allEvents.map((comp) => ({
      value: comp.componentName,
      label: comp.displayName,
      children: comp.events.map((evt) => ({
        value: evt.eventName,
        label: `${evt.eventName}${evt.description ? ` (${evt.description})` : ''}${evt.params ? ` [参数: ${Object.keys(evt.params).join(', ')}]` : ''}`,
        isLeaf: true,
      })),
    }));

    // ---- 三级：Window 方法（白名单，仅暴露安全方法）----
    let windowChildren: CascaderOption[] = [];
    if (typeof window !== 'undefined') {
      const safeMethods: Record<string, string> = {
        alert: '弹出警告框',
        confirm: '弹出确认框',
        prompt: '弹出输入框',
      };
      windowChildren = Object.keys(safeMethods)
        .filter((p) => typeof (window as any)[p] === 'function')
        .map((p) => ({ value: p, label: `${p} - ${safeMethods[p]}` }));
    }

    return [
      {
        value: 'global',
        label: `全局方法${globalChildren.length > 0 ? ` (${globalChildren.length})` : ' (暂无)'}`,
        children: globalChildren.length > 0 ? globalChildren : [{ value: '__empty', label: '暂无可用全局方法' }],
      },
      {
        value: 'component',
        label: `组件事件${componentChildren.length > 0 ? ` (${componentChildren.length}个组件)` : ' (暂无)'}`,
        children: componentChildren.length > 0 ? componentChildren : [{ value: '__empty', label: '暂无已注册的组件事件' }],
      },
      {
        value: 'window',
        label: `Window方法${windowChildren.length > 0 ? ` (${windowChildren.length})` : ' (暂无)'}`,
        children: windowChildren.length > 0 ? windowChildren : [{ value: '__empty', label: '暂无可用Window方法' }],
      },
    ];
  }, []);

  // 将 event 值拆分为级联路径（如 "DemoButton.onClick" → ["component", "DemoButton", "onClick"]）
  const cascaderValue = useMemo(() => {
    if (!event) return undefined;
    if (event.startsWith('global.')) return ['global', event.replace('global.', '')];
    if (event.startsWith('window.')) return ['window', event.replace('window.', '')];
    if (event.includes('.')) {
      const parts = event.split('.');
      if (parts.length === 2) return ['component', parts[0], parts[1]];
    }
    return undefined;
  }, [event]);

  return (
    <div>
      <div style={{ marginBottom: 8 }}>
        <Text type="secondary" style={{ fontSize: 12, marginBottom: 4, display: 'block' }}>
          选择事件/方法
        </Text>
        <Cascader
          options={options}
          placeholder="请选择分类 → 组件/方法 → 事件"
          value={cascaderValue}
          onChange={(val: any) => {
            if (!val || val.length === 0) {
              onChange?.({ type: '', params: params !== undefined ? params : {} });
              return;
            }
            const category = val[0];
            let fullPath = '';
            if (category === 'global' && val[1]) fullPath = `global.${val[1]}`;
            else if (category === 'window' && val[1]) fullPath = `window.${val[1]}`;
            else if (category === 'component' && val[1] && val[2]) fullPath = `${val[1]}.${val[2]}`;
            if (fullPath) onChange?.({ type: fullPath, params: params !== undefined ? params : {} });
          }}
          fieldNames={{ label: 'label', value: 'value', children: 'children' }}
          showSearch
          changeOnSelect={false}
          expandTrigger="hover"
          style={{ width: '100%' }}
          notFoundContent="未找到匹配项"
        />
      </div>

      {event && (
        <div style={{ marginBottom: 8 }}>
          <Tag color="blue">{event}</Tag>
        </div>
      )}

      <div>
        <Text type="secondary" style={{ fontSize: 12, marginBottom: 4, display: 'block' }}>
          事件参数（JSON格式）
        </Text>
        <Input.TextArea
          placeholder='参数值，支持数字、字符串、JSON等'
          value={paramsInput}
          onChange={(e) => {
            const raw = e.target.value;
            setParamsInput(raw);
            // 不校验 JSON，直接传给表单，支持任意类型参数
            try {
              const parsed = raw.trim() ? JSON.parse(raw) : raw;
              onChange?.({ type: event || '', params: parsed });
            } catch {
              // 非 JSON 格式，原样传字符串
              onChange?.({ type: event || '', params: raw });
            }
          }}
          autoSize={{ minRows: 2, maxRows: 5 }}
        />
      </div>
    </div>
  );
};

export default EventConfig;
