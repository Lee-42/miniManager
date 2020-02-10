export default [
    //user
    {
        path: '/user', 
        component: '../layouts/UserLayout', // 指定以下页面的布局
        routes: [
        { name: 'login', 
          path: '/user/login', 
          component: './user/login' },
        ],
    },

    //app
    {
        path: '/',
        component: '../layouts/BasicLayout',
        routes: [
            //根路由, 跳转到 welcome
            { path: '/', 
              redirect: '/otherUser' 
            },
            // welcome
            // { path: '/welcome', 
            //   name: 'welcome', 
            //   icon: 'smile', 
            //   component: './Welcome' 
            // },
            // otherUser
            { path: '/otherUser',  
              name:'otherUser',
              icon: 'usergroup-add',
              routes: [
                { path: '/otherUser/list',
                  name: 'list',
                  component: '../pages/OtherUser/List',
                }
              ],
            },

            //article
            { path: '/article',
              name: 'article',
              icon: 'file-markdown',
              routes: [
                { path: '/article/list',
                  name: 'list',
                  component: '../pages/Article/List',
                },
                { path: '/article/create',
                  name: 'create',
                  component: '../pages/Article/ArticleCreate'
                },
              ],
            },

            //message
            { path: '/message',
              name: 'message',
              icon: 'message',
              routes: [
                { path: '/message/list',
                  name: 'list',
                  component: '../pages/Message/List' 
                }
              ]
            },


            // Tag
            { path: '/tag',
              name: 'tag',
              icon: 'tags',
              routes: [
                { path: '/tag/list',
                  name: 'list',
                  components: '../pages/Tag/List'
                }
              ]
            },


            //Link
            { path: '/link',
              name: 'link',
              icon: 'link',
              routes: [
                { path: '/link/list',
                  name: 'list',
                  component: '../pages/Link/List'
                }
              ]
            },

            //Category
            { path: '/category',
              name: 'category',
              icon: 'book',
              routes: [
                { path: '/category/list',
                  name: 'list',
                  component: '../pages/category/List'
                }
              ]
            },

            //TimeAxis
            { path: '/timeaxis',
              name: 'timeaxis',
              icon: 'clock-circle',
              routes: [
                { path: '/timeaxis/list',
                  name: 'list',
                  component: '../pages/timeaxis/List'
                }
              ]
            },

            //Project
            { path: '/project',
              name: 'project',
              icon: 'clock-circle',
              routes: [
                { path: '/project/list',
                  name: 'list',
                  component: '../pages/project/List'
                }
              ]
            },

            //Exception
            { path: '/exception',
              name: 'exception',
              icon: 'warning',
              
            },

            // admin
            { path: '/admin', 
              name: 'admin', 
              icon: 'crown', 
              component: './Admin', 
              authority: ['admin'] 
            },
            {
                component: './404',
            },
        ],
    },
    {
        component: './404',
    },
]