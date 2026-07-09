/* eslint-disable @typescript-eslint/no-unused-expressions */
import G6 from '@antv/g6';
import { isBoolean } from 'lodash';
import saveSvg from 'save-svg-as-png';
import type { StructureChartProps } from './types';

/* 图表插件 */

/* 工具栏 */
export const getToolbar = (
  toolbar: any,
  type: string,
  size: Record<string, any>,
) => {
  const toolBar = {
    className: 'chart-toolbar',
    getContent: () => {
      return `<ul class='g6-component-toolbar'>
                    ${
                      type !== 'Grid'
                        ? `<li code='open'>
                        <svg class="icon" fill='rgba(29, 118, 254, 0.75)' viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="23" height="23">
                            <path d="M516.096 84.65c236.773 0 428.715 191.943 428.715 428.715 0 236.773-191.942 428.715-428.715 428.715-236.773 0-428.715-191.942-428.715-428.715 0-236.772 191.942-428.714 428.715-428.714z m0 81.92c-191.53 0-346.795 155.266-346.795 346.795 0 191.53 155.266 346.795 346.795 346.795 191.53 0 346.795-155.265 346.795-346.795 0-191.53-155.266-346.794-346.795-346.794z m-153.7 260.783l0.678 0.708 153.628 164.467 152.332-164.07c15.168-16.338 40.559-17.509 57.16-2.807l0.726 0.659c16.338 15.168 17.508 40.559 2.807 57.16l-0.66 0.726-182.256 196.303c-15.95 17.18-42.972 17.455-59.276 0.795l-0.674-0.704L303.21 483.982c-15.442-16.532-14.559-42.451 1.972-57.893 16.292-15.218 41.702-14.581 57.215 1.264z" p-id="5585"></path>
                        </svg>
                      </li>
                      <li code='close'>
                        <svg class="icon" fill='rgba(29, 118, 254, 0.75)' viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="23" height="23">
                            <path d="M516.096 942.08c236.773 0 428.715-191.942 428.715-428.715 0-236.772-191.942-428.714-428.715-428.714-236.773 0-428.715 191.942-428.715 428.714 0 236.773 191.942 428.715 428.715 428.715z m0-81.92c-191.53 0-346.795-155.265-346.795-346.795 0-191.53 155.266-346.794 346.795-346.794 191.53 0 346.795 155.265 346.795 346.794 0 191.53-155.266 346.795-346.795 346.795z m-153.7-260.782l0.678-0.709 153.628-164.466 152.332 164.07c15.168 16.338 40.559 17.509 57.16 2.807l0.726-0.659c16.338-15.169 17.508-40.56 2.807-57.16l-0.66-0.726-182.256-196.303c-15.95-17.18-42.972-17.456-59.276-0.795l-0.674 0.704L303.21 542.749c-15.442 16.531-14.559 42.45 1.972 57.893 16.292 15.218 41.702 14.58 57.215-1.264z" p-id="26143"></path>
                        </svg>
                      </li>`
                        : ''
                    }
                      <li code='download'>
                        <svg class="icon" fill='rgba(29, 118, 254, 0.75)'  viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="23" height="23" >
                            <path d="M859.9 780H164.1c-4.5 0-8.1 3.6-8.1 8v60c0 4.4 3.6 8 8.1 8h695.8c4.5 0 8.1-3.6 8.1-8v-60c0-4.4-3.6-8-8.1-8zM505.7 669a8 8 0 0012.6 0l112-141.7c4.1-5.2.4-12.9-6.3-12.9h-74.1V176c0-4.4-3.6-8-8-8h-60c-4.4 0-8 3.6-8 8v338.3H400c-6.7 0-10.4 7.7-6.3 12.9l112 141.8z"></path>
                        </svg>
                      </li>
                      <li code='fullScreen'>
                        <svg class="icon" fill='rgba(29, 118, 254, 0.75)' viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="23" height="24">
                            <path d="M236.8 192 384 192c19.2 0 32-12.8 32-32C416 140.8 403.2 128 384 128L160 128c0 0 0 0-6.4 0 0 0-6.4 0-6.4 0C140.8 134.4 134.4 140.8 128 147.2c0 0 0 6.4 0 6.4 0 0 0 0 0 6.4L128 384c0 19.2 12.8 32 32 32S192 403.2 192 384L192 236.8l217.6 217.6c12.8 12.8 32 12.8 44.8 0l0 0c12.8-12.8 12.8-32 0-44.8L236.8 192zM864 608C844.8 608 832 620.8 832 640l0 147.2L614.4 569.6c-12.8-12.8-32-12.8-44.8 0l0 0c-12.8 12.8-12.8 32 0 44.8l217.6 217.6L640 832c-19.2 0-32 12.8-32 32 0 19.2 12.8 32 32 32l224 0c0 0 0 0 6.4 0 0 0 6.4 0 6.4 0 6.4-6.4 12.8-12.8 19.2-19.2 0 0 0-6.4 0-6.4 0 0 0 0 0-6.4L896 640C896 620.8 883.2 608 864 608z" p-id="9731"></path>
                        </svg>
                      </li>
                      <li code='zoomIn'>
                        <svg class="icon" fill='rgba(29, 118, 254, 0.75)' viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24">
                            <path d="M639.936 416a32 32 0 0 1-32 32h-256a32 32 0 0 1 0-64h256a32 32 0 0 1 32 32z m289.28 503.552a41.792 41.792 0 0 1-58.752-6.656l-182.656-213.248A349.76 349.76 0 0 1 480 768 352 352 0 1 1 832 416a350.4 350.4 0 0 1-83.84 227.712l185.664 216.768a41.856 41.856 0 0 1-4.608 59.072zM479.936 704c158.784 0 288-129.216 288-288S638.72 128 479.936 128a288.32 288.32 0 0 0-288 288c0 158.784 129.216 288 288 288z" p-id="3853"></path>
                        </svg>
                      </li>
                      <li  code='zoomOut'>
                        <svg class="icon" fill='rgba(29, 118, 254, 0.75)' viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="21" height="24">
                            <path d="M658.432 428.736a33.216 33.216 0 0 1-33.152 33.152H525.824v99.456a33.216 33.216 0 0 1-66.304 0V461.888H360.064a33.152 33.152 0 0 1 0-66.304H459.52V296.128a33.152 33.152 0 0 1 66.304 0V395.52H625.28c18.24 0 33.152 14.848 33.152 33.152z m299.776 521.792a43.328 43.328 0 0 1-60.864-6.912l-189.248-220.992a362.368 362.368 0 0 1-215.36 70.848 364.8 364.8 0 1 1 364.8-364.736 363.072 363.072 0 0 1-86.912 235.968l192.384 224.64a43.392 43.392 0 0 1-4.8 61.184z m-465.536-223.36a298.816 298.816 0 0 0 298.432-298.432 298.816 298.816 0 0 0-298.432-298.432A298.816 298.816 0 0 0 194.24 428.8a298.816 298.816 0 0 0 298.432 298.432z"></path>
                        </svg>
                      </li>
                    </ul> `;
    },
    handleClick: (code: string, graph: any) => {
      const currentZoom = graph.getZoom();
      const center = {
        x: graph.getContainer().clientWidth / 2,
        y: graph.getContainer().clientHeight / 2,
      };
      const tree = type !== 'Grid';
      const item = tree && graph.findById(graph?.cfg.data.id);
      const nodeModel = tree && item.getModel();
      const marker =
        tree &&
        item
          .get('group')
          .find(
            (ele: { get: (arg0: string) => string }) =>
              ele.get('name') === 'collapse-icon',
          );
      switch (code) {
        case 'open': {
          const openAll = (node: any) => {
            if (node.children)
              node.children.forEach((childNode: any) => openAll(childNode));
            node.collapsed = false;
            marker.attr('symbol', G6.Marker.collapse);
            type === 'TB' && marker.attr('x', 20);
          };
          openAll(nodeModel);
          graph.layout();
          break;
        }
        case 'close': {
          nodeModel.collapsed = true;
          marker.attr('symbol', G6.Marker.expand);
          type === 'TB' && marker.attr('x', 0);
          graph.layout();
          break;
        }
        case 'zoomOut': {
          const maxZoom = graph.get('maxZoom');
          if (currentZoom > maxZoom) return;
          graph.zoomTo(currentZoom + 0.05, center);
          break;
        }
        case 'zoomIn': {
          const minZoom = graph.get('minZoom');
          if (currentZoom < minZoom) return;
          graph.zoomTo(currentZoom - 0.05, center);
          break;
        }
        case 'fullScreen': {
          const container = graph?.cfg.container;
          if (document.fullscreenElement) {
            graph.changeSize(size.width, size.height);
            document.exitFullscreen();
          } else {
            graph.changeSize(
              document.body.clientWidth,
              document.body.clientHeight,
            );
            container.requestFullscreen();
          }
          graph.fitView();
          break;
        }
        case 'download': {
          /* 自定义下载,返回图片地址 */
          const svg = graph?.cfg.container.firstElementChild;
          if (toolbar && !isBoolean(toolbar) && toolbar.onDownload) {
            saveSvg
              .svgAsPngUri(svg, { scale: 2, backgroundColor: '#fafafa' })
              .then((uri: any) => toolbar.onDownload(uri));
          } else {
            const name = toolbar.downloadFileName
              ? toolbar.downloadFileName
              : 'graph';
            saveSvg.saveSvgAsPng(svg, name, {
              scale: 2,
              backgroundColor: '#fafafa',
            });
          }
          break;
        }
      }
    },
  };
  return toolBar;
};

/* 图表插件 */
export const getPlugins = (
  toolbar: StructureChartProps['toolbar'],
  toolTip: StructureChartProps['tooltip'],
  type: any,
  size?: any,
): any[] => {
  const plugins: any[] = [];
  if (toolbar) {
    const ToolBar = new G6.ToolBar(getToolbar(toolbar, type, size));
    plugins.push(ToolBar);
  }
  if (toolTip) {
    const tooltip = new G6.Tooltip({
      offsetX: 0,
      offsetY: 0,
      fixToNode: [1, 0],
      itemTypes: ['node'],
      shouldBegin: (evt: any) => {
        if (evt.target.get('modelId')) return false;
        return true;
      },
    });
    /* 自定义toolTip内容 */
    if (toolTip)
      tooltip._cfgs.getContent = (e: any) => toolTip(e.item.getModel());
    plugins.push(tooltip);
  }
  return plugins;
};
