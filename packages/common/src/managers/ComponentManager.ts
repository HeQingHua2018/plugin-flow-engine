/*
 * @File: ComponentManager.ts
 * @desc: 组件实例管理器，提供组件实例和全局方法的注册、查询和调用功能
 * @author: heqinghua
 * @date: 2025年09月12日
 */

import type { ComponentMeta } from '../types/events';

export interface ComponentInstance {
  [methodName: string]: ComponentMethod;
}

export type ComponentMethod = (...args: any[]) => any;

export interface RefObject<T = any> {
  current: T | null;
}

export interface InstanceRegistration {
  name: string;
  ref: RefObject<any>;
  methods: string[];
  componentType: string;
  registeredAt: Date;
}

/**
 * 全局方法注册信息接口
 */
export interface GlobalMethodRegistration {
  name: string;
  method: (...args: any[]) => any;
  description?: string;
  registeredAt: Date;
}

/**
 * 事件类型约束
 */
type InstanceManagerEvent =
  | 'instanceRegistered'
  | 'instanceUnregistered'
  | 'globalMethodRegistered'
  | 'globalMethodUnregistered';

export class ComponentManager {
  // 支持多实例模式，每个流程引擎拥有独立的 ComponentManager 实例
  private instances = new Map<string, InstanceRegistration>();
  private globalMethods = new Map<string, GlobalMethodRegistration>();
  private componentMetas = new Map<string, ComponentMeta>();
  private listeners: Set<() => void> = new Set();
  private eventEmitter: EventTarget = new EventTarget();
  private debug: boolean;

  /**
   * 构造函数
   * @param options 配置选项
   */
  constructor(options: { debug?: boolean } = {}) {
    this.debug = options.debug ?? true;
  }

  /**
   * 日志输出方法
   * @param args 要输出的日志内容
   */
  private log(...args: any[]) {
    if (this.debug) console.log('[ComponentManager]', ...args);
  }

  /**
   * 警告信息输出方法
   * @param args 要输出的警告内容
   */
  private warn(...args: any[]) {
    if (this.debug) console.warn('[ComponentManager]', ...args);
  }

  /**
   * 错误抛出方法
   * @param message 错误信息
   * @throws {Error} 抛出带有前缀的错误
   */
  private error(message: string): never {
    throw new Error(`[ComponentManager] ${message}`);
  }
/**
   * 注册组件实例
   * @param {string} name 实例名称，用于后续查找和调用
   * @param {React.RefObject<any>} ref React组件引用
   * @emits instanceRegistered 当实例注册成功时触发
   */
  public registerInstance(name: string, ref: RefObject<any>): void {
    const instance = ref.current;
    let methods: string[] = [];
    
    if (instance !== null) {
      // 只获取实例自身的方法属性（适用于useImperativeHandle暴露的方法）
      methods = Object.getOwnPropertyNames(instance)
        .filter(m => typeof instance[m] === 'function');
    }

    const componentType = instance?.constructor?.name ?? 'unknown';

    const registration: InstanceRegistration = {
      name,
      ref,
      methods,
      componentType,
      registeredAt: new Date(),
    };

    this.instances.set(name, registration);

    this.eventEmitter.dispatchEvent(
      new CustomEvent('instanceRegistered', { detail: { name, componentType } })
    );
    this.log(`实例已注册: ${name} (${componentType}) - 发现 ${methods.length} 个方法`);
  }

  /**
   * 注销组件实例
   * @param {string} name 要注销的实例名称
   * @emits instanceUnregistered 当实例注销成功时触发
   */
  public unregisterInstance(name: string): void {
    const registration = this.instances.get(name);
    if (!registration) return;

    this.instances.delete(name);

    this.eventEmitter.dispatchEvent(
      new CustomEvent('instanceUnregistered', {
        detail: { name, componentType: registration.componentType },
      })
    );

    this.log(`实例已注销: ${name}`);
  }

  /**
   * 获取指定名称的组件实例注册信息
   * @param {string} name 实例名称
   * @returns {InstanceRegistration | null} 实例注册信息，如果不存在则返回null
   */
  public getInstance(name: string): InstanceRegistration | null {
    return this.instances.get(name) ?? null;
  }

  /**
   * 获取所有已注册的组件实例
   * @returns {InstanceRegistration[]} 所有实例注册信息的数组
   */
  public getAllInstances(): InstanceRegistration[] {
    return Array.from(this.instances.values());
  }

