import React, { createRef, useContext, useMemo } from "react";
import RuleItem from "./RuleItem";
import RuleContext from "./RuleContext";
import { Button, Popover } from "antd";
import { RuleItemData, LinkType, RuleGroupProps } from "./types";
import {
  DeleteOutlined,
  PlusOutlined,
  PlusCircleFilled,
} from "@ant-design/icons";

const RuleGroup: React.FC<RuleGroupProps> = props => {
  const ref = createRef<HTMLDivElement>();
  const { prefixCls, group, rules, fields } = props;
  const { editKey, mode = "edit", dispatch } = useContext(RuleContext);
  const onChangeLink = (rule: RuleItemData, link: LinkType) => {
    dispatch({ type: "Change", values: { ...rule, link: link } });
  };
  const renderItems = useMemo(() => {
    const isEdit = mode === "edit";
    return rules?.map((rule, index) => {
      if (rule.type === "group") {
        return (
          <div key={rule.key} className={`${prefixCls}-group`} ref={ref}>
            <div className={`${prefixCls}-group-line`}>
              <div className={`${prefixCls}-group-line-top`} />
              <div className={`${prefixCls}-group-line-title`}>
                <Popover
                  trigger={"click"}
                  placement={"right"}
                  overlayClassName={`${prefixCls}-group-popover`}
                  content={
                    isEdit && (
                      <ul>
                        {rule.link === "and" ? (
                          <li onClick={() => onChangeLink(rule, "or")}>或</li>
                        ) : (
                          <li onClick={() => onChangeLink(rule, "and")}>且</li>
                        )}
                      </ul>
                    )
                  }
                >
                  <span>{rule.link === "and" ? "且" : "或"}</span>
                </Popover>
              </div>
              <div className={`${prefixCls}-group-line-bottom`} />
            </div>
            <div className={`${prefixCls}-rules`}>
              {isEdit && (
                <div className={`${prefixCls}-rules-tool`}>
                  <Button
                    type="link"
                    title={"添加分组"}
                    icon={<PlusCircleFilled />}
                    disabled={!!editKey && editKey !== rule.key}
                    onClick={() =>
                      dispatch({
                        type: "Add",
                        values: { group: rule.key, ruleType: "group" },
                      })
                    }
                  />
                  <Button
                    type="link"
                    title={"添加条件"}
                    icon={<PlusOutlined />}
                    disabled={!!editKey && editKey !== rule.key}
                    onClick={() =>
                      dispatch({
                        type: "Add",
                        values: { group: rule.key, ruleType: "rule" },
                      })
                    }
                  />
                  <Button
                    danger
                    type="link"
                    title={"删除分组"}
                    icon={<DeleteOutlined />}
                    style={{
                      display:
                        (rule as any)?.children?.length > 0 ? "block" : "none",
                    }}
                    onClick={() =>
                      dispatch({
                        type: "Remove",
                        values: { key: rule.key, ruleType: "group" },
                      })
                    }
                  />
                </div>
              )}
              {
                <RuleGroup
                  {...{
                    editKey: editKey,
                    prefixCls,
                    fields,
                    group: rule.key,
                    rules: rule.children,
                  }}
                />
              }
            </div>
          </div>
        );
      }
      return (
        <div className={`${prefixCls}-rule`} key={rule.key}>
          <RuleItem
            {...{ prefixCls, fields, rule, group: group || "", mode }}
            onAdd={() =>
              dispatch({
                type: "Add",
                values: { group: group, ruleType: "rule", index: index },
              })
            }
          />
        </div>
      );
    });
  }, [fields, JSON.stringify(rules), editKey]);
  return <>{renderItems}</>;
};

export default RuleGroup;
