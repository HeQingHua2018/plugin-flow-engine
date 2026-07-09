const styleChildren = `font-size: 14px;font-weight: 400;color: #3C4353;border-radius:4px;`;
const flex = `display: flex;justify-content: center;align-items: center;`;

export const domDataH = {
  id: 'root',
  html: `<div style="font-weight: bold;color: #FFF;font-size: 16px;border-radius:4px; ${flex}">成都集团有限公司</div>`,
  skin: '#1D76FE',
  width: 296,
  height: 56,
  children: [
    {
      id: '01',
      html: `<div style="${styleChildren}${flex};flex-direction: column;">
                    <span style="font-weight: bold;">股东</span>
                    <span>2</span>
                </div>`,
      skin: '#1D76FE',
      width: 112,
      height: 64,
      children: [
        {
          id: '011',
          html: `<div style="border:1px solid #1D76FE;${styleChildren}${flex}">
                            <span>成都市国有资产监督管理委员会</span>
                            <span style="color:#1D76FE">(90%)</span>
                        </div>`,
          skin: '#1D76FE',
          width: 292,
          height: 34,
        },
        {
          id: '012',
          html: `<div style="border:1px solid #1D76FE;${styleChildren}${flex}">
                            <span>成都市国有资产监督管理委员会</span>
                            <span style="color:#1D76FE">(10%)</span> 
                        </div>`,
          skin: '#1D76FE',
          width: 295,
          height: 34,
        },
      ],
    },
    {
      id: '02',
      html: `<div style="${styleChildren}${flex};flex-direction: column;">
                    <span style="font-weight: bold">高管</span>
                    <span>4</span>
                </div>`,
      skin: '#F54640',
      width: 112,
      height: 64,
      children: [
        {
          id: '021',
          html: `<div style="border:1px solid #F54640;${styleChildren}${flex}">
                            <span>任12</span>
                            <span style="color:#909399">(总经理)</span>
                        </div>`,
          skin: '#F54640',
          width: 150,
          height: 34,
        },
        {
          id: '022',
          html: `<div style="border:1px solid #F54640;${styleChildren}${flex}">
                            <span>李3</span>
                            <span style="color:#909399">(总监)</span>
                        </div>`,
          skin: '#F54640',
          width: 150,
          height: 34,
        },
        {
          id: '023',
          html: `<div style="border:1px solid #F54640;${styleChildren}${flex}">
                            <span>赵四</span>
                            <span style="color:#909399">(组长)</span>
                        </div>`,
          skin: '#F54640',
          width: 150,
          height: 34,
        },
        {
          id: '024',
          html: `<div style="border:1px solid #F54640;${styleChildren}${flex}">
                            <span>王强</span>
                            <span style="color:#909399">(开发)</span>
                        </div>`,
          skin: '#F54640',
          width: 150,
          height: 34,
        },
      ],
    },
    {
      id: '03',
      html: `<div style="${styleChildren}${flex};flex-direction: column;">
                    <span style="font-weight: bold">对外投资</span>
                    <span>4</span>
                </div>`,
      skin: '#FDA523',
      width: 120,
      height: 64,
      children: [
        {
          id: '031',
          html: `<div style="border:1px solid #FDA523; padding:10px 0 10px 26px;${styleChildren}">
                            <div>
                                <span>成都有限公司</span>
                                <span style="color:#F54640">(10%)</span>
                            </div>
                            <div style="font-size:12px;color: #606266;">实缴金额: 1350万元</div>
                        </div>`,
          skin: '#FDA523',
          width: 320,
          height: 56,
        },
        {
          id: '032',
          html: `<div style="border:1px solid #FDA523;padding:10px 0 10px 26px;${styleChildren}">
                            <div>
                                <span>成都公司</span> 
                                <span style="color:#F54640">(30%)</span>
                            </div>
                            <div style="font-size:12px;color: #606266;">实缴金额: 1350万元</div>
                        </div>`,
          skin: '#FDA523',
          width: 290,
          height: 56,
        },
        {
          id: '033',
          html: `<div style="border:1px solid #FDA523;padding:10px 0 10px 26px;${styleChildren}">
                            <div>
                                <span>限公司</span> 
                                <span style="color:#F54640">(28%)</span>
                            </div>
                            <div style="font-size:12px;color: #606266;">实缴金额: 1350万元</div>
                        </div>`,
          skin: '#FDA523',
          width: 265,
          height: 56,
        },
        {
          id: '034',
          html: `<div style="border:1px solid #FDA523;padding:10px 0 10px 26px;${styleChildren}">
                            <div>
                                <span>限公司</span>
                                <span style="color:#F54640">(56%)</span>
                            </div>
                            <div style="font-size:12px;color: #606266;">实缴金额: 1350万元</div>
                        </div>`,
          skin: '#FDA523',
          width: 290,
          height: 56,
        },
      ],
    },
  ],
};
