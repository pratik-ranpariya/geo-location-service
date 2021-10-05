import { INavData } from '@coreui/angular';

export const navItems: INavData[] = [
  {
    name: 'Categories',
    url: '/categories',
    icon: 'icon-list',
  },
  {
    name: 'Customers',
    url: '/customers',
    icon: 'icon-people'
  },

  {
    name: 'Businesses',
    url: '/businessUsers',
    icon: 'icon-briefcase'
  },
  {
    name: 'Reported Users',
    url: '/reportedUsers',
    icon: 'icon-ban'
  },
  {
    name: 'Suggestions',
    url: '/suggestions',
    icon: 'icon-pencil'
  },
];
