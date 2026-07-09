import type { EdgeConfig } from '@antv/g6';
import G6, { TreeGraph } from '@antv/g6';
import { ConfigProvider, Spin } from 'antd';
import { debounce, random } from 'lodash';
import React, { PureComponent, RefObject } from 'react';
import { getGraphOptions } from './initConfig';
import './style/index.less';
import type {
  DomNodeType,
  RequestParam,
  StructureChartProps,
  TreeNodeType,
} from './types';

class StructureChart extends PureComponent<
  StructureChartProps,
  { loading: boolean }
> {
  static contextType = ConfigProvider.ConfigContext;
  declare context: React.ContextType<typeof ConfigProvider.ConfigContext>;
  data: any;
  declare graph: TreeGraph;
  colorSets: string[] = [];
  option: StructureChartProps;
  edgesMap: Record<string, any> = {};
  containerRef: RefObject<HTMLDivElement> = React.createRef();
  constructor(props: StructureChartProps) {
    super(props);
    this.option = props;
    this.state = {
      loading: false,
    };
  }

  componentDidMount() {
    const { dataSource, params = {} } = this.props;
    if (dataSource) this.initChart(dataSource);
    const request = this.isRequest(params);
    if (request) {
      this.setState({ loading: true });
      this.loadSourceData(request, params);
    }
  }

  /** 是否获取异步数据 */
  isRequest = (param: RequestParam) => {
    const { request, onBeforeLoad } = this.props;
    if (!request) return;
    if (onBeforeLoad && onBeforeLoad(param) === false) return;
    return request;
  };

  /** 获取异步数据 */
  loadSourceData = (request: any, param?: any) => {
    const { onLoadSuccess, onLoadFail, onLoadError } = this.props;
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

  /* 实例化图表 */
  initChart = (data: TreeNodeType | DomNodeType) => {
    this.data = this.convertData(data);
    this.initGraph();
    this.initGraphData();
    this.addEvent();
    this.renderGraph();
  };

  getStyle = (color = '#1D76FE') => {
    const colors = G6.Util.getColorSetsBySubjectColors([color]);
    return {
      fill: colors[0]?.mainFill,
      stroke: colors[0]?.mainStroke,
    };
  };
  /* 转换 Data 数据 */
  convertData = (nodes: any) => {
    const edges: any = [];
    const createEdges = (node: any) => {
      if (node.children) {
        node.children.forEach((childNode: any) => {
          edges.push({
            source: node.id,
            target: childNode.id,
            label: childNode.label || '',
            style: this.getStyle(childNode.skin),
          });
          createEdges(childNode);
        });
      }
      node.style = this.getStyle(node.skin);
    };
    createEdges(nodes);
    return { nodes, edges };
  };

  initGraph = () => {
    this.graph = getGraphOptions(
      this.containerRef?.current as any,
      this.option,
    );
    /* 处理画布拖拽节点轨迹有残影 */
    this.graph.get('canvas').set('localRefresh', false);
  };

  /** 初始化图表数据 */
  initGraphData = () => {
    // this.defNodes();
    this.defEdges();
    this.graph.data(this.data.nodes);
  };

  // defNodes = () => {
  //   this.graph.node((node) => {
  //     const color = G6.Util.getColorSetsBySubjectColors([
  //       node.skin || "#1D76FE",
  //     ]);
  //     return {
  //       style: { fill: color[0].mainFill, stroke: color[0].mainStroke },
  //     };
  //   });
  // };

  defEdges = () => {
    this.graph.edge((edge: EdgeConfig) =>
      this.data.edges.find(
        (e: any) => e.source === edge.source && e.target === edge.target,
      ),
    );
  };

  /* Dom节点事件 */
  nodeChange = (event: any, handlerType?: string) => {
    const { onNodeClick, tooltip } = this.option;
    const container = this.containerRef.current;
    const domNodes: any = container?.getElementsByClassName('dom-node');
    const tips: any = container?.getElementsByClassName(
      'g6-component-tooltip',
    )[0];
    let flags = false;
    for (let i = 0; i < domNodes.length; i++) {
      const domNode = domNodes[i];
      if (!domNode.id) return;
      const nodeData: any = this.graph.findById(domNode.id).getModel();
      if (handlerType) {
        /* onClick */
        domNode.addEventListener('click', () => {
          if (!flags) {
            flags = !flags;
            onNodeClick &&
              onNodeClick(nodeData, (node) => {
                this.graph.updateChild(node, nodeData.id);
              });
          }
        });
      }
      if (tooltip) {
        /* onMouse */
        domNode.onmouseover = () => {
          tips.style.visibility = 'visible';
          tips.style.display = 'unset';
          tips.style.top = event.canvasY + 'px';
          tips.style.left = event.canvasX + 'px';
          tips.innerHTML = tooltip(nodeData);
        };
        domNode.onmouseout = () => {
          tips.style.visibility = 'hidden';
          tips.style.display = 'none';
        };
      }
    }
  };

  /* 添加自定义事件 */
  addEvent = () => {
    const { type, mode = 'default', onNodeClick, onNodeAdd } = this.option;
    const handleCollapse = (id: string) => {
      const item = this.graph.findById(id);
      const nodeModel = item.getModel();
      const box = item.getBBox();
      const marker = item
        .get('group')
        .find((ele: any) => ele.get('name') === 'collapse-icon');
      nodeModel.collapsed = !nodeModel.collapsed;
      if (type === 'TB') {
        mode === 'html'
          ? marker.attr(
              'x',
              nodeModel.collapsed ? box.width / 2 - 50 : box.width / 2 - 30,
            )
          : marker.attr('x', nodeModel.collapsed ? 0 : 20);
      }
      marker.attr(
        'symbol',
        nodeModel.collapsed ? G6.Marker.expand : G6.Marker.collapse,
      );
      this.graph.layout();
    };
    const handleAddItem = (model: any) => {
      if (!model.children) model.children = [];
      const defaultNode = { id: `${model.id}-${random(1000)}` };
      const node: any = onNodeAdd ? onNodeAdd(model) : defaultNode;
      node.id = node?.id || defaultNode.id;
      if (mode === 'html') {
        node.html = node?.html || `<div></div>`;
        node.width = node?.width || 120;
        node.height = node?.height || 64;
      }
      const style = this.getStyle(node?.skin);
      this.data.edges.push({
        source: model.id,
        target: node.id,
        style: style,
        label: node.label || '',
      });
      node.style = style;
      this.graph.addChild(node, model.id);
    };

    const debouncedHandle = debounce((model: any) => {
      handleAddItem(model);
    }, 400);
    this.graph.on('node:click', (evt:any) => {
      const { item, target } = evt;
      const targetType = target.get('type');
      const name = target.get('name');
      const model: any = item?.getModel();
      if (targetType === 'marker') {
        if (name === 'collapse-icon') handleCollapse(target.get('modelId'));
        if (name === 'add-item') {
          debouncedHandle(model);
        }
        // 删除节点
        if (name === 'remove-item') {
          this.graph.removeChild(model.id);
          // 更新边数据
          for (let i = this.data.edges.length - 1; i >= 0; i--) {
            const item = this.data.edges[i];
            if (item.target === model.id || item.source === model.id) {
              this.data.edges.splice(i, 1);
            }
          }

          // this.graph.getEdges().forEach((edge) => {
          //   const id = `${edge.getModel().source}:${edge.getModel().target}`;
          //   if (this.edgesMap[id]) {
          //     edge.update(this.edgesMap[id]);
          //   }
          // });
        }
      } else {
        /* 节点点击事件 */
        onNodeClick &&
          onNodeClick(model, (node) => {
            this.graph.updateChild(node, model.id);
          });
      }
    });
    /* 画布dom节点渲染,手动触发每个节点click/hover事件 */
    if (mode === 'html') {
      this.graph.on('click', (e: any) => this.nodeChange(e, 'click'));
      this.graph.on('mousemove', (e: any) => this.nodeChange(e));
    }
  };

  renderGraph = () => {
    this.graph.render();
    const nodeLength = this.graph.getNodes().length;
    if (nodeLength < 5) {
      /*节点小于5个的时候，不自适应画布大小*/
      this.graph.zoom(nodeLength / 10 + 0.3, {
        x: this.graph.getWidth() / 2,
        y: this.graph.getHeight() / 2,
      });
    } else {
      this.graph.fitView();
    }
  };

  render() {
    const className = `hqh-structure-chart`;
    return (
      <div className={className}>
        <Spin spinning={this.state.loading}>
          <div className={`${className}-container`} ref={this.containerRef} />
        </Spin>
      </div>
    );
  }
}

export default StructureChart;
