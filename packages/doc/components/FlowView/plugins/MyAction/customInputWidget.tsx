/*
 * @File: 
 * @desc: 自定义输入控件
 * @author: heqinghua
 * @date: 2025年10月30日 15:29:25
 * @example: 调用示例
 */

import { WidgetProps } from "@plugin-flow-engine/type";
import { Input } from "antd";

const customInputWidget: React.FC<WidgetProps<any>> = ({value,onChange, ...reset}) => {
  return (
   <div>
     <label>我是自定义的控件哦</label>
     <Input
      {...reset}
      value={value}
      onChange={onChange}
    />
   </div>
  );
};

export default customInputWidget;
