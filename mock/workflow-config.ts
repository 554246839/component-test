export default [
  {
    url: '/workflow/getConfig',
    method: 'get',
    response: () => {
      return {
        status: 200,
        result: {
          nodes: [
            {
              id: '',
              name: 'start',
              label: '开始',
              displayName: '开始',
              className: 'icon-circle start',
              attr: {
                x: 0,
                y: 0,
                w: 70,
                h: 70
              },
              next: [],
              props: [
                {
                  label: '名称显示',
                  name: 'displayName',
                  value: '旅客运输',
                  type: 'input'
                },
                {
                  name: 'performType',
                  value: 'ANY',
                  type: 'select'
                },
                {
                  name: 'taskType',
                  value: 'Major',
                  type: 'input'
                },
                {
                  name: 'formType',
                  value: 'page',
                  type: 'select'
                },
                {
                  name: 'groupName',
                  value: '源数据处理',
                  type: 'input'
                },
                {
                  name: 'form',
                  value: 'f9482862c049ce907aac540d273781a9',
                  type: 'input'
                },
                {
                  name: 'disable',
                  value: 'false',
                  type: 'input'
                },
                {
                  name: 'name',
                  value: 'lkys',
                  type: 'input'
                }
              ]
            },
            {
              id: '',
              name: 'end',
              label: '结束',
              displayName: '结束',
              className: 'icon-circle end',
              attr: {
                x: 0,
                y: 0,
                w: 70,
                h: 70
              },
              props: [
                {
                  label: '名称显示',
                  name: 'displayName',
                  value: '旅客运输',
                  type: 'input'
                },
                {
                  name: 'performType',
                  value: 'ANY',
                  type: 'select'
                }
              ],
              next: []
            },
            {
              id: '',
              name: 'div',
              label: '业务节点',
              displayName: '业务节点',
              attr: {
                x: 0,
                y: 0,
                w: 100,
                h: 38
              },
              props: [
                {
                  label: '名称显示',
                  name: 'displayName',
                  value: '旅客运输',
                  type: 'input'
                },
                {
                  name: 'performType',
                  value: 'ANY',
                  type: 'select'
                }
              ],
              next: []
            },
            {
              id: '',
              name: 'div',
              attr: {
                x: 0,
                y: 0,
                w: 100,
                h: 38
              },
              label: '分支节点',
              displayName: '分支节点',
              props: [
                {
                  label: '名称显示',
                  name: 'displayName',
                  value: '旅客运输',
                  type: 'input'
                },
                {
                  name: 'performType',
                  value: 'ANY',
                  type: 'select'
                }
              ],
              next: []
            },
            {
              id: '',
              name: 'div',
              attr: {
                x: 0,
                y: 0,
                w: 100,
                h: 38
              },
              label: '脚本节点',
              displayName: '脚本节点',
              props: [
                {
                  label: '名称显示',
                  name: 'displayName',
                  value: '旅客运输',
                  type: 'input'
                },
                {
                  name: 'performType',
                  value: 'ANY',
                  type: 'select'
                }
              ],
              next: []
            },
            {
              id: '',
              name: 'div',
              attr: {
                x: 0,
                y: 0,
                w: 100,
                h: 38
              },
              label: '审批节点',
              displayName: '审批节点',
              props: [
                {
                  label: '名称显示',
                  name: 'displayName',
                  value: '旅客运输',
                  type: 'input'
                },
                {
                  name: 'performType',
                  value: 'ANY',
                  type: 'select'
                }
              ],
              next: []
            },
            {
              id: '',
              name: 'div',
              attr: {
                x: 0,
                y: 0,
                w: 90,
                h: 38
              },
              label: '子流程',
              displayName: '子流程',
              props: [
                {
                  label: '名称显示',
                  name: 'displayName',
                  value: '旅客运输',
                  type: 'input'
                },
                {
                  name: 'performType',
                  value: 'ANY',
                  type: 'select'
                }
              ],
              next: []
            },
            {
              id: '',
              name: 'div',
              attr: {
                x: 0,
                y: 0,
                w: 110,
                h: 38
              },
              label: '分支-并行',
              displayName: '分支-并行',
              props: [
                {
                  label: '名称显示',
                  name: 'displayName',
                  value: '旅客运输',
                  type: 'input'
                },
                {
                  name: 'performType',
                  value: 'ANY',
                  type: 'select'
                }
              ],
              next: []
            },
            {
              id: '',
              name: 'div',
              attr: {
                x: 0,
                y: 0,
                w: 110,
                h: 38
              },
              label: '分支-合并',
              displayName: '分支-合并',
              props: [
                {
                  label: '名称显示',
                  name: 'displayName',
                  value: '旅客运输',
                  type: 'input'
                },
                {
                  name: 'performType',
                  value: 'ANY',
                  type: 'select'
                }
              ],
              next: []
            },
            {
              id: '',
              name: 'div',
              attr: {
                x: 0,
                y: 0,
                w: 110,
                h: 38
              },
              label: '分支-决策',
              displayName: '分支-决策',
              props: [
                {
                  label: '名称显示',
                  name: 'displayName',
                  value: '旅客运输',
                  type: 'input'
                },
                {
                  name: 'performType',
                  value: 'ANY',
                  type: 'select'
                }
              ],
              next: []
            }
          ],
          options: {
            performType: [
              {
                label: '任何',
                value: 'ANY'
              },
              {
                label: '且',
                value: 'AND'
              },
              {
                label: '或',
                value: 'OR'
              }
            ],
            formType: [
              {
                label: 'page',
                value: 'page'
              },
              {
                label: 'ssjson',
                value: 'ssjson'
              }
            ]
          },
          path: [
            {
              label: '名称显示',
              name: 'displayName',
              value: '旅客运输',
              type: 'input'
            },
            {
              name: 'performType',
              value: 'ANY',
              type: 'select'
            }
          ]
        }
      }
    }
  }
]
