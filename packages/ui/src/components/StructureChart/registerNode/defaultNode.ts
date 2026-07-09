import G6 from '@antv/g6';
import { linefeed } from '@chloehe/utils';
import { pointParseInt } from '../initConfig';
import type { StructureChartProps } from '../types';

const registerNode = (options: StructureChartProps) => {
  const isTB = options.type === 'TB';
  const nodeName = isTB ? 'rect-node-tb' : 'rect-node-lr';
  const edgeName = isTB ? 'edge-line-tb' : 'edge-line-lr';
  const nodeShape = (cfg: any, group: any) => {
    const isParent = cfg.depth === 0;
    const rect = group.addShape('rect', {
      attrs: {
        radius: 4,
        width: cfg.size[0],
        height: cfg.size[1],
        x: -cfg.size[0] / 2,
        y: -cfg.size[1] / 2,
        stroke: cfg.style.stroke,
        fill: isParent ? cfg.style.stroke : cfg.style.fill,
      },
      name: 'rect-shape',
    });
    group.addShape('text', {
      attrs: {
        x: 0,
        y: 0,
        cursor: 'pointer',
        textAlign: 'center',
        textBaseline: 'middle',
        fontSize: isParent ? 16 : 14,
        fontFamily: 'Microsoft YaHei',
        fill: isParent ? '#fff' : '#3C4353',
        fontWeight: isParent ? 'bold' : 400,
        text: cfg.title
          ? cfg.title.length > 16
            ? linefeed(String(cfg.title), 16)
            : cfg.title
          : '',
      },
      name: 'text-shape',
    });
    return rect;
  };
  const node = G6.registerNode(
    nodeName,
    {
      draw(cfg: any, group) {
        const rect = nodeShape(cfg, group);
        const hideParentIcon = options.hideParentIcon && cfg.depth === 0;
        if (!options.edit && cfg.children && cfg.children.length > 0) {
          group.addShape('marker', {
            attrs: {
              x: isTB ? 20 : 127,
              y: isTB ? 45 : 0,
              fill: '#fff',
              lineWidth: 1,
              r: hideParentIcon ? 0 : 10,
              stroke: hideParentIcon ? 'transparent' : '#909399',
              symbol: cfg.collapsed ? G6.Marker.expand : G6.Marker.collapse,
            },
            modelId: cfg.id,
            name: 'collapse-icon',
          });
        }

        if (options?.edit) {
          const isParent = cfg.depth === 0;
          const x = isTB
            ? isParent
              ? 123 - cfg.size[0] / 2
              : 80 - cfg.size[0] / 2
            : isParent
            ? 256 - cfg.size[0] / 2
            : 256 - cfg.size[0] / 2;
          const y = isTB
            ? isParent
              ? 60 - cfg.size[1] / 2
              : 60 - cfg.size[1] / 2
            : isParent
            ? 24 - cfg.size[1] / 2
            : 12 - cfg.size[1] / 2;
          group.addShape('marker', {
            attrs: {
              r: cfg?.hideIcon ? 0 : 10,
              x: x,
              y: y,
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
              r: cfg.depth === 0 || cfg?.hideIcon ? 0 : 10,
              x: isTB ? 165 - cfg.size[0] / 2 : 256 - cfg.size[0] / 2,
              y: isTB ? 60 - cfg.size[1] / 2 : 12,
              fill: '#fff',
              lineWidth: 2,
              stroke: '#ff4d4f',
              cursor: 'pointer',
              symbol: G6.Marker.collapse,
            },
            name: 'remove-item',
          });
        }
        return rect;
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
      /* 边样式 */
      const shape = group.addShape('path', {
        attrs: {
          stroke: cfg?.style?.stroke,
          endArrow: options.endArrow && {
            path: 'M 7,0 L 0, 4 L 10,0 L 0, -4 Z',
            fill: cfg?.style?.fill,
            d: isTB ? 35 : 10,
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
                ['L', endPointX / 3 + (2 / 3) * startPointX, startPointY],
                ['L', endPointX / 3 + (2 / 3) * startPointX, endPointY],
                ['L', endPointX, endPointY],
              ],
        },
      });
      /* 边label样式 */
      if (cfg.label) {
        group.addShape('text', {
          attrs: {
            fontSize: 14,
            text: cfg.label,
            fill: cfg?.style?.stroke,
            textBaseline: 'middle',
            x: isTB ? endPointX + 13 : endPointX - 80,
            y: isTB ? endPointY - 38 : endPointY - 12,
          },
        });
      }
      return shape;
    },
  });
  return { node, edge };
};

export default registerNode;