  /**
   * 根据组件类型获取实例列表
   * @param {string} componentType 组件类型名称
   * @returns {InstanceRegistration[]} 指定类型的所有实例注册信息
   */
  public getInstancesByType(componentType: string): InstanceRegistration[] {
    return Array.from(this.instances.values()).filter(i => i.componentType === componentType);
  }

  /**
   * 注册全局方法
   * @param {string} name 方法名称，用于后续调用
   * @param {Function} method 要注册的方法函数
   * @param {string} [description] 方法描述信息
   * @throws {Error} 当method不是函数时抛出错误
   * @emits globalMethodRegistered 当全局方法注册成功时触发
   */
  public registerGlobalMethod(
    name: string,
    method: (...args: any[]) => any,
    description?: string
  ): void {
    if (typeof method !== 'function') {
      this.error(`注册失败：${name} 不是一个函数`);
    }

    const registration: GlobalMethodRegistration = {
      name,
      method,
      description,
      registeredAt: new Date(),
    };

    this.globalMethods.set(name, registration);

    this.eventEmitter.dispatchEvent(
      new CustomEvent('globalMethodRegistered', { detail: { name, description } })
    );

    this.log(`全局方法已注册: ${name}${description ? ` - ${description}` : ''}`);
  }

  public registerGlobalMethods(
    methods: Array<{ name: string; method: (...args: any[]) => any; description?: string }>
  ): { successCount: number; failures: Array<{ name: string; error: string }> } {
    const results = {
      successCount: 0,
      failures: [] as Array<{ name: string; error: string }>,
    };

    for (const { name, method, description } of methods) {
      try {
        this.registerGlobalMethod(name, method, description);
        results.successCount++;
      } catch (error) {
        results.failures.push({
          name,
          error: error instanceof Error ? error.message : String(error),
        });
        this.warn(`全局方法注册失败: ${name}, 错误: ${error instanceof Error ? error.message : String(error)}`);
      }
    }

    this.log(`批量注册全局方法完成: 成功 ${results.successCount} 个, 失败 ${results.failures.length} 个`);
    return results;
  }

  /**
   * 注销全局方法
   * @param {string} name 要注销的全局方法名称
   * @emits globalMethodUnregistered 当全局方法注销成功时触发
   */
  public unregisterGlobalMethod(name: string): void {
    if (!this.globalMethods.has(name)) return;

    this.globalMethods.delete(name);

    this.eventEmitter.dispatchEvent(
      new CustomEvent('globalMethodUnregistered', { detail: { name } })
    );

    this.log(`全局方法已注销: ${name}`);
  }

  /**
   * 获取指定名称的全局方法注册信息
   * @param {string} name 全局方法名称
   * @returns {GlobalMethodRegistration | null} 全局方法注册信息，如果不存在则返回null
   */
  public getGlobalMethod(name: string): GlobalMethodRegistration | null {
    return this.globalMethods.get(name) ?? null;
  }

  /**
   * 获取所有已注册的全局方法
   * @returns {GlobalMethodRegistration[]} 所有全局方法注册信息的数组
   */
  public getAllGlobalMethods(): GlobalMethodRegistration[] {
    return Array.from(this.globalMethods.values());
  }

  /**
   * 检查全局方法是否已注册
   * @param {string} name 要检查的全局方法名称
   * @returns {boolean} 如果方法已注册则返回true，否则返回false
   */
  public hasGlobalMethod(name: string): boolean {
    return this.globalMethods.has(name);
  }

