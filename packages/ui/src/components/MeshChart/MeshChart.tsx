/* eslint-disable @typescript-eslint/no-unused-expressions */
import type { Graph, GraphData } from '@antv/g6';
import G6 from '@antv/g6';
import { ConfigProvider, Spin } from 'antd';
import { filter, head, includes } from 'lodash';
import React, { PureComponent, RefObject } from 'react';
import { getPlugins } from '../StructureChart/plugins';
import registerGridNode from './registerGridNode';
import './style/index';
import type { GridNodeType, MeshChartProps } from './types';

class MeshChart extends PureComponent<MeshChartProps, { loading: boolean }> {
  static contextType = ConfigProvider.ConfigContext;
  declare context: React.ContextType<typeof ConfigProvider.ConfigContext>;
  containerRef: RefObject<HTMLDivElement> = React.createRef();
  constructor(props: MeshChartProps) {
    super(props);
    this.state = {
      loading: false,
    };
  }

  componentDidMount() {
    const { dataSource, params = {} } = this.props;
    if (dataSource) this.initChart(dataSource);
    const request = this.isRequest(params);
    if (request) this.loadSourceData(request, params);
  }

  /** 异步数据 */
  loadSourceData = (request: any, param?: any) => {
    const { onLoadSuccess, onLoadFail, onLoadError } = this.props;
    this.setState({ loading: true });
    request({ ...param })
      .then((result: any) => {
        const { success, data } = result;
        if (success) {
          this.initChart(data);
          this.setState({ loading: false });
          onLoadSuccess && onLoadSuccess(data);
          return Promise.resolve();
        } else {
          onLoadFail && onLoadFail();
        }
      })
      .catch((e: any) => onLoadError && onLoadError(e))
      .finally(() => this.setState({ loading: false }));
  };

  /** 是否获取异步数据 */
  isRequest = (param: Record<string, any>) => {
    const { request, onBeforeLoad } = this.props;
    if (!request) return;
    if (onBeforeLoad && onBeforeLoad(param) === false) return;
    return request;
  };

  /** 实例化图表 */
  initChart = (data: GridNodeType[]) => {
    const { legend } = this.props;
    const options = legend ? this.initOptions(data) : this.props;
    const container: any = this.containerRef.current;
    const graph = this.initGraph(container, options);
    const graphData: any = this.resetData(data, options);
    graph.data(graphData);
    this.gridEvent(graph, container);
    graph.render();
  };

  /* 过滤合并图例数据和节点数据,规避节点分类与图例内容不一致 */
  initOptions = (data: GridNodeType[]) => {
    const option = this.props;
    const node = option?.legend?.node;
    const filterData: any[] = [];
    data.forEach((item) => {
      if (!filterData.some((elem) => elem.category === item.category))
        filterData.push(item);
    });
    const factoryNodes = (item: any, i: number) => {
      if (node && i > node.length - 1) {
        option.legend.node = [
          ...node,
          { label: item.category, color: item.skin },
        ];
        return;
      }
      if (node && i > filterData.length - 1) {
        node.splice(i);
        return;
      }
    };
    const mergeArray: any =
      node && node.length >= filterData.length ? node : filterData;
    mergeArray.forEach((item: any, i: number) => factoryNodes(item, i));
    return option;
  };

  /* 构建图表实例 */
  initGraph = (container: HTMLElement, options: MeshChartProps) => {
    const width = container.scrollWidth;
    const height = container.scrollHeight || 600;
    if (container.parentElement) {
      container.parentElement.style.position = 'relative';
    }
    const graph = new G6.Graph({
      container,
      width,
      height,
      fitView: true,
      renderer: 'svg',
      linkCenter: true,
      fitViewPadding: [55, 5, 45, 5],
      modes: {
        default: ['drag-canvas', 'zoom-canvas'],
      },
      plugins: this.initPlugins(options, { width, height }),
      defaultNode: {
        type: 'grid-node',
        labelCfg: { fontSize: 14, fontWeight: 400 },
      },
      defaultEdge: { type: 'grid-edge' },
      layout: {
        type: 'radial',
        unitRadius: 260,
        linkDistance: 350,
        preventOverlap: true,
      },
    });
    registerGridNode(G6);
    return graph;
  };

