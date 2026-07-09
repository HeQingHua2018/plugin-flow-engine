/**
 * 请求结果对象
 */
export type RequestResult<T> = {
  code: number;
  data: T;
  message?: string;
};

export type MeshChartProps = {
  /**
   * @description 默认数据 网状图/树节点/自定义DOM
   */
  dataSource?: GridNodeType[];
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
  tooltip?: (nodeDate: GridNodeType) => string | HTMLElement;
  /**
   * @description 图表图例内容
   */
  legend?: {
    // 节点内容
    node?: { label: string; color: string }[];
    //边内容
    edge?: { label: string; color: string }[];
  };
  /**
   * @description 节点点击事件
   */
  onNodeClick?: (nodeDate: GridNodeType) => void;
  /**
   * 请求参数
   */
  params?: Record<string, any>;
  /**
   * 异步获取数据
   */
  request?: (
    params: Record<string, any>,
  ) => Promise<RequestResult<GridNodeType[]>>;
  /**
   * 远程加载数据前回调函数，返回false，则阻止远程请求数据
   */
  onBeforeLoad?: (params?: any) => boolean;
  /**
   * 异步加载数据成功回调函数
   */
  onLoadSuccess?: (data: GridNodeType[]) => void;
  /**
   * 异步加载数据失败回调函数
   */
  onLoadFail?: () => void;
  /**
   * 异步加载数据异常回调函数
   */
  onLoadError?: (error: Error) => void;
};

/** Data类型 */
export type GridNodeType = {
  /**
   * 节点ID
   */
  id: string;
  /**
   * 节点title
   */
  title: string;
  /**
   * 节点皮肤
   */
  skin: string;
  /**
   * 节点类别
   */
  category: string;
  /**
   * 节点hover时展示数据，配合tooltip使用
   */
  description?: Record<string, any>;
  /**
   * 节点指向目标源
   */
  targetNode?: {
    /**
     * 节点指向目标源ID
     */
    target: string;
    /**
     * 节点边线文字
     */
    label?: string;
  }[];
};
