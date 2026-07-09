import type { WidgetMap } from '../../types';
import React from 'react';
import defaultWidgets from '../../widget/defaultWidget';
import { Input } from 'antd';

interface FormWidgetInjectorInterface {
  injectWidget(type: string, widget: React.ElementType<any>): void;
  injectWidgets(widgets: WidgetMap): void;
  getWidgets(): Record<string, React.ElementType<any>>;
  subscribe(callback: () => void): () => void;
}

class FormWidgetInjector implements FormWidgetInjectorInterface {
  private widgets: Record<string, React.ElementType<any>> = {};
  private subscribers: Array<() => void> = [];

  private notifySubscribers(): void {
    this.subscribers.forEach(callback => callback());
  }

  constructor(initialWidgets: Record<string, React.ElementType<any>> = {}) {
    this.widgets = { ...defaultWidgets, ...initialWidgets };
  }

  injectWidget(type: string, widget: React.ElementType<any>): void {
    this.widgets[type] = widget;
    this.notifySubscribers();
  }
  
  injectWidgets(widgets: WidgetMap): void {
    this.widgets = { ...this.widgets, ...widgets };
    this.notifySubscribers();
  }

  getWidgets(): Record<string, React.ElementType<any>> {
    return { ...this.widgets };
  }

  subscribe(callback: () => void): () => void {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter(cb => cb !== callback);
    };
  }
}

let injector: FormWidgetInjector | null = null;
const warnedKeys = new Set<string>();

export function initializeInjector(
  initialWidgets: Record<string, React.ElementType<any>> = {}
): FormWidgetInjector {
  if (!injector) {
    injector = new FormWidgetInjector(initialWidgets);
  }
  return injector;
}

export function getInjector(): FormWidgetInjector {
  if (!injector) {
    initializeInjector();
  }
  return injector as FormWidgetInjector;
}

export function injectWidget(type: string, widget: React.ElementType<any>): void {
  getInjector().injectWidget(type, widget);
}

export function injectWidgets(widgets: WidgetMap): void {
  getInjector().injectWidgets(widgets);
}

export function getWidgets(): Record<string, React.ElementType<any>> {
  return getInjector().getWidgets();
}

export function getWidgetByType(type: string, widget?: string): React.ElementType<any> {
  const injectedWidgets = getInjector().getWidgets();
  const rawKey = widget || type;

  const candidates = [
    rawKey,
  ].filter(Boolean) as string[];

  for (const key of candidates) {
    if (injectedWidgets[key]) return injectedWidgets[key];
  }

  const warnKey = candidates[0] || rawKey;
  if (process.env.NODE_ENV !== 'production' && !warnedKeys.has(warnKey)) {
    const source = widget ? `widget:"${widget}"` : `type:"${type}"`;
    console.warn(`[Widgets] 未找到控件映射: ${source}（尝试: ${candidates.join(', ')}），将回退到 ant_Input 或 Input`);
    warnedKeys.add(warnKey);
  }
  if (injectedWidgets['ant_Input']) return injectedWidgets['ant_Input'];
  const FallbackInput: React.ElementType<any> = (props: any) => {
    const { value, onChange, ...rest } = props || {};
    return React.createElement(Input as any, {
      value,
      onChange: (e: any) => onChange && onChange(e?.target?.value),
      ...rest,
    });
  };
  return FallbackInput;
}