  /**
   * 调用全局方法
   * @param {string} name 全局方法名称
   * @param {...any} params 传递给方法的参数
   * @returns {Promise<any>} 方法调用的结果
   * @throws {Error} 当方法未找到或调用失败时抛出错误
   */
  public async callGlobalMethod(name: string, ...params: any[]): Promise<any> {
    const registration = this.globalMethods.get(name);
    if (!registration) this.error(`未找到全局方法: ${name}`);

    try {
      const result = await registration.method(...params);
      this.log(`全局方法调用成功: ${name}`, { params, result });
      return result ?? '全局方法调用成功';
    } catch (err) {
      this.error(`[${name}] 全局方法调用失败: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  /**
   * 通用方法调用接口，支持多种调用模式
   * - 组件实例方法调用: "instanceName.methodName"
   * - 全局方法调用: "global.methodName"
   * - window对象方法调用: "window.methodName"
   * @param {string} fullPath 方法完整路径
   * @param {...any} params 传递给方法的参数
   * @returns {Promise<any>} 方法调用的结果
   * @throws {Error} 当实例未找到、方法未找到或调用失败时抛出错误
   */
  public async callMethod(fullPath: string, ...params: any[]): Promise<any> {
    if (fullPath.startsWith('global.')) {
      return this.callGlobalMethod(fullPath.slice(7), ...params);
    }

    if (fullPath.startsWith('window.')) {
      return this.callWindowMethod(fullPath.slice(7), ...params);
    }

    const [instanceName, methodName] = fullPath.split('.');
    if (!instanceName || !methodName) {
      this.error(`无效的方法路径: ${fullPath}`);
    }

    const registration = this.instances.get(instanceName);
    if (!registration) this.error(`未找到实例: ${instanceName}`);

    const instance: ComponentInstance = registration.ref.current;
    if (!instance) this.error(`实例未挂载: ${instanceName}`);

    // 类型安全检查
    const method = instance[methodName];
    if (typeof method !== 'function') this.error(`未找到方法: ${methodName} in ${instanceName}`);

    try {
      const result = await method.call(instance, ...params);
      this.log(`方法调用成功: ${fullPath}`, { params, result });
      return result ?? '方法调用成功';
    } catch (err) {
      this.error(`[${fullPath}] 方法调用失败: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  /**
   * 调用window对象上的方法
   * @param {string} name window对象上的方法名
   * @param {...any} params 传递给方法的参数
   * @returns {Promise<any>} 方法调用的结果
   * @throws {Error} 当无法访问window对象、方法未找到或调用失败时抛出错误
   */
  public async callWindowMethod(name: string, ...params: any[]): Promise<any> {
    if (typeof window === 'undefined') {
      this.error('无法访问window对象，当前环境可能是服务器端');
    }

    const method = (window as any)[name];
    if (typeof method !== 'function') this.error(`window对象上未找到方法: ${name}`);

    try {
      const result = await method(...params);
      this.log(`window方法调用成功: ${name}`, { params, result });
      return result ?? 'window方法调用成功';
    } catch (err) {
      this.error(`[${name}] window方法调用失败: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  /**
   * 检查实例是否已注册
   * @param {string} name 要检查的实例名称
   * @returns {boolean} 如果实例已注册则返回true，否则返回false
   */
  public hasInstance(name: string): boolean {
    return this.instances.has(name);
  }

  /**
   * 检查实例是否包含指定方法
   * @param {string} instanceName 实例名称
   * @param {string} methodName 方法名称
   * @returns {boolean} 如果实例存在且包含指定方法则返回true，否则返回false
   */
  public hasMethod(instanceName: string, methodName: string): boolean {
    return this.instances.get(instanceName)?.methods.includes(methodName) ?? false;
  }

  /**
   * 获取实例的所有方法名
   * @param {string} name 实例名称
   * @returns {string[]} 方法名数组，如果实例不存在则返回空数组
   */
  public getInstanceMethods(name: string): string[] {
    return this.instances.get(name)?.methods ?? [];
  }

  public registerComponentMeta(meta: ComponentMeta, ref?: RefObject<any>): void {
    this.componentMetas.set(meta.componentName, meta);
    if (ref) {
      this.registerInstance(meta.componentName, ref);
    }
    this.notifyListeners();
    this.log(`组件元数据已注册: ${meta.componentName} (事件: ${meta.events?.length || 0}个)`);
  }

  /**
   * 注销组件元数据
   * @param componentName 组件名称
   */
  public unregisterComponentMeta(componentName: string): void {
    this.componentMetas.delete(componentName);
    this.unregisterInstance(componentName);
    this.notifyListeners();
    this.log(`组件元数据已注销: ${componentName}`);
  }

  /**
   * 获取所有已注册的组件元数据
   */
  public getAllComponentMetas(): ComponentMeta[] {
    return Array.from(this.componentMetas.values());
  }

  /**
   * 获取指定组件的元数据
   */
  public getComponentMeta(componentName: string): ComponentMeta | undefined {
    return this.componentMetas.get(componentName);
  }

  /**
   * 获取所有已注册事件（用于设计器下拉选择）
   * 返回 { componentName, displayName, events }[]
   */
  public getAllEvents(): Array<{
    componentName: string;
    displayName: string;
    events: ComponentMeta['events'];
  }> {
    const result: Array<{
      componentName: string;
      displayName: string;
      events: ComponentMeta['events'];
    }> = [];
    this.componentMetas.forEach((meta) => {
      if (meta.events && meta.events.length > 0) {
        result.push({
          componentName: meta.componentName,
          displayName: meta.displayName || meta.componentName,
          events: meta.events,
        });
      }
    });
    return result;
  }

  /**
   * 获取指定组件的事件列表
   */
  public getComponentEvents(componentName: string): ComponentMeta['events'] | null {
    const meta = this.componentMetas.get(componentName);
    return meta ? meta.events : null;
  }

  /**
   * 获取指定组件的指定事件详情
   */
  public getEventDetail(componentName: string, eventName: string): ComponentMeta['events'][number] | null {
    const events = this.getComponentEvents(componentName);
    if (!events) return null;
    return events.find((e) => e.eventName === eventName) || null;
  }

  // ---- 监听机制（UI 响应式更新） ----

  /**
   * 添加变更监听器
   */
  public addListener(cb: () => void): () => void {
    this.listeners.add(cb);
    return () => {
      this.listeners.delete(cb);
    };
  }

  /**
   * 移除变更监听器
   */
  public removeListener(cb: () => void): void {
    this.listeners.delete(cb);
  }

  private notifyListeners(): void {
    this.listeners.forEach((cb) => {
      try { cb(); } catch { /* 静默失败 */ }
    });
  }


  public addEventListener(eventName: InstanceManagerEvent, callback: EventListener): void {
    this.eventEmitter.addEventListener(eventName, callback);
  }

  /**
   * 移除事件监听器
   * @param {InstanceManagerEvent} eventName 事件名称
   * @param {EventListener} callback 要移除的事件回调函数
   */
  public removeEventListener(eventName: InstanceManagerEvent, callback: EventListener): void {
    this.eventEmitter.removeEventListener(eventName, callback);
  }

  public registerInstances(instances: { name: string; ref: RefObject<any> }[]): void {
    for (const { name, ref } of instances) this.registerInstance(name, ref);
  }

  /**
   * 批量注销组件实例
   * @param {string[]} names 要注销的实例名称数组
   */
  public unregisterInstances(names: string[]): void {
    for (const name of names) this.unregisterInstance(name);
  }

  /**
   * 私有方法：批量清空Map中的所有项
   * @template T
   * @param {Map<string, T>} map 要清空的Map对象
   * @param {(name: string) => void} unregisterFn 用于注销单个项的函数
   * @param {string} label 用于日志的标签名称
   */
  private clearAllOf<T>(map: Map<string, T>, unregisterFn: (name: string) => void, label: string) {
    const keys = Array.from(map.keys());
    for (const name of keys) unregisterFn.call(this, name);
    this.log(`所有${label}已清空`);
  }

  /**
   * 清空所有已注册的全局方法
   */
  public clearAllGlobalMethods(): void {
    this.clearAllOf(this.globalMethods, this.unregisterGlobalMethod, '全局方法');
  }

  /**
   * 清空所有已注册的组件实例
   */
  public clearAllInstances(): void {
    this.clearAllOf(this.instances, this.unregisterInstance, '实例');
    this.componentMetas.clear();
  }

  /**
   * 清空所有实例和全局方法
   */
  public clearAll(): void {
    this.clearAllInstances();
    this.clearAllGlobalMethods();
    this.componentMetas.clear();
    this.log('所有实例、元数据和全局方法已清空');
  }

  /**
   * 获取实例管理器配置
   * @returns 配置对象
   */
  public getConfig(): { debug: boolean } {
    return { debug: this.debug };
  }

  /**
   * 设置实例管理器配置
   * @param config 配置对象
   */
  public setConfig(config: Partial<{ debug: boolean }>): void {
    if (config.debug !== undefined) {
      this.debug = config.debug;
    }
  }
}

// 导出单例实例的获取函数
/**
 * 创建一个新的 ComponentManager 实例
 * @param options 配置选项
 * @returns 新的 ComponentManager 实例
 */
export function createComponentManager(options: { debug?: boolean } = {}) {
  return new ComponentManager(options);
}

/**
 * 创建默认配置的 ComponentManager 实例
 * @returns 默认配置的 ComponentManager 实例
 */
export function createDefaultComponentManager() {
  return new ComponentManager({ debug: true });
}

export default ComponentManager;

// ---- 全局单例 ----

let globalComponentManager: ComponentManager | null = null;

/**
 * 获取全局共享的 ComponentManager 单例
 * 确保 useExpose 注册的实例与 PluginExecutionEngine 使用的是同一个管理器
 */
export function getGlobalComponentManager(): ComponentManager {
  if (!globalComponentManager) {
    globalComponentManager = new ComponentManager();
  }
  return globalComponentManager;
}

/**
 * 重置全局 ComponentManager（仅用于测试）
 */
export function resetGlobalComponentManager(): void {
  globalComponentManager = null;
}
