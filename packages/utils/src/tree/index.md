---
category: utils
title: 树形结构 # 组件的标题，会在菜单侧边栏展示
group: # 分组
  title: 工具函数 # 所在分组的名称
  order: 4 # 分组排序，值越小越靠前
---

| 名称             | 描述                                                                   | 参数                                                                                          | 返回值                  |
| ---------------- | ---------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- | ----------------------- |
| loopData         | 递归处理数据，可用数据加工、数据处理，比如增加/移除/调整某些属性（值） | `(treeNodes:Array<TreeNode>,func:(originalData:TreeNode,originalDataParent?:TreeNode)=>void)` | `无`                    |
| flatTreeData     | 将树形数据扁平化                                                       | `(treeNodes: Array<TreeNode>)`                                                                | `Array<TreeNode>`       |
| list2Tree        | 简单数组转换为树结构,注意此方法将会改变原数组数据                      | `(data: Array<TreeNode>, rowKey = 'key', pidKey = 'parent')`                                  | `Array<TreeNode>`       |
| findNode         | 根据节点标识查找节点信息                                               | `(treeNodes: Array<TreeNode>, key: string,keyName: string='key')`                             | `TreeNode \| undefined` |
| findNodeByValue  | 根据节点标识查找节点信息                                               | `(treeNodes: Array<TreeNode>, value: string)`                                                 | `TreeNode \|undefined`  |
| getParent        | 根据节点标识获取其父节点                                               | `(key: string, treeNodes: Array<TreeNode>,keyName: string='key')`                             | `TreeNode \| undefined` |
| getParentByValue | 根据节点标识获取其父节点                                               | `(value: string, treeNodes: Array<TreeNode>)`                                                 | `TreeNode \|undefined`  |
