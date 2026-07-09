/**
 * 请求结果对象
 */
export type RequestResult<T> = {
  code: number;
  data: T;
  message?: string;
};

/**
 * 请求参数类型
 */
export type RequestParam = {
  [name: string]: any; // 额外的参数
};

export type StructureChartProps = {
  /**
   * @description 默认数据
   */
  dataSource?: TreeNodeType | DomNodeType;
  /**
   * @description 图表渲染类型(TB上下/LR左右/H根节点居中子节点两侧分布)
   */
  type: 'TB' | 'LR' | 'H';
  /**
   * @description 节点渲染模式
   * @default default
   */
  mode?: 'default' | 'html';
  /**
   * @description 图表边线箭头是否展示
   * @default hide
   */
  endArrow?: 'show' | 'hide';
  /**
   * @description 是否隐藏根节点折叠Icon
   * @default false
   */
  hideParentIcon?: boolean;
  /**
   * @description 节点宽度
   * @default 245
   */
  width?: number;
  /**
   * @description 节点高度
   * @default 48
   */
  height?: number;
  /**
   * @description 编辑模式
   * @default false
   * @remarks 编辑模式下，节点可以新增子节点，删除节点
   */
  edit?: boolean;
  /**
   * @description 是否展示工具栏
   */
  toolbar?:
    | boolean
    | {
        /**
         * @description 下载文件名
         */
        downloadFileName?: string;
        /**
         * @description 自定义下载图片,返回Base64图片地址
         */
        onDownload?: (url: string) => void;
      };
  /**
   * @description 是否展示节点鼠标悬停内容
   */
  tooltip?: (nodeDate: TreeNodeType | DomNodeType) => string | HTMLElement;
  /**
   * @description 节点点击事件
   */
  onNodeClick?: (
    nodeDate: TreeNodeType | DomNodeType,
    updateNode: (node: TreeNodeType | DomNodeType) => void,
  ) => void;
  /**
   * @description 节点新增事件
   */
  onNodeAdd?: (
    parent: TreeNodeType | DomNodeType,
  ) => TreeNodeType | DomNodeType;
  /**
   * 请求参数
   */
  params?: RequestParam;
  /**
   * 异步获取数据
   */
  request?: (
    params: RequestParam,
  ) => Promise<RequestResult<TreeNodeType | DomNodeType>>;
  /**
   * 远程加载数据前回调函数，返回false，则阻止远程请求数据
   */
  onBeforeLoad?: (params?: RequestParam) => boolean;
  /**
   * 异步加载数据成功回调函数
   */
  onLoadSuccess?: (data: TreeNodeType | DomNodeType) => void;
  /**
   * 异步加载数据失败回调函数
   */
  onLoadFail?: () => void;
  /**
   * 异步加载数据异常回调函数
   */
  onLoadError?: (error: Error) => void;
};

// Node Data Type
export type TreeNodeType = {
  /**
   * 节点ID
   */
  id: string;
  /**
   * 节点title
   */
  title?: string;
  /**
   * 节点皮肤
   */
  skin: string;
  /**
   * 节点边展示内容
   */
  label?: string;
  /**
   * 子节点数据
   */
  children?: TreeNodeType[];
  /**
   * 节点深度
   */
  depth?: number;
  /**
   * 是否隐藏图标
   */
  hideIcon?: boolean;
  /**
   * 节点hover时展示数据，配合tooltip使用
   */
  description?: Record<string, any>;
};

// Dom Data Type
export type DomNodeType = {
  /**
   * 节点ID
   */
  id: string;
  /**
   * 节点dom内容
   */
  html: string;
  /**
   * 节点title
   */
  title?: string;
  /**
   * 节点及边皮肤
   */
  skin: string;
  /**
   * 节点宽度
   */
  width: number;
  /**
   * 节点高度
   */
  height: number;
  /**
   * 子级节点
   */
  children?: DomNodeType[];
  /**
   * 节点深度
   */
  depth?: number;
  /**
   * 是否隐藏图标
   */
  hideIcon?: boolean;
  /**
   * 节点hover时展示数据，配合tooltip使用
   */
  description?: Record<string, any>;
};

export type GraphOption = {
  container: HTMLElement;
  options: StructureChartProps;
  width: number;
  height: number;
};
