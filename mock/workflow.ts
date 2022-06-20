export default [
  {
    url: '/workflow/getData',
    method: 'get',
    response: () => {
      return {
        status: 200,
        result: {
          processJson: [
            {
              "id": "57b8012f-9e9b-4ff0-a8a8-ba1b2db6fc73",
              "name": "start",
              "label": "开始",
              "displayName": "开始",
              "className": "icon-circle start",
              "attr": {
                "x": 266,
                "y": 269,
                "w": 70,
                "h": 70
              },
              "next": [
                {
                  "id": "20c06047-11cc-4f0f-ab4e-e5a92d6b31ec",
                  "targetComponentId": "f346f825-e453-4728-b567-67fcc0461961",
                  "directionStart": "right",
                  "directionEnd": "left",
                  "lineType": "broken",
                  "displayName": "",
                  "props": [],
                  "componentId": "57b8012f-9e9b-4ff0-a8a8-ba1b2db6fc73"
                }
              ],
              "props": [
                {
                  "label": "名称显示",
                  "name": "displayName",
                  "value": "旅客运输",
                  "type": "input"
                },
                {
                  "name": "performType",
                  "value": "ANY",
                  "type": "select"
                },
                {
                  "name": "taskType",
                  "value": "Major",
                  "type": "input"
                },
                {
                  "name": "formType",
                  "value": "page",
                  "type": "select"
                },
                {
                  "name": "groupName",
                  "value": "源数据处理",
                  "type": "input"
                },
                {
                  "name": "form",
                  "value": "f9482862c049ce907aac540d273781a9",
                  "type": "input"
                },
                {
                  "name": "disable",
                  "value": "false",
                  "type": "input"
                },
                {
                  "name": "name",
                  "value": "lkys",
                  "type": "input"
                }
              ]
            },
            {
              "id": "f346f825-e453-4728-b567-67fcc0461961",
              "name": "div",
              "label": "业务节点",
              "displayName": "业务节点",
              "attr": {
                "x": 458,
                "y": 285,
                "w": 100,
                "h": 38
              },
              "props": [],
              "next": [
                {
                  "id": "c862de16-54a1-4674-934d-c59523045817",
                  "targetComponentId": "57d5a878-c775-4007-9e40-b3148a100189",
                  "directionStart": "right",
                  "directionEnd": "left",
                  "lineType": "broken",
                  "displayName": "",
                  "props": [],
                  "componentId": "f346f825-e453-4728-b567-67fcc0461961"
                }
              ]
            },
            {
              "id": "57d5a878-c775-4007-9e40-b3148a100189",
              "name": "div",
              "attr": {
                "x": 670,
                "y": 285,
                "w": 100,
                "h": 38
              },
              "label": "分支节点",
              "displayName": "分支节点",
              "props": [],
              "next": [
                {
                  "id": "d5f6a25c-81a1-4c4e-9170-9e4ea2780113",
                  "targetComponentId": "e0add22d-9696-41c6-91bd-05442b6aea02",
                  "directionStart": "down",
                  "directionEnd": "up",
                  "lineType": "bezier",
                  "displayName": "",
                  "props": [],
                  "componentId": "57d5a878-c775-4007-9e40-b3148a100189"
                },
                {
                  "id": "1c06e0e5-189b-48d6-9bf4-b7f27192c23e",
                  "targetComponentId": "61ea2d54-5c7a-4f82-92f2-623e4247870c",
                  "directionStart": "down",
                  "directionEnd": "up",
                  "lineType": "bezier",
                  "displayName": "",
                  "props": [],
                  "componentId": "57d5a878-c775-4007-9e40-b3148a100189"
                },
                {
                  "id": "c1b2bb95-71cb-40f8-8773-12caa68fbe23",
                  "targetComponentId": "e8c8e5ae-ff87-4d66-a3e8-1e3cca2450ac",
                  "directionStart": "down",
                  "directionEnd": "up",
                  "lineType": "bezier",
                  "displayName": "",
                  "props": [],
                  "componentId": "57d5a878-c775-4007-9e40-b3148a100189"
                }
              ]
            },
            {
              "id": "8ad0d419-b2be-4f99-929d-f22db431882f",
              "name": "div",
              "attr": {
                "x": 670,
                "y": 628,
                "w": 110,
                "h": 38
              },
              "label": "分支-合并",
              "displayName": "分支-合并",
              "props": [],
              "next": [
                {
                  "id": "09ebce4d-53b7-487b-be93-e8f3219458ef",
                  "targetComponentId": "e0e898ea-c525-4805-940b-5f84ad6fb98c",
                  "directionStart": "right",
                  "directionEnd": "left",
                  "lineType": "broken",
                  "displayName": "",
                  "props": [],
                  "componentId": "8ad0d419-b2be-4f99-929d-f22db431882f"
                }
              ]
            },
            {
              "id": "e0e898ea-c525-4805-940b-5f84ad6fb98c",
              "name": "end",
              "label": "结束",
              "displayName": "结束",
              "className": "icon-circle end",
              "attr": {
                "x": 1192,
                "y": 505,
                "w": 70,
                "h": 70
              },
              "props": [],
              "next": []
            },
            {
              "id": "e0add22d-9696-41c6-91bd-05442b6aea02",
              "name": "div",
              "attr": {
                "x": 508,
                "y": 467,
                "w": 100,
                "h": 38
              },
              "label": "脚本节点",
              "displayName": "脚本节点",
              "props": [],
              "next": [
                {
                  "id": "aa7d29cf-be2e-4061-92ca-734624eb8f1e",
                  "targetComponentId": "8ad0d419-b2be-4f99-929d-f22db431882f",
                  "directionStart": "down",
                  "directionEnd": "up",
                  "lineType": "bezier",
                  "displayName": "",
                  "props": [],
                  "componentId": "e0add22d-9696-41c6-91bd-05442b6aea02"
                }
              ]
            },
            {
              "id": "61ea2d54-5c7a-4f82-92f2-623e4247870c",
              "name": "div",
              "attr": {
                "x": 670,
                "y": 467,
                "w": 100,
                "h": 38
              },
              "label": "脚本节点",
              "displayName": "脚本节点",
              "props": [],
              "next": [
                {
                  "id": "f3849590-db8c-4f42-a327-c9154fe87233",
                  "targetComponentId": "8ad0d419-b2be-4f99-929d-f22db431882f",
                  "directionStart": "down",
                  "directionEnd": "up",
                  "lineType": "bezier",
                  "displayName": "",
                  "props": [],
                  "componentId": "61ea2d54-5c7a-4f82-92f2-623e4247870c"
                }
              ]
            },
            {
              "id": "e8c8e5ae-ff87-4d66-a3e8-1e3cca2450ac",
              "name": "div",
              "attr": {
                "x": 833,
                "y": 467,
                "w": 100,
                "h": 38
              },
              "label": "脚本节点",
              "displayName": "脚本节点",
              "props": [],
              "next": [
                {
                  "id": "ffd339f3-6618-4356-8ead-33f604986358",
                  "targetComponentId": "8ad0d419-b2be-4f99-929d-f22db431882f",
                  "directionStart": "down",
                  "directionEnd": "up",
                  "lineType": "bezier",
                  "displayName": "",
                  "props": [],
                  "componentId": "e8c8e5ae-ff87-4d66-a3e8-1e3cca2450ac"
                }
              ]
            }
          ]
        }
      }
    }
  }
]
