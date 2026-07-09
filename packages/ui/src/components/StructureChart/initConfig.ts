import G6 from '@antv/g6';
import { getPlugins } from './plugins';
import registerNode from './registerNode/defaultNode';
import registerDomNode from './registerNode/domNode';
import type { GraphOption, StructureChartProps } from './types';

/* 位置数值取整 */
export const pointParseInt = (startPoint: any, endPoint: any) => ({
  startPointX: ~~startPoint.x,
  startPointY: ~~startPoint.y,
  endPointX: ~~endPoint.x,
  endPointY: ~~endPoint.y,
});

/* 自定义Dom节点 */
export const graphOptionsDom = (option: GraphOption) => {
  const { container, options, width, height } = option;
  const { toolbar, tooltip, type, edit = false } = options;
  const isTB = options.type === 'TB';

  const graph = new G6.TreeGraph({
    container,
    width,
    height,
    fitView: !edit,
    fitViewPadding: [55, 5, 45, 5],
    linkCenter: isTB ? true : false,
    renderer: 'svg',
    modes: {
      default: ['drag-canvas', 'zoom-canvas'],
    },
    plugins: getPlugins(toolbar, tooltip, type, { width, height }),
    defaultNode: {
      type: isTB ? 'dom-node-tb' : 'dom-node',
      preventOverlap: true /* 防止节点重叠 */,
    },
    defaultEdge: {
      type: isTB ? 'dom-line-tb' : 'dom-line',
    },
    layout: {
      type: 'compactBox',
      direction: options.type,
      getId: (d: any) => d.id,
      getVGap: () => (isTB ? 60 : 55) /* 节点纵向间距 */,
      getHGap: () => (isTB ? 10 : 45) /* 节点横向间距 */,
    },
  });
  registerDomNode(options);
  return graph;
};

/* 树状图 */
export const graphOptions = (option: GraphOption) => {
  const { container, options, width, height } = option;
  const { toolbar, tooltip, type, edit = false } = options;
  const isTB = options.type === 'TB';
  const nodeCfg = { width: options.width || 245, height: options.height || 48 };
  const GraphOptions = new G6.TreeGraph({
    container,
    width,
    height,
    fitView: !edit,
    renderer: 'svg',
    fitViewPadding: [55, 5, 45, 5],
    modes: {
      default: ['drag-canvas', 'zoom-canvas'],
    },
    plugins: getPlugins(toolbar, tooltip, type, { width, height }),
    layout: {
      type: 'compactBox',
      direction: options.type,
      getId: (d: any) => d.id,
      getWidth: () => 75,
      getVGap: () => 75 /* 节点纵向间距 */,
      getHGap: () => (isTB ? 140 : 160) /* 节点横向间距 */,
    },
    linkCenter: isTB ? true : false /* 指定边是否连入节点的中心。 */,
    defaultNode: {
      type: isTB ? 'rect-node-tb' : 'rect-node-lr',
      size: [nodeCfg.width, nodeCfg.height],
      preventOverlap: true /* 防止节点重叠 */,
    },
    defaultEdge: {
      type: isTB ? 'edge-line-tb' : 'edge-line-lr',
    },
  });
  registerNode(options);
  return GraphOptions;
};

export const getGraphOptions = (
  container: HTMLElement,
  options: StructureChartProps,
) => {
  if (container?.parentElement) {
    container.parentElement.style.position = 'relative';
  }
  const width = container.scrollWidth;
  const height = container.scrollHeight || 500;
  const option: GraphOption = { container, options, width, height };
  const { mode = 'default' } = options;
  return mode === 'html' ? graphOptionsDom(option) : graphOptions(option);
};
