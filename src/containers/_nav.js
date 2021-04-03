export default [
  {
    _name: 'CSidebarNav',
    _children: [
      {
        _name: 'CSidebarNavTitle',
        _children: ['Navegação']
      },
      {
        _name: 'CSidebarNavDropdown',
        name: 'Feed',
        route: '/pages/feed',
        icon: 'cil-newspaper',
        items: [
          {
            name: 'Posts',
            to: '/pages/feed/post'
          },
          {
            name: 'Novo post',
            to: '/pages/feed/post/new'
          }
        ]
      },
      {
        _name: 'CSidebarNavDropdown',
        name: 'Forum',
        route: '/pages/forum',
        icon: 'cil-institution',
        items: [
          {
            name: 'Grupos',
            to: '/pages/forum/group'
          },
          {
            name: 'Salas',
            to: '/pages/forum/room'
          },
          {
            name: 'Comentários',
            to: '/pages/forum/comment'
          }
        ]
      },
      {
        _name: 'CSidebarNavItem',
        name: 'Usuários',
        to: '/pages/user',
        icon: 'cil-user'
      }
    ]
  }
]
