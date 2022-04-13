import demo from './demo.json'

export default [
  {
    url: '/add/init',
    method: 'get',
    response: () => {
      return {
        status: 200,
        result: {
          optionIds: [
            {
              label: '文章状态',
              value: 'articleStatus'
            },
            {
              label: '发布状态',
              value: 'publicStatus'
            }
          ]
        }
      }
    }
  },
  {
    url: '/getDetail',
    method: 'get',
    response: () => {
      return {
        status: 200,
        result: {
          dynamicPageConfig: demo,
          optionIds: [
            {
              label: '文章状态',
              value: 'articleStatus'
            },
            {
              label: '发布状态',
              value: 'publicStatus'
            }
          ],

        }
      }
    }
  },
  {
    url: '/save/:pageId',
    method: 'post',
    response: () => {
      return {
        status: 200
      }
    }
  },
  {
    url: '/update',
    method: 'post',
    response: () => {
      return {
        status: 200
      }
    }
  },
  {
    url: '/delete/article',
    method: 'post',
    response: () => {
      return {
        status: 200
      }
    }
  },
  {
    url: '/render/previewInit',
    method: 'post',
    response: () => {
      return {
        status: 200,
        result: {
          options: {
            articleStatus: [
              {
                label: '已发布',
                value: '1'
              },
              {
                label: '审核中',
                value: '2'
              },
              {
                label: '未发布',
                value: '0'
              }
            ],
            publicStatus: [
              {
                label: '发布',
                value: '1'
              },
              {
                label: '取消发布',
                value: '0'
              }
            ]
          }
        }
      }
    }
  },
  {
    url: '/render/init',
    method: 'get',
    response: () => {
      return {
        status: 200,
        result: {
          dynamicPageConfig: demo,
          options: {
            articleStatus: [
              {
                label: '已发布',
                value: '1'
              },
              {
                label: '审核中',
                value: '2'
              },
              {
                label: '未发布',
                value: '0'
              }
            ],
            publicStatus: [
              {
                label: '发布',
                value: '1'
              },
              {
                label: '取消发布',
                value: '0'
              }
            ]
          }
        }
      }
    }
  },
  {
    url: '/getData',
    method: 'post',
    response: () => {
      const records = []

      for (let i = 0; i < 10; i++) {
        records.push({
          id: i,
          name: '文章标题' + i,
          status: i % 3 + '',
          publicDate: new Date(),
          readNum: Math.random() * 100000 | 0,
          likeNum: Math.random() * 1000 | 0,
          commentNum: Math.random() * 1000 | 0,
        })
      }
      return {
        status: 200,
        result: {
          current: 1,
          hitCount: false,
          optimizeCountSql: true,
          orders: [],
          pages: 1,
          records,
          searchCount: true,
          size: 20,
          total: 10
        }
      }
    }
  }
]
