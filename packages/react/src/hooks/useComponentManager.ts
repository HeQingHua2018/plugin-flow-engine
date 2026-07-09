/*
 * @File: useComponentManager.ts
 * @desc: ComponentManager相关的React Hooks
 * @author: heqinghua
 * @date: 2025年09月12日
 */

import * as React from 'react';
import { ComponentManager, type InstanceRegistration, type GlobalMethodRegistration, type RefObject as CoreRefObject } from '@chloehe/logic-engine-common';

export const useComponentManager = (componentManager?: ComponentManager): ComponentManager => {
  const [manager] = React.useState<ComponentManager>(() => {
    return componentManager || new ComponentManager();
  });
  return manager;
};

export const useRegisterInstance = (
  name: string,
  ref: React.RefObject<any>,
  componentManager?: ComponentManager
): void => {
  const manager = useComponentManager(componentManager);
  
  React.useEffect(() => {
    if (!manager || !ref || !name) return;
    
    manager.registerInstance(name, ref as CoreRefObject<any>);
    return () => manager.unregisterInstance(name);
  }, [name, ref, manager]);
};

export const useRegisterInstances = (
  instances: Array<{ name: string; ref: React.RefObject<any> }>,
  componentManager?: ComponentManager
): void => {
  const manager = useComponentManager(componentManager);
  
  React.useEffect(() => {
    if (!manager || !instances || instances.length === 0) return;
    
    try {
      manager.registerInstances(instances as Array<{ name: string; ref: CoreRefObject<any> }>);
      const instanceNames = instances.map(instance => instance.name);
      return () => manager.unregisterInstances(instanceNames);
    } catch (error) {
      console.warn('[ComponentManager Hook] 批量注册实例失败:', error);
    }
  }, [instances, manager]);
};

export const useRegisterGlobalMethod = (
  name: string,
  method: (...args: any[]) => any,
  description?: string,
  componentManager?: ComponentManager
): void => {
  const manager = useComponentManager(componentManager);
  
  React.useEffect(() => {
    if (!manager || !name || !method) return;
    
    try {
      manager.registerGlobalMethod(name, method, description);
      return () => manager.unregisterGlobalMethod(name);
    } catch (error) {
      console.warn(`[ComponentManager Hook] 全局方法注册失败: ${name}, 错误:`, error);
    }
  }, [name, method, description, manager]);
};

export const useRegisterGlobalMethods = (
  methods: Array<{ name: string; method: (...args: any[]) => any; description?: string }>,
  componentManager?: ComponentManager
): { successCount: number; failures: Array<{ name: string; error: string }> } => {
  const manager = useComponentManager(componentManager);
  const [result, setResult] = React.useState({ successCount: 0, failures: [] as Array<{ name: string; error: string }> });
  
  React.useEffect(() => {
    if (!manager || !methods || methods.length === 0) {
      setResult({ successCount: 0, failures: [] });
      return;
    }

    const registerResult = manager.registerGlobalMethods(methods);
    setResult(registerResult);
    
    return () => {
      methods.forEach(methodConfig => {
        try {
          manager.unregisterGlobalMethod(methodConfig.name);
        } catch (error) {
          console.warn(
            `[ComponentManager Hook] 全局方法注销失败: ${methodConfig.name}, 错误:`,
            error
          );
        }
      });
    };
  }, [methods, manager]);
  
  return result;
};

export const useInstance = (
  name: string,
  componentManager?: ComponentManager
): InstanceRegistration | null => {
  const manager = useComponentManager(componentManager);
  const [instance, setInstance] = React.useState<InstanceRegistration | null>(manager.getInstance(name));
  
  React.useEffect(() => {
    const handleInstanceRegistered = (event: Event) => {
      const { name: registeredName } = (event as CustomEvent).detail;
      if (registeredName === name) {
        setInstance(manager.getInstance(name));
      }
    };
    
    const handleInstanceUnregistered = (event: Event) => {
      const { name: unregisteredName } = (event as CustomEvent).detail;
      if (unregisteredName === name) {
        setInstance(null);
      }
    };
    
    manager.addEventListener('instanceRegistered', handleInstanceRegistered);
    manager.addEventListener('instanceUnregistered', handleInstanceUnregistered);
    
    setInstance(manager.getInstance(name));
    
    return () => {
      manager.removeEventListener('instanceRegistered', handleInstanceRegistered);
      manager.removeEventListener('instanceUnregistered', handleInstanceUnregistered);
    };
  }, [name, manager]);
  
  return instance;
};

export const useInstanceMethod = (
  instanceName: string,
  methodName: string,
  componentManager?: ComponentManager
): ((...args: any[]) => Promise<any>) | undefined => {
  const manager = useComponentManager(componentManager);
  const [method, setMethod] = React.useState<((...args: any[]) => Promise<any>) | undefined>(undefined);
  
  React.useEffect(() => {
    if (!manager.hasInstance(instanceName) || !manager.hasMethod(instanceName, methodName)) {
      setMethod(undefined);
      return;
    }
    
    const boundMethod = async (...args: any[]): Promise<any> => {
      return manager.callMethod(`${instanceName}.${methodName}`, ...args);
    };
    
    setMethod(boundMethod);
  }, [instanceName, methodName, manager]);
  
  return method;
};

export const useGlobalMethod = (
  name: string,
  componentManager?: ComponentManager
): GlobalMethodRegistration | null => {
  const manager = useComponentManager(componentManager);
  const [method, setMethod] = React.useState<GlobalMethodRegistration | null>(manager.getGlobalMethod(name));
  
  React.useEffect(() => {
    const handleMethodRegistered = (event: Event) => {
      const { name: registeredName } = (event as CustomEvent).detail;
      if (registeredName === name) {
        setMethod(manager.getGlobalMethod(name));
      }
    };
    
    const handleMethodUnregistered = (event: Event) => {
      const { name: unregisteredName } = (event as CustomEvent).detail;
      if (unregisteredName === name) {
        setMethod(null);
      }
    };
    
    manager.addEventListener('globalMethodRegistered', handleMethodRegistered);
    manager.addEventListener('globalMethodUnregistered', handleMethodUnregistered);
    
    setMethod(manager.getGlobalMethod(name));
    
    return () => {
      manager.removeEventListener('globalMethodRegistered', handleMethodRegistered);
      manager.removeEventListener('globalMethodUnregistered', handleMethodUnregistered);
    };
  }, [name, manager]);
  
  return method;
};

export const useCallGlobalMethod = (
  name: string,
  componentManager?: ComponentManager
): ((...args: any[]) => Promise<any>) => {
  const manager = useComponentManager(componentManager);
  
  const callMethod = React.useCallback(async (...args: any[]): Promise<any> => {
    return manager.callGlobalMethod(name, ...args);
  }, [name, manager]);
  
  return callMethod;
};