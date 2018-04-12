export default {
  items: [
    {
      name: 'Dashboard',
      url: '/dashboard',
      icon: 'icon-speedometer',
      badge: {
        variant: 'info',
        text: 'NEW'
      }
    },
    {
      name: 'Tickets',
      url: '/tickets',
      icon: 'icon-speedometer',
      /*
      badge: {
        variant: 'info',
        text: 'NEW'
      }
      */
    },
    {
      name: 'Account',
      url: '/account',
      icon: 'icon-cursor',
      children: [
        {
          name: 'Buttons',
          url: '/buttons/buttons',
          icon: 'icon-cursor'
        },
        {
          name: 'Button dropdowns',
          url: '/buttons/button-dropdowns',
          icon: 'icon-cursor'
        },
        {
          name: 'Button groups',
          url: '/buttons/button-groups',
          icon: 'icon-cursor'
        },
        {
          name: 'Social Buttons',
          url: '/buttons/social-buttons',
          icon: 'icon-cursor'
        }
      ]
    },
  ]
};
