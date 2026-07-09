export const treeDataTb = {
  code: 100,
  success: true,
  data: {
    id: 'root',
    title: '成都XXX有限公司',
    skin: '#1D76FE',
    children: [
      {
        id: 'c1',
        title: '成都xxx有限公司',
        skin: '#FDA523',
        label: '全资100%',
      },
      {
        id: 'c2',
        title: '成都XXX有限公司',
        skin: '#FDA523',
        label: '全资100%',
        children: [
          {
            id: 'c2-1',
            title: '成都XXX成华区分公司',
            skin: '#5CB85B',
            label: '控股50%',
          },
          {
            id: 'c2-2',
            title: '成都XXX都江堰分公司',
            skin: '#5CB85B',
            label: '控股50%',
          },
        ],
      },
      {
        id: 'c3',
        title: '成都限公司',
        skin: '#FDA523',
        label: '全资100%',
        children: [
          {
            id: 'c3-1',
            title: '成都XXX成华区分公司',
            skin: '#5CB85B',
            label: '控股50%',
          },
          {
            id: 'c3-2',
            title: '成都XXX都江堰分公司',
            skin: '#5CB85B',
            label: '控股30%',
            children: [
              {
                id: 'c3-2-1',
                title: '成都XXX有限公司',
                skin: 'green',
                label: '全资100%',
              },
            ],
          },
          {
            id: 'c3-3',
            title: 'c3-3',
            skin: '#5CB85B',
            label: '控股20%',
          },
        ],
      },
      {
        id: 'c4',
        title: '成都sss有限公司',
        skin: '#FDA523',
        label: '全资100%',
      },
    ],
  },
};
