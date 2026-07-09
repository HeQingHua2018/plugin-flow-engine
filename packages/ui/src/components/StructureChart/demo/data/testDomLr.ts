const styles = `display:flex;flex-direction: column;justify-content: center;padding-left: 8px;border-radius:4px;font-size: 14px;font-weight: 400;`;
const html = `<div style="${styles}">
                <div><span>编码</span><span style="margin-left:20px">...</span></div>
                <div><span>名称</span><span style="margin-left:20px">岗位...</span></div>
            </div>`;
const param = { html, width: 120, height: 64 };

export const domDataLr = {
  id: 'root',
  html: `<div  style="${styles};color:#fff;font-weight:bold;"><div>A01</div><div>A01 公司</div></div>`,
  skin: '#1D76FE',
  width: 120,
  height: 64,
  children: [
    {
      id: '01',
      html,
      skin: '#3CB371',
      width: 120,
      height: 64,
      children: [
        { id: '011', skin: '#3CB371', ...param },
        {
          id: '013',
          skin: '#BDB76B',
          ...param,
          children: [
            { id: '0131', skin: '#1D76FE', ...param },
            { id: '0132', skin: '#1D76FE', ...param },
          ],
        },
        { id: '014', skin: '#1D76FE', ...param },
      ],
    },
  ],
};
