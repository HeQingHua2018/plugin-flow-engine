/*
 * @File: 
 * @desc: 
 * @author: heqinghua
 * @date: 2025年10月27日 16:16:25
 * @example: 调用示例
 */
import React, {
  ReactNode,
  useMemo,
  useState,
  useEffect,
  useContext,
} from "react";
import moment from "moment";
import classNames from "classnames";
import { cloneDeep } from "lodash";
import RuleContext from "./RuleContext";
import locale from "antd/es/date-picker/locale/zh_CN";
import { RuleItemData, RuleItemProps } from "./types";
import { FieldTypeRules, RuleTypeOptions, getDatePickerProps, NativeType } from "./utils";
import RangeInput from './components/RangeInput';
import {
  CheckOutlined,
  DeleteOutlined,
  EditOutlined,
  CloseOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import {
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  FormItemProps,
  Select,
  Switch,
  TreeSelect,
} from "antd";

const RuleItem: React.FC<RuleItemProps> = props => {
  const { prefixCls, mode, fields, onAdd } = props;
  const rule: any = cloneDeep(props.rule || {});
  const [edit, setEdit] = useState<boolean>(false);
  const { editKey, dispatch } = useContext(RuleContext);
  const [fieldValue, setFieldValue] = useState(rule.field);
  const [ruleValue, setRuleValue] = useState<string>(rule.rule || "");
  const onEditRow = (val: RuleItemData) => {
    dispatch({ type: "EditKey", values: { editKey: val?.key } });
  };

  const [form] = Form.useForm();
  const cancelEdit = () => {
    form.resetFields();
    //  重置基本信息
    setFieldValue(rule.field);
    setRuleValue(rule.rule || "");
  };
  const getFieldOptions = useMemo(
    () => fields?.map(field => ({ value: field.key, label: field.label })),
    [],
  );
  // 获取范围区间显示value
  const getShowTextBetweenValue = (values?: any[]) => {
    if (values && values?.length > 0) {
      const startVal = values?.[0] || "-";
      const endVal = values?.[1] || "-";
      return `${startVal}~${endVal}`;
    }
    return `-`;
  };

  // 如果是日期范围,外部传入使用日期范围-开始/结束字段方式传入,内部不做范围处理,数字范围同理
  const fieldData = useMemo(() => {
    const field: any = fields?.find(item => item.key === fieldValue);
    const { type, fieldName = "", props: fieldProps = {} } = field || {};
    const _multi = fieldProps?.multi !== undefined ? fieldProps.multi : false;
    let defaultRules = (FieldTypeRules as any)[field?.type || 'string'] || [];
    if (
      Array.isArray(defaultRules) &&
      (fieldProps.treeData || fieldProps.options?.some((item: any) => item.children) || fieldProps.multi) &&
      !_multi
    ) {
      defaultRules = defaultRules.filter(
        (i: string) => !["like", "not_between"].includes(i),
      );
    }
    const fieldData: {
      component: ReactNode; // 比如下拉，number输入框，文本输入框
      ruleOptions: Array<string>; // 展示的条件
      initValue: Array<any>; // 初始值
      type: NativeType | string; // 原生数据类型
      fieldName: string; // 字段名称
      format?: string; // 日期格式
      valueType: string; // 值类型 string | number | date
      formItemProps?: FormItemProps; // component单独的Props,可以继承antd
      showText: (values: RuleItemData) => string; // 展示配置效果
    } = {
      type: type,
      formItemProps: {},
      valueType: "string",
      component: <Input />,
      fieldName: fieldName,
      ruleOptions: field?.rules || defaultRules,
      initValue: rule.value?.length ? rule.value : [],
      showText: (values: RuleItemData) => values.value?.[0] || "",
    };
    if (ruleValue === "is_null" || ruleValue === "is_not_null") {
      Object.assign(fieldData, {
        component: "", //<Input disabled />,
        value: [],
        showText: () => "",
      });
    } else if (field) {
      switch (type) {
        case 'string':
          Object.assign(fieldData, {
            component: <Input {...fieldProps} />,
            initValue: rule.value?.length ? rule.value[0] : "",
            ruleOptions: field?.rules || FieldTypeRules.string,
          });
          break;
        case 'date':
          {
            const formatProps = getDatePickerProps(
              fieldProps.format || "YYYY-MM-DD",
              fieldProps.picker,
            );
            Object.assign(fieldData, {
              component: (
                <DatePicker {...fieldProps} {...formatProps} locale={locale} />
              ),
              valueType: "date",
              initValue: rule.value?.[0] ? moment(rule.value?.[0]) : null,
              format: formatProps.format,
              showText: (values: RuleItemData) => values.value?.[0] || null,
            });
            if (ruleValue === "between") {
              Object.assign(fieldData, {
                component: (
                  <DatePicker.RangePicker
                    {...fieldProps}
                    {...formatProps}
                    locale={locale}
                  />
                ),
                initValue: rule.value?.length
                  ? rule.value.map((v: any) => (v ? moment(v) : null))
                  : [null, null],
                showText: (values: RuleItemData) =>
                  getShowTextBetweenValue(values?.value),
              });
            }
          }
          break;
        case 'number':
          {
            let component;
            let initValue;
            let showText;
            
            // 对于范围类规则，显示两个输入框
            if (ruleValue === "between" || ruleValue === "not_between") {
              component = <RangeInput fieldProps={fieldProps} onChange={(values) => form.setFieldsValue({ value: values })} />;
              initValue = rule.value?.length ? rule.value : ["", ""];
              showText = (values: RuleItemData) => {
                return getShowTextBetweenValue(values?.value);
              };
            } else {
              // 非范围类规则保持单个输入框
              component = <InputNumber {...fieldProps} />;
              initValue = rule.value?.length ? rule.value : [""];
              showText = (values: RuleItemData) => {
                return values.value?.[0] || "";
              };
            }
            
            Object.assign(fieldData, {
              component: component,
              valueType: "number",
              initValue: initValue,
              showText: showText,
            });
          }
          break;
        case 'boolean':
          Object.assign(fieldData, {
            component: <Switch {...fieldProps} />,
            formItemProps: { valuePropName: "checked" },
            initValue: rule.value?.length ? rule.value[0] : [false],
            showText: (values: RuleItemData) =>
              values.value?.[0] ? "开启" : "关闭",
          });
          break;
        case 'array':
          {
            // 数组类型可以根据props.options或treeData属性来决定使用Select还是TreeSelect
            const isTree = fieldProps.treeData || fieldProps.options?.some((item: any) => item.children);
            let component;
            let showText;
            
            if (isTree) {
              component = (
                <TreeSelect
                  allowClear
                  {...fieldProps}
                  style={{ minWidth: 160 }}
                  treeData={fieldProps.options || []}
                  mode={fieldProps.multi ? 'multiple' : undefined}
                />
              );
              showText = (values: RuleItemData) => {
                // 递归查找树形结构中的节点标签
                const findLabelInTree = (treeData: any[], value: any): string => {
                  for (const node of treeData) {
                    if (node.value === value) {
                      return node.label;
                    }
                    if (node.children) {
                      const label = findLabelInTree(node.children, value);
                      if (label) return label;
                    }
                  }
                  return "";
                };
                const valueLabels = (values.value || [])
                  .map(v => {
                    return findLabelInTree(fieldProps.options || [], v);
                  })
                  .filter(label => label);
                return valueLabels.join(",");
              };
            } else {
              component = (
                <Select
                  allowClear
                  {...fieldProps}
                  style={{ minWidth: 160 }}
                  options={fieldProps.options || []}
                  mode={fieldProps.multi ? "multiple" : (ruleValue === "not_between" ? "tags" : undefined)}
                />
              );
              showText = (values: RuleItemData) => {
                const value = (values.value || []).map(v => {
                  const label = fieldProps.options?.find(
                    (i: { value: string; label: string }) => i.value === v,
                  )?.label;
                  return label;
                });
                return value.join(",");
              };
            }
            
            Object.assign(fieldData, {
              component: component,
              initValue: rule.value?.length ? rule.value : [],
              showText: showText,
            });
          }
          break;
        case 'object':
          {
            Object.assign(fieldData, {
              component: <Input.TextArea {...fieldProps} />,
              initValue: rule.value?.length ? rule.value[0] : "",
              ruleOptions: field?.rules || FieldTypeRules.object,
              showText: (values: RuleItemData) => values.value?.[0] || "",
            });
          }
          break;
        default:
          break;
      }
    }
    return fieldData;
  }, [fieldValue, ruleValue]);

  /**
   * 格式化值显示格式
   */
  const formatValue = useMemo(() => {
    const field = fields?.find(item => item.key === fieldValue);
    const fieldText = ` ${field?.label || "-"}`;
    const ruleText = ` ${RuleTypeOptions?.find(item => item.value === rule.rule)?.label || " - "}`;
    const value = fieldData?.showText
      ? fieldData.showText(rule)
      : `${rule?.value}`;
      return `${fieldText} ${ruleText} ${value}`;
  }, [fieldValue, ruleValue]);

  useEffect(() => {
    setEdit(rule?.key === editKey);
  }, [editKey]);

  return (
    <>
      <div className={classNames(`${prefixCls}-rule-box`, { show: !edit })}>
        {edit ? (
          <Form
            layout="inline"
            form={form}
            colon={false}
            component="div"
            initialValues={{
              rule: rule.rule,
              field: rule.field,
              value: fieldData.initValue,
            }}
            onFinish={values => {
              let value: (string | number)[] = [];
              if (fieldData?.type === 'date' && values?.value) {
                if (values?.rule === "between") {
                  const date1 = moment.isMoment(values.value[0])
                    ? values.value[0]
                    : moment(values.value[0]);
                  const date2 = moment.isMoment(values.value[1])
                    ? values.value[1]
                    : moment(values.value[1]);
                  value = [
                    date1.format(fieldData.format),
                    date2.format(fieldData.format),
                  ];
                } else {
                  const date = moment.isMoment(values.value)
                    ? values.value
                    : moment(values.value);
                  value = [date.format(fieldData.format)];
                }
              }
              const finalValue = value?.length
                ? value
                : Array.isArray(values.value)
                  ? values.value
                  : values.value
                    ? [values.value]
                    : [];
              // 基于最新的表单值计算最终的描述文案
              const formatValueCurrent = (() => {
                const field = fields?.find(item => item.key === (values.field ?? fieldValue));
                const fieldText = `${field?.label || "-"}`;
                // 使用values中的rule而不是原来的rule.rule，确保使用最新的表单值
                const ruleText = `${RuleTypeOptions?.find(item => item.value === values.rule)?.label || "-"}`;
                const valueText = fieldData?.showText
                  ? fieldData.showText({ ...rule, ...values, value: finalValue } as any)
                  : `${finalValue}`;
                return `${fieldText}${ruleText}${valueText}`;
              })();
              const _rule = {
                type: "Change",
                fieldType: fieldData.type,
                valueType: fieldData.valueType,
                fieldName: fieldData.fieldName,
                values: {
                  ...rule,
                  ...values,
                  value: finalValue,
                  desc: formatValueCurrent,
                },
              };
              dispatch(_rule);
            }}
            onValuesChange={changedValues => {
              // 当字段改变时，清空rule和value匹配值
              if (changedValues.field) {
                form.setFieldsValue({ rule: "", value: undefined });
                setRuleValue("");
              }
              // 当规则字段改变时，清空value匹配值
              if (ruleValue !== form.getFieldValue("rule")) {
                form.setFieldsValue({ ...changedValues, value: undefined });
              }
            }}
          >
            <Form.Item
              className={`${prefixCls}-rule-box-field`}
              name={"field"}
              rules={[{ required: true, message: "此为必填项" }]}
              colon={false}
            >
              <Select
                placeholder={"请选择字段"}
                showSearch
                style={{ width: 160 }}
                onChange={(value: string) => {
                  setFieldValue(value);
                }}
                options={getFieldOptions}
                filterOption={(input, option) =>
                  (option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
              />
            </Form.Item>
            <Form.Item
              className={`${prefixCls}-rule-box-field`}
              name={"rule"}
              colon={false}
              rules={[{ required: true, message: "此为必填项" }]}
            >
              <Select
                onChange={(value: string) => {
                  setRuleValue(value);
                }}
                placeholder={"匹配类型"}
                style={{ width: 160 }}
                options={RuleTypeOptions.filter(item =>
                  fieldData.ruleOptions.includes(item.value),
                )}
              />
            </Form.Item>
            {
              // 匹配规则为is_null、is_not_null 或者 匹配规则为空时，不显示value字段
              ruleValue === "is_null" ||
              ruleValue === "is_not_null" ||
              !ruleValue ? (
                <></>
              ) : (
                <Form.Item
                  className={`${prefixCls}-rule-box-field`}
                  colon={false}
                  name={"value"}
                  {...fieldData.formItemProps}
                  rules={[{ required: true, message: "此为必填项" }]}
                >
                  {fieldData.component}
                </Form.Item>
              )
            }
          </Form>
        ) : (
          <div className={`${prefixCls}-rule-box-field`}>{formatValue}</div>
        )}
        <div className={`${prefixCls}-rule-tool`}>
          {mode === "edit" && (
            <>
              {edit ? (
                <>
                  <Button
                    type={"link"}
                    title={"确认"}
                    icon={<CheckOutlined />}
                    onClick={async () => {
                      try {
                        await form?.validateFields();
                        form.submit();
                        onEditRow?.({ ...rule, key: "" });
                      } catch {
                        // console.log("验证失败");
                      }
                    }}
                  />
                  {/* 新增加数据只有删除没有取消，对于新增数据来说,删除和取消是一个意思 */}
                  {!((rule?.key || "") + "").startsWith("_add") && (
                    <Button
                      danger
                      type={"link"}
                      title={"取消"}
                      onClick={() => {
                        cancelEdit();
                        onEditRow?.({ ...rule, key: "" });
                      }}
                      icon={<CloseOutlined />}
                    />
                  )}
                </>
              ) : (
                <>
                  <Button
                    type={"link"}
                    title={"添加条件"}
                    icon={<PlusOutlined />}
                    onClick={() => onAdd && onAdd()}
                    disabled={!(editKey === rule.key || !editKey)}
                  />
                  <Button
                    type={"link"}
                    title={"修改条件"}
                    icon={<EditOutlined />}
                    disabled={!(editKey === rule.key || !editKey)}
                    onClick={() => onEditRow && onEditRow(rule)}
                  />
                </>
              )}
              <Button
                danger
                type={"link"}
                title={"删除条件"}
                icon={<DeleteOutlined />}
                onClick={() => {
                  dispatch({
                    type: "Remove",
                    values: { key: rule.key, ruleType: "rule" },
                  });
                }}
              />
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default RuleItem;
