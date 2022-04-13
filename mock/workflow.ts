export default [
  {
    url: '/workflow/getData',
    method: 'get',
    response: () => {
      return {
        status: 200,
        result: [
          {
            'id': 'fde2a040-3795-4443-a57b-af412d06c023',
            'name': 'start',
            'label': '开始',
            'displayName': '开始',
            'className': 'icon-circle start',
            'attr': {
              'x': 308,
              'y': 391,
              'w': 70,
              'h': 70
            },
            'next': [
              {
                'id': 'ee1c5fa3-f822-40f1-98a1-f76db6a2362b',
                'targetComponentId': 'fa7fbbfa-fc43-4ac8-8911-451d0098d0cb',
                'directionStart': 'right',
                'directionEnd': 'left',
                'lineType': 'straight',
                'extra': '',
                'componentId': 'fde2a040-3795-4443-a57b-af412d06c023'
              }
            ],
            'props': [
              {
                name: 'displayName',
                label: '显示名称',
                value: '旅客运输',
                type: 'input'
              },
              {
                name: 'performType',
                value: 'ANY',
                type: 'select',
                props: {
                  multiple: true
                },
                options: [
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
                ]
              },
              {
                name: 'taskType',
                value: 'Major',
                type: 'input'
              },
              {
                name: 'formType',
                value: 'page',
                type: 'select',
                options: [
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
            'id': 'fa7fbbfa-fc43-4ac8-8911-451d0098d0cb',
            'name': 'div',
            'attr': {
              'x': 483,
              'y': 407,
              'w': 100,
              'h': 38
            },
            'label': '分支节点',
            'displayName': '分支节点',
            'next': [
              {
                'id': '0bccdc46-444f-4576-9d63-fb93c35d01c3',
                'targetComponentId': 'd86df483-4caf-4ef3-b07f-0dcbd2546510',
                'directionStart': 'right',
                'directionEnd': 'left',
                'lineType': 'bezier',
                'extra': '分支1',
                'componentId': 'fa7fbbfa-fc43-4ac8-8911-451d0098d0cb'
              },
              {
                'id': '914fba72-65ef-4f6e-bd3c-ac35beab35eb',
                'targetComponentId': 'f45f184f-fcd7-467e-9278-cda7c38e762f',
                'directionStart': 'right',
                'directionEnd': 'left',
                'lineType': 'bezier',
                'extra': '分支2',
                'componentId': 'fa7fbbfa-fc43-4ac8-8911-451d0098d0cb'
              },
              {
                'id': 'f0d2048f-47d7-4207-9adb-28a3df2461f8',
                'targetComponentId': '73c19945-5ad9-4567-9bf1-761bdfefecc4',
                'directionStart': 'right',
                'directionEnd': 'left',
                'lineType': 'bezier',
                'extra': '分支3',
                'componentId': 'fa7fbbfa-fc43-4ac8-8911-451d0098d0cb'
              }
            ],
            'props': []
          },
          {
            'id': 'd86df483-4caf-4ef3-b07f-0dcbd2546510',
            'name': 'div',
            'label': '业务节点',
            'displayName': '业务节点',
            'attr': {
              'x': 744,
              'y': 302,
              'w': 100,
              'h': 38
            },
            'next': [
              {
                'id': 'c9cb0f32-792a-4e23-8b9f-293c0f90aa7c',
                'targetComponentId': '350a3745-fc58-4643-819d-cbc80532b5ce',
                'directionStart': 'right',
                'directionEnd': 'left',
                'lineType': 'bezier',
                'extra': '合并1',
                'componentId': 'd86df483-4caf-4ef3-b07f-0dcbd2546510'
              }
            ],
            'props': []
          },
          {
            'id': 'f45f184f-fcd7-467e-9278-cda7c38e762f',
            'name': 'div',
            'label': '业务节点',
            'displayName': '业务节点',
            'attr': {
              'x': 744,
              'y': 406,
              'w': 100,
              'h': 38
            },
            'next': [
              {
                'id': '034de4f8-2eb0-4602-8869-b14c8c2c84d8',
                'targetComponentId': '350a3745-fc58-4643-819d-cbc80532b5ce',
                'directionStart': 'right',
                'directionEnd': 'left',
                'lineType': 'bezier',
                'extra': '合并2',
                'componentId': 'f45f184f-fcd7-467e-9278-cda7c38e762f'
              }
            ],
            'props': []
          },
          {
            'id': '73c19945-5ad9-4567-9bf1-761bdfefecc4',
            'name': 'div',
            'label': '业务节点',
            'displayName': '业务节点',
            'attr': {
              'x': 744,
              'y': 515,
              'w': 100,
              'h': 38
            },
            'next': [
              {
                'id': '7ddb26a1-a1d9-4c18-933f-083965802ba9',
                'targetComponentId': '350a3745-fc58-4643-819d-cbc80532b5ce',
                'directionStart': 'right',
                'directionEnd': 'left',
                'lineType': 'bezier',
                'extra': '合并3',
                'componentId': '73c19945-5ad9-4567-9bf1-761bdfefecc4'
              }
            ],
            'props': []
          },
          {
            'id': '350a3745-fc58-4643-819d-cbc80532b5ce',
            'name': 'div',
            'attr': {
              'x': 1064,
              'y': 412,
              'w': 110,
              'h': 38
            },
            'label': '分支-合并',
            'displayName': '分支-合并',
            'next': [
              {
                'id': '8202825b-7bd2-4e46-9669-37735be837d2',
                'targetComponentId': '135e552a-f2d7-43f8-8867-aea1d094b26f',
                'directionStart': 'down',
                'directionEnd': 'up',
                'lineType': 'straight',
                'extra': '',
                'componentId': '350a3745-fc58-4643-819d-cbc80532b5ce'
              }
            ],
            'props': []
          },
          {
            'id': '135e552a-f2d7-43f8-8867-aea1d094b26f',
            'name': 'div',
            'label': '业务节点',
            'displayName': '业务节点',
            'attr': {
              'x': 1069,
              'y': 558,
              'w': 100,
              'h': 38
            },
            'next': [
              {
                'id': '2952b2a3-aece-4b33-8281-00123811473b',
                'targetComponentId': '414ff7b0-3638-4890-8de9-c4142f92f62c',
                'directionStart': 'down',
                'directionEnd': 'left',
                'lineType': 'broken',
                'extra': ''
              }
            ],
            'props': []
          },
          {
            'id': '414ff7b0-3638-4890-8de9-c4142f92f62c',
            'name': 'end',
            'label': '结束',
            'displayName': '结束',
            'className': 'icon-circle end',
            'attr': {
              'x': 1321,
              'y': 617,
              'w': 70,
              'h': 70
            },
            'next': [],
            'props': []
          }
        ]
      }
    }
  }
]