  /* 插件配置 /工具栏/提示/图例 */
  initPlugins = (options: any, size: Record<string, any>): any[] => {
    const { legend, toolbar, tooltip } = options;
    const plugins = getPlugins(toolbar, tooltip, 'Grid', size);
    /* 图表下方图例 */
    if (legend) {
      const nodes =
        (legend.node &&
          legend.node.map((node: any) => ({
            size: 10,
            id: node.label,
            label: node.label,
            style: { fill: node.color || node.skin },
          }))) ||
        [];
      const edges =
        (legend.edge &&
          legend.edge.map((edge: any) => ({
            id: edge.label,
            label: edge.label,
            style: {
              width: 14,
              stroke: edge.color,
              endArrow: {
                path: 'M 0,0 L 4,2 L 4,-2 Z',
                fill: edge.color,
                stroke: edge.color,
              },
            },
          }))) ||
        [];
      const data = { nodes, edges };
      const Legend = new G6.Legend({
        data,
        align: 'center',
        layout: 'horizontal',
        position: 'bottom',
        vertiSep: 20 /* 图例之间的竖直间距 */,
        horiSep: 20,
        offsetY: 65,
        padding: [0, 16, 6, 16],
        containerStyle: { fill: '#fff', lineWidth: 1, stroke: null },
        title: ' ',
        titleConfig: { offsetY: -8 },
      });
      plugins.push(Legend as any);
    }
    return plugins;
  };

  /* 转换Grid图表所需数据格式 */
  resetData = (data: GridNodeType[], options: MeshChartProps): GraphData => {
    const { legend } = options;
    const { node, edge } = legend || {};
    const nodes = this.initNodes(data, node);
    const edges = this.initEdges(data, edge);
    return { nodes, edges };
  };

  /* 初始化节点数据和样式 */
  initNodes = (data: GridNodeType[], legendNode?: any): GraphData['nodes'] => {
    data.map((node: any, index: number) => {
      const color = legendNode
        ? head(filter(legendNode, ['label', node.category])).color
        : node.skin
        ? node.skin
        : 'blue';
      node.skin = color;
      if (index === 0) {
        node.isParent = true;
      }
      return node;
    });
    return data as unknown as GraphData['nodes'];
  };

  /* 初始化边数据和样式 */
  initEdges = (
    data: GridNodeType[] | any,
    legendEdge?: any,
  ): GraphData['edges'] => {
    const dataEdges: any[] = [];
    const factoryEdges = (len = 0) => {
      if (data[len]?.targetNode && data[len]?.targetNode.length > 0) {
        /* 图表边默认颜色 */
        let color = '#909399';
        for (const val of data[len].targetNode) {
          if (legendEdge) {
            /* 判断图例边label字段是否包含在data数据label中,是取图例color,否默认'#909399' */
            const obj = filter(legendEdge, (o: any) =>
              includes(val.label, o.label),
            );
            color = obj.length > 0 ? head(obj).color : color;
          }
          dataEdges.push({
            source: data[len].id,
            label: val.label,
            target: val.target,
            style: {
              stroke: color,
              fill: color,
              endArrow: {
                path: 'M 0,0 L  0, 4 L 10,0 L 0, -4 Z',
                fill: color,
                d: 58,
              },
            },
            labelCfg: {
              autoRotate: true,
              refY: 10,
              style: { fill: '#909399', fontSize: 14 },
            },
          });
        }
      }
      // eslint-disable-next-line no-param-reassign
      if (len < data.length - 1) factoryEdges(++len);
    };
    factoryEdges();
    return dataEdges;
  };

  /* 事件监听 */
  gridEvent = (graph: Graph, container: HTMLElement) => {
    let clickState = 0;
    container.addEventListener('click', ({ target }: any) => {
      /* 画布空白处Click取消节点高亮样式 */
      if (!target['id']) {
        clickState = 0;
        this.updateClickState(graph);
      }
    });
    graph.on('click', (e) => {
      clickState = 1;
      this.updateItemNode(graph, e, 'click', clickState);
    });
    graph.on('mousemove', (e) =>
      this.updateItemNode(graph, e, 'mousemove', clickState),
    );
    /* 更新节点边样式 */
    const updateHoverEdge = (graph: Graph, item: any, color: string) =>
      graph.updateItem(item, { labelCfg: { style: { fill: color } } });
    graph.on('edge:mouseenter', (e: any) =>
      updateHoverEdge(graph, e.item, e.item.getModel().style.stroke || 'blue'),
    );
    graph.on('edge:mouseleave', (e) =>
      updateHoverEdge(graph, e.item, '#909399'),
    );
  };

