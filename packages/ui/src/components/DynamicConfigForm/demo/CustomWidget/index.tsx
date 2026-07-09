/*
 * @File: 
 * @desc: 自定义一个颜色选择器
 * @author: heqinghua
 * @date: 2025年11月11日 17:08:20
 * @example: 调用示例
 */
import React from 'react'
import { WidgetProps } from '@chloehe/logic-engine-ui'
import { ColorPicker } from 'antd';
import { AggregationColor } from 'antd/es/color-picker/color';


/**
 * 定义props类型
 */
type CustomWidgetProps = WidgetProps<string>;
/**
 * @desc: 自定义表单组件示例
 * @param {*} props
 * @return {*}
 */
const CustomWidget: React.FC<CustomWidgetProps> = (props) => {
    // console.log(props)
    const changeColor = (color: AggregationColor,css:string) => {
        props.onChange?.(css);
    }
  return (
    <div>
       <ColorPicker defaultValue={props.value || "#1677ff"} onChange={changeColor} />
    </div>
  )
}

export default CustomWidget
