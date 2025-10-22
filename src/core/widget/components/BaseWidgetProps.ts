export interface BaseWidgetProps<T> {
  /** 当前值 */
  value: T;
  /** 值变化回调 */
  onChange: (value: T) => void;
  /** 其他额外属性 */
  [key: string]: any;
}

/**
 * 创建控件属性类型的工具类型
 * 用于组合基础属性和控件特有属性
 */
export type WidgetProps<T, U = object> = BaseWidgetProps<T> & U;