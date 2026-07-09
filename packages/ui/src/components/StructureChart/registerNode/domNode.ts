import G6 from '@antv/g6';
import { pointParseInt } from '../initConfig';
import type { StructureChartProps } from '../types';

const domText = (
  group: any,
  cfg: any,
  nodeColor: any,
  styles: any,
  size: { width: number; height: number },
) => {
  const ele = document.createElement('div');
  ele.innerHTML = cfg.html;
  const html: any = ele.childNodes[0];
  html.id = cfg.id;
  html.className = 'dom-node';
  html.style.cursor = 'pointer';
  html.style.height = '100%';
  html.style.boxSizing = 'border-box';
  /* 根节点深色背景，子节点浅色背景 */
  html.style.background =
    cfg.depth === 0
      ? nodeColor.mainStroke
      : nodeColor.mainFill; /* cfg.skin | nodeColor.mainFill */
  const keyShape = group.addShape('dom', {
    attrs: {
      ...styles,
      html: ele.innerHTML,
      width: cfg.width || size.width, // 节点数据配置宽高优先级高于props配置项
      height: cfg.height || size.height,
    },
  });
  return keyShape;
};

const registerDomNode = (options: StructureChartProps) => {
  const { type, width = 245, height = 48 } = options;
  const isTB = type === 'TB';
  const nodeName = isTB ? 'dom-node-tb' : 'dom-node';
  const edgeName = isTB ? 'dom-line-tb' : 'dom-line';
  const node = G6.registerNode(
    nodeName,
    {
      draw(cfg: any, group) {
        const nodeColor = G6.Util.getColorSetsBySubjectColors([
          cfg.skin || '#91d5ff',
        ])[0];
        const isParent = cfg.depth === 0;
        const styles = (this as any).getShapeStyle(cfg);
        const keyShape = domText(group, cfg, nodeColor, styles, {
          width,
          height,
        });
        const box = keyShape.getBBox();
        const hideParentIcon = options.hideParentIcon && isParent;
        if (!options?.edit && cfg.children && cfg.children.length > 0) {
          if (isTB) {
            group.addShape('marker', {
              attrs: {
                x: box.width / 2 - 30,
                y: box.height,
                fill: '#fff',
                lineWidth: 1,
                r: hideParentIcon ? 0 : 10,
                stroke: hideParentIcon ? 'transparent' : '#909399',
                symbol: cfg.collapsed ? G6.Marker.expand : G6.Marker.collapse,
              },
              modelId: cfg.id,
              name: 'collapse-icon',
            });
          } else {
            group.addShape('marker', {
              attrs: {
                x: box.maxX - (isParent ? 20 : 15),
                y: box.height / 2 - 15,
                fill: 'transparent',
                r: hideParentIcon ? 1 : 10,
                symbol: cfg.collapsed ? G6.Marker.expand : G6.Marker.collapse,
                stroke: hideParentIcon
                  ? 'transparent'
                  : isParent
                  ? '#fff'
                  : nodeColor.mainStroke,
              },
              name: 'collapse-icon',
              modelId: cfg.id,
            });
          }
        }
        if (options?.edit) {
          group.addShape('marker', {
            attrs: {
              r: cfg?.hideIcon ? 0 : 10,
              x: isTB
                ? isParent
                  ? box.width / 2 - 50
                  : box.width / 2 - 70
                : box.maxX + 10,
              y: isTB
                ? isParent
                  ? box.height - 5
                  : box.height
                : isParent
                ? box.height / 2 - 15
                : box.height / 2 - 30,
              fill: '#fff',
              lineWidth: 2,
              stroke: '#73d13d',
              cursor: 'pointer',
              symbol: G6.Marker.expand,
            },
            name: 'add-item',
          });
          group.addShape('marker', {
            attrs: {
              r: isParent || cfg?.hideIcon ? 0 : 10,
              x: isTB ? box.width / 2 - 30 : box.maxX + (isParent ? 15 : 10),
              y: isTB ? box.height : box.height / 2,
              fill: '#fff',
              lineWidth: 2,
              stroke: '#ff4d4f',
              cursor: 'pointer',
              symbol: G6.Marker.collapse,
            },
            name: 'remove-item',
          });
        }
        return keyShape;
      },
      update: undefined,
    },
    'rect',
  );
  const edge = G6.registerEdge(edgeName, {
    draw(cfg, group) {
      const { startPointX, startPointY, endPointX, endPointY } = pointParseInt(
        cfg.startPoint,
        cfg.endPoint,
      );
      const shape = group.addShape('path', {
        attrs: {
          stroke: cfg?.style?.stroke,
          /* 上下结构自定义dom节点边箭头暂不支持展示，节点宽高不同箭头展示位置计算有误 */
          // endArrow: {
          //     path: 'M 7,0 L 0, 4 L 10,0 L 0, -4 Z',
          //     fill: cfg.style.fill,
          //     d: 25,
          // },
          endArrow: options.endArrow === 'show' && {
            path: 'M 7,0 L 0, 4 L 10,0 L 0, -4 Z',
            fill: cfg?.style?.fill,
            d: 10,
          },
          path: isTB
            ? [
                ['M', startPointX, startPointY],
                ['L', startPointX, (startPointY + endPointY) / 2],
                ['L', endPointX, (startPointY + endPointY) / 2],
                ['L', endPointX, endPointY],
              ]
            : [
                ['M', startPointX, startPointY],
                [
                  'L',
                  endPointX / 3 + (2 / 3) * startPointX,
                  startPointY,
                ] /* 三分之一处 */,
                [
                  'L',
                  endPointX / 3 + (2 / 3) * startPointX,
                  endPointY,
                ] /* 三分之二处 */,
                ['L', endPointX, endPointY],
              ],
        },
      });
      return shape;
    },
  });
  return { node, edge };
};

export default registerDomNode;
