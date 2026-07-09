//  TreeNode 类型定义
interface TreeNode {
  /**
   * 唯一标识
   */
  key: string;
  /**
   * 值，需唯一
   */
  value?: string;
  /**
   * 标题
   */
  title: string;
  /**
   * 父节点ID
   */
  parent?: string;
  /**
   * 描述
   */
  description?: string;
  /**
   * 子节点
   */
  children?: TreeNode[];
  [key: string]: any;
}

/**
 * 递归处理数据，可用数据加工、数据处理，比如增加/移除/调整某些属性（值）
 * @param treeNodes 树形节点数组
 * @param func 处理函数，接收当前节点和其父节点
 */
function loopData<T extends TreeNode>(
  treeNodes: T[],
  func: (originalData: T, originalDataParent?: T) => void,
): void {
  treeNodes.forEach((node) => {
    func(node);
    if (node.children && node.children.length > 0) {
      // 使用类型断言确保类型匹配
      loopData(node.children as T[], func);
    }
  });
}

/**
 * 将树形数据扁平化
 * @param treeNodes 树形节点数组
 * @returns 扁平化后的节点数组
 */
function flatTreeData<T extends TreeNode>(treeNodes: T[]): T[] {
  let result: T[] = [];
  treeNodes.forEach((node) => {
    result.push(node);
    if (node.children && node.children.length > 0) {
      // 使用类型断言确保类型匹配
      result = result.concat(flatTreeData(node.children as T[]));
    }
  });
  return result;
}

/**
 * 简单数组转换为树结构,注意此方法将会改变原数组数据
 * @param data 节点数组
 * @param rowKey 节点标识字段名，默认为 'key'
 * @param pidKey 父节点标识字段名，默认为 'parent'
 * @returns 树形结构的节点数组
 */
function list2Tree<T extends TreeNode>(
  data: T[],
  rowKey = 'key',
  pidKey = 'parent',
): T[] {
  const map: { [key: string]: T } = {};
  const tree: T[] = [];

  data.forEach((item) => {
    map[item[rowKey as keyof T]] = item;
  });

  data.forEach((item) => {
    const parent = map[item[pidKey as keyof T]];
    if (parent) {
      if (!parent.children) {
        parent.children = [];
      }
      parent.children.push(item);
    } else {
      tree.push(item);
    }
  });

  return tree;
}

/**
 * 根据节点标识查找节点信息
 * @param treeNodes 树形节点数组
 * @param key 节点标识
 * @param keyName 节点标识字段名，默认为 'key'
 * @returns 找到的节点信息，未找到则返回 undefined
 */
function findNode<T extends TreeNode>(
  treeNodes: T[],
  key: string,
  keyName: string = 'key',
): T | undefined {
  for (const node of treeNodes) {
    if (node[keyName as keyof T] === key) {
      return node;
    }
    if (node.children && node.children.length > 0) {
      // 使用类型断言确保类型匹配
      const found = findNode(node.children as T[], key, keyName);
      if (found) {
        return found;
      }
    }
  }
  return undefined;
}

/**
 * 根据节点标识查找节点信息
 * @param treeNodes 树形节点数组
 * @param value 节点标识
 * @returns 找到的节点信息，未找到则返回 undefined
 */
function findNodeByValue<T extends TreeNode>(
  treeNodes: T[],
  value: string,
): T | undefined {
  return findNode(treeNodes, value, 'value');
}

/**
 * 根据节点标识获取其父节点
 * @param key 节点标识
 * @param treeNodes 树形节点数组
 * @param keyName 节点标识字段名，默认为 'key'
 * @returns 父节点信息，未找到则返回 undefined
 */
function getParent<T extends TreeNode>(
  key: string,
  treeNodes: T[],
  keyName: string = 'key',
): T | undefined {
  const flat = flatTreeData(treeNodes);
  for (const node of flat) {
    if (node.children) {
      for (const child of node.children as T[]) {
        if (child[keyName as keyof T] === key) {
          return node;
        }
      }
    }
  }
  return undefined;
}

/**
 * 根据节点标识获取其父节点
 * @param value 节点标识
 * @param treeNodes 树形节点数组
 * @returns 父节点信息，未找到则返回 undefined
 */
function getParentByValue<T extends TreeNode>(
  value: string,
  treeNodes: T[],
): T | undefined {
  return getParent(value, treeNodes, 'value');
}

export {
  findNode,
  findNodeByValue,
  flatTreeData,
  getParent,
  getParentByValue,
  list2Tree,
  loopData,
};
