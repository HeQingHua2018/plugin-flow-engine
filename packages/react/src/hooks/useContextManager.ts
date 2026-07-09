/*
 * @File: useContextManager.ts
 * @desc: ContextManager相关的React Hooks
 * @author: heqinghua
 * @date: 2025年09月15日
 */

import * as React from 'react';
import { ContextManager, type ContextListener, type ExecutionContext } from '@chloehe/logic-engine-common';

export const useContextManager = (contextManager?: ContextManager): ContextManager => {
  const [manager] = React.useState<ContextManager>(() => {
    return contextManager || new ContextManager();
  });
  return manager;
};

export const useContext = (
  contextManager: ContextManager,
  deps?: React.DependencyList
): ExecutionContext => {
  const [context, setContext] = React.useState<ExecutionContext>(
    contextManager ? contextManager.getContext() : { variables: {} }
  );

  React.useEffect(() => {
    if (!contextManager) {
      setContext({ variables: {} });
      return;
    }

    const listener: ContextListener = (newContext) => {
      setContext(newContext);
    };

    const unsubscribe = contextManager.addListener(listener);
    return unsubscribe;
  }, [contextManager, ...(deps || [])]);

  return context;
};

export const useContextVariables = (
  contextManager: ContextManager,
  deps?: React.DependencyList
): Record<string, any> => {
  const context = useContext(contextManager, deps);
  return context.variables || {};
};

export const useContextVariable = (
  contextManager: ContextManager,
  variableName: string
): any => {
  const variables = useContextVariables(contextManager);
  return variables[variableName];
};

export const useContextVariablesSelective = (
  contextManager: ContextManager,
  variableNames: string[]
): Record<string, any> => {
  const variables = useContextVariables(contextManager);
  const selectedVariables = React.useMemo(() => {
    const result: Record<string, any> = {};
    variableNames.forEach(name => {
      result[name] = variables[name];
    });
    return result;
  }, [variables, variableNames]);
  
  return selectedVariables;
};

export const useUpdateVariables = (
  contextManager: ContextManager
): ((variables: Record<string, any>) => void) => {
  return React.useCallback((variables: Record<string, any>) => {
    if (!contextManager) return;
    contextManager.updateVariables(variables);
  }, [contextManager]);
};

export const useUpdateContext = (
  contextManager: ContextManager
): ((context: ExecutionContext) => void) => {
  return React.useCallback((context: ExecutionContext) => {
    if (!contextManager) return;
    contextManager.updateContext(context);
  }, [contextManager]);
};

export const useInitializeContext = (
  contextManager: ContextManager,
  initialContext: ExecutionContext,
  deps?: React.DependencyList
): void => {
  React.useEffect(() => {
    if (!contextManager || !initialContext) return;
    contextManager.initialize(initialContext);
  }, [contextManager, initialContext, ...(deps || [])]);
};

export const useClearContext = (
  contextManager: ContextManager
): (() => void) => {
  return React.useCallback(() => {
    if (!contextManager) return;
    contextManager.clear();
  }, [contextManager]);
};

export const useSetContextVariable = (
  contextManager: ContextManager
): ((name: string, value: any) => void) => {
  const updateVariables = useUpdateVariables(contextManager);
  
  return React.useCallback((name: string, value: any) => {
    updateVariables({ [name]: value });
  }, [updateVariables]);
};

export const useContextSubscription = (
  contextManager: ContextManager,
  callback: ContextListener,
  deps?: React.DependencyList
): void => {
  React.useEffect(() => {
    if (!contextManager || typeof callback !== 'function') return;
    
    const unsubscribe = contextManager.addListener(callback);
    return unsubscribe;
  }, [contextManager, callback, ...(deps || [])]);
};