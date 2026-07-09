/*
 * @File: 
 * @desc: 基础示例
 * @author: heqinghua
 * @date: 2025年11月11日 16:49:15
 * @example: 调用示例
 */

import React from 'react'
import { DynamicConfigForm, injectWidgets, injectWidget } from '@chloehe/logic-engine-ui'
import { schema } from './data'
import CustomWidget from './CustomWidget';
const customwidgetMap= {
  'custom_widget': CustomWidget,
}
const basic: React.FC = () => {
  // 单独注入自定义组件
  // injectWidget('CustomWidget', CustomWidget);
  /**
   * 批量注入自定义组件
   */
  injectWidgets(customwidgetMap);
  return (
    <div>
        <DynamicConfigForm schema={schema}   />
    </div>
  )
}

export default basic