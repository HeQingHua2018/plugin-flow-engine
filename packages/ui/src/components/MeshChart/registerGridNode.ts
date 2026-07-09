const registerGridNode = (G6: any) => {
  const node = G6.registerNode(
    'grid-node',
    {
      draw(cfg: any, group: any) {
        const size = cfg.isParent ? 110 : 95;
        const styles = this.getShapeStyle(cfg);
        const html = document.createElement('div');
        const children = document.createElement('div');
        children.id = cfg.id;
        children.innerHTML = cfg.title;
        children.className = 'grid-dom';
        if (cfg.isParent) {
          children.classList.add('grid-dom-parent');
        }
        const nodeColor = G6.Util.getColorSetsBySubjectColors([cfg.skin])[0];
        children.style.background = nodeColor.mainStroke;
        children.style.border = `1px solid ${nodeColor.comboHighlightStroke}`;
        html.appendChild(children);
        const keyShape = group.addShape('dom', {
          attrs: { ...styles, html: html.innerHTML, width: size, height: size },
          name: 'circle-shape',
        });
        return keyShape;
      },
      // 响应状态变化
      setState(name: string, value: any, item: any) {
        const shape = item.getContainer().get('children')[0];
        if (name === 'highlight') shape.attr({ opacity: 1 });
        if (name === 'dark') shape.attr({ opacity: value ? 0.1 : 1 });
      },
    },
    'circle',
  );

  const edge = G6.registerEdge(
    'grid-edge',
    {
      setState(name: string, value: any, item: any) {
        const shape = item.getContainer().get('children')[0];
        const color = item.getModel().style.stroke;
        // 更新边样式
        if (name === 'highlight') shape.attr({ stroke: color, fill: color });
        if (name === 'dark') shape.attr({ stroke: '#C0C3C8' });
      },
    },
    'line',
  );
  return { node, edge };
};

export default registerGridNode;