  /** 更新节点click/hover状态 */
  updateItemNode = (
    graph: Graph,
    event: any,
    handlerType: string,
    clickState?: number,
  ) => {
    const { tooltip, onNodeClick } = this.props;
    const domNodes: any = document.getElementsByClassName('grid-dom');
    for (let i = 0; i < domNodes.length; i++) {
      const domNode = domNodes[i];
      const nodeId = domNode.id;
      if (!nodeId) return;
      if (handlerType === 'click') {
        domNode.addEventListener('click', () => {
          this.updateClickState(graph, graph.findById(nodeId), 'nodeClick');
          onNodeClick && onNodeClick(graph.findById(nodeId).getModel() as any);
          tooltip && this.tooltipEvent(graph, event, tooltip);
        });
      }
      /* 如果当前是点击状态,取消hover效果 */
      if (clickState !== 1) {
        domNode.onmouseover = () => {
          this.updateHoverState(graph, 'onmouseover', nodeId);
          tooltip && this.tooltipEvent(graph, event, tooltip, 'show', domNode);
        };
        /* 鼠标移出清除状态 */
        domNode.onmouseout = () => {
          this.updateHoverState(graph, 'onmouseout', nodeId);
          tooltip && this.tooltipEvent(graph, event, tooltip);
        };
      }
    }
  };

  /** 节点tip事件 */
  tooltipEvent = (
    graph: Graph,
    event: any,
    Tooltip: (node: any) => string | HTMLElement,
    show?: string,
    domNode?: any,
  ) => {
    const container = this.containerRef.current;
    const tooltip: any = container?.getElementsByClassName(
      'g6-component-tooltip',
    )[0];
    if (!show) {
      tooltip.style.display = 'none';
      tooltip.style.visibility = 'hidden';
    } else {
      const nodeData = graph.findById(domNode.id).getModel();
      tooltip.style.display = 'unset';
      tooltip.style.visibility = 'visible';
      tooltip.style.top = ~~event.canvasY + 'px';
      tooltip.style.left = ~~event.canvasX - 5 + 'px';
      tooltip.innerHTML = Tooltip(nodeData);
    }
  };

  /* 更新节点Click状态 */
  updateClickState = (graph: Graph, item?: any, event?: string) => {
    graph.setAutoPaint(false);
    if (event === 'nodeClick') {
      graph.getNodes().forEach((node) => {
        graph.clearItemStates(node);
        graph.setItemState(node, 'dark', true);
      });
      graph.setItemState(item, 'dark', false);
      graph.setItemState(item, 'highlight', true);
      graph.getEdges().forEach((edge) => {
        if (edge.getSource() === item) {
          this.updateItemEdgeState(graph, edge, event, 'highlight');
          graph.setItemState(edge.getTarget(), 'dark', false);
          graph.setItemState(edge.getTarget(), 'highlight', true);
          graph.setItemState(edge, 'highlight', true);
          edge.toFront();
        } else if (edge.getTarget() === item) {
          this.updateItemEdgeState(graph, edge, event, 'highlight');
          graph.setItemState(edge.getSource(), 'dark', false);
          graph.setItemState(edge.getSource(), 'highlight', true);
          graph.setItemState(edge, 'highlight', true);
          edge.toFront();
        } else {
          this.updateItemEdgeState(graph, edge, event, 'dark');
          graph.setItemState(edge, 'highlight', false);
          graph.setItemState(edge, 'dark', true);
        }
      });
    } else {
      graph.getNodes().forEach((node) => graph.clearItemStates(node));
      graph.getEdges().forEach((edge) => {
        graph.clearItemStates(edge);
        this.updateItemEdgeState(graph, edge, event, 'clear');
      });
    }
    graph.paint();
    graph.setAutoPaint(true);
  };

  /* 更新节点样式 */
  updateItemEdgeState = (
    graph: Graph,
    edge: any,
    event: any,
    status: string,
  ) => {
    const color = edge.getModel().style.endArrow.fill || '#909399';
    const opacityValue = event === 'nodeClick' && status === 'dark' ? 0.1 : 1;
    graph.updateItem(edge, {
      style: { stroke: color, opacity: opacityValue },
      labelCfg: {
        style: {
          opacity: opacityValue,
          fill:
            status === 'highlight' && event === 'nodeClick' ? color : '#909399',
        },
      },
    });
  };

  /* 更新节点Hover状态 */
  updateHoverState = (graph: Graph, event: string, nodeId: string) => {
    const updateItem = (edge: any, color: string) =>
      graph.updateItem(edge, { labelCfg: { style: { fill: color } } });
    graph.getEdges().forEach((edge: any) => {
      let color: any = '#909399';
      const item = graph.findById(nodeId);
      if (
        event === 'onmouseover' &&
        (edge.getSource() === item || edge.getTarget() === item)
      ) {
        color = edge.getModel().style.stroke;
      }
      updateItem(edge, color);
      edge.toFront();
    });
  };

  render() {
    const prefixCls = 'hqh';
    const className = `${prefixCls}-structure-chart`;
    return (
      <div className={className}>
        <Spin spinning={this.state.loading}>
          <div
            className={`${className}-container ${prefixCls}-mesh-chart`}
            ref={this.containerRef}
          />
        </Spin>
      </div>
    );
  }
}

export default MeshChart;
