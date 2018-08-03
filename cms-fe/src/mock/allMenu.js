export const allMenu = [
  {
    name: '首页',
    url: '/',
    permission: 2,
    icon: 'home',
  }, {
    name: '内容库',
    url: '/content',
    permission: 0,
    icon: 'bars',
    children: [
      {
        name: '内容列表',
        url: '/content/list',
        permission: 0
      }
    ]
  }, {
    name: '创作',
    url: '/compose',
    permission: 0,
    icon: 'edit',
    children: [
      {
        name: '发布新作品',
        url: '/compose/entry',
        permission: 0
      }, {
        name: '创作列表',
        url: '/compose/list',
        permission: 0
      }
    ]
  }, {
    name: '审核',
    url: '/audit',
    permission: 0,
    icon: 'bars',
    children: [
      {
        name: '审核列表',
        url: '/audit/list',
        permission: 0
      }
    ]
  }, {
    name: '发布管理',
    url: '/composePublish',
    permission: 0,
    icon: 'bars',
    children: [
      {
        name: '发布列表',
        url: '/composePublish/list',
        permission: 0
      }
    ]
  }, {
    name: '商品管理',
    url: '/goods',
    permission: 0,
    icon: 'bars',
    children: [
      {
        name: '淘宝商品导入',
        url: '/goods/import',
        permission: 0
      }
    ]
  }
]
