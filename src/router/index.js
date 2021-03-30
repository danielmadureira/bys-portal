import Vue from 'vue'
import Router from 'vue-router'

// Containers
const TheContainer = () => import('@/containers/TheContainer');

// Views
const NotFound = () => import('@/views/pages/NotFound');
const ServerError = () => import('@/views/pages/ServerError');
const Login = () => import('@/views/pages/Login');
const Loader = () => import('@/views/pages/Loader');

// Pages
const PostList = () => import('@/views/feed/PostList');
const PostCreationForm = () => import('@/views/feed/PostCreationForm');
const ForumGroupList = () => import('@/views/forum/ForumGroupList');
const ForumRoomList = () => import('@/views/forum/ForumRoomList');
const ForumCommentList = () => import('@/views/forum/ForumCommentList');
const UserList = () => import('@/views/user/UserList');

import store from '@/store';
import { AuthToken } from '@/adapters';

Vue.use(Router)

const routes = [
  {
    path: '/',
    redirect: '/pages/feed/post/',
    name: 'Root',
    component: {
      render (c) { return c('router-view') }
    },
    children: [
      {
        path: 'login',
        name: 'Login',
        component: Login,
        props: true
      },
      {
        path: 'loader',
        name: 'Loader',
        component: Loader,
        props: true
      },
      {
        path: 'notfound',
        name: 'NotFound',
        component: NotFound
      },
      {
        path: 'servererror',
        name: 'ServerError',
        component: ServerError
      }
    ]
  },
  {
    path: '/pages',
    redirect: '/pages/feed/post/',
    name: 'Home',
    component: TheContainer,
    children: [
      {
        path: 'pages/feed',
        redirect: '/pages/feed/post',
        name: 'Feed',
        component: {
          render(c) {
            return c('router-view')
          }
        },
        children: [
          {
            path: '/pages/feed/post',
            name: 'Posts',
            component: PostList
          },
          {
            path: '/pages/feed/post/new',
            name: 'Novo post',
            component: PostCreationForm,
            props: true
          }
        ]
      },
      {
        path: 'forum',
        redirect: '/pages/forum/group',
        name: 'Forum',
        component: {
          render(c) {
            return c('router-view')
          }
        },
        children: [
          {
            path: '/pages/forum/group',
            name: 'Grupos',
            component: ForumGroupList
          },
          {
            path: '/pages/forum/room',
            name: 'Salas',
            component: ForumRoomList
          },
          {
            path: '/pages/forum/comment',
            name: 'Comentários',
            component: ForumCommentList
          }
        ]
      },
      {
        path: 'user',
        redirect: '/pages/user',
        name: 'Usuário',
        component: {
          render(c) {
            return c('router-view')
          }
        },
        children: [
          {
            path: '/pages/user',
            name: 'Usuários',
            component: UserList
          }
        ]
      }
    ]
  }
];

const router = new Router({
  mode: 'history',
  linkActiveClass: 'active',
  scrollBehavior: () => ({ y: 0 }),
  routes: routes
});

router.beforeEach((to, from, next) => {
  const destinationName = to.name || 'NotFound';
  if (destinationName === 'Login') {
    next();
    return;
  }
  if (!AuthToken.token) {
    next({ name: 'Login', params: { redirectTo: destinationName } });
    return;
  }
  if (destinationName !== 'Loader' && !store.state.isLoaded) {
    next({ name: 'Loader', params: { redirectTo: destinationName }  });
    return;
  }

  next();
});

export default router;
