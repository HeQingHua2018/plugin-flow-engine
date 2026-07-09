/*
 * @File: 
 * @desc: 
 * @author: heqinghua
 * @date: 2026年07月03日 10:58:10
 * @example: 调用示例
 */
/*
 * @File: useFlowRegister.ts
 * @desc: 业务组件暴露 Hook — 合三为一：events/methods/handlers 统一成 methods
 * 一步完成：注册元数据到 ComponentManager + useImperativeHandle 暴露 handler
 * 方法增删时自动动态更新元数据
 */
import { useEffect, useImperativeHandle, useRef, useMemo } from 'react';
import { getGlobalComponentManager, type RefObject as CoreRefObject } from '@chloehe/logic-engine-common';

interface ExposedMethod {
  handler: (...args: any[]) => any;
  description?: string;
  params?: Record<string, string>;
}

interface UseExposeConfig {
  componentName: string;
  displayName?: string;
  category?: string;
  description?: string;
  methods: Record<string, ExposedMethod>;
}

export function useExpose(
  refOrConfig: React.Ref<any> | UseExposeConfig,
  maybeConfig?: UseExposeConfig
): void {
  const externalRef: React.Ref<any> | undefined =
    maybeConfig === undefined ? undefined : (refOrConfig as React.Ref<any>);
  const config: UseExposeConfig = maybeConfig ?? (refOrConfig as UseExposeConfig);

  const { componentName, displayName, category, description, methods } = config;

  const internalRef = useRef<any>(null);

  const handlers = useMemo(
    () => Object.fromEntries(
      Object.entries(methods).map(([name, m]) => [name, m.handler])
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [Object.keys(methods).join(',')]
  );

  internalRef.current = handlers;

  useEffect(() => {
    const methodKeys = Object.keys(methods);
    const events = methodKeys.map((name) => {
      const m = methods[name];
      return { eventName: name, description: m.description || '', params: m.params || {} };
    });
    const methodsMeta = methodKeys.map((name) => {
      const m = methods[name];
      return { methodName: name, description: m.description || '', params: m.params || {} };
    });

    const finalRef = externalRef ?? internalRef;

    const compManager = getGlobalComponentManager();
    compManager.registerComponentMeta({
      componentName,
      displayName: displayName || componentName,
      category: category || '',
      description: description || '',
      events,
      methods: methodsMeta,
    }, finalRef as CoreRefObject<any>);

    return () => compManager.unregisterComponentMeta(componentName);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [componentName, displayName, category, description, Object.keys(methods).join(',')]);

  useImperativeHandle(externalRef ?? internalRef, () => handlers, [handlers]);
}

export function registerComponent(meta: any): void {
  const compManager = getGlobalComponentManager();
  compManager.registerComponentMeta(meta);
}