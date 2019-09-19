import DomainParser from 'lib/parse/domain';

import Home from 'src/views/home';
import View from 'src/views/promise';
import User from 'src/views/user';

const host = typeof window !== 'undefined' && window.location.host;

const rootRoute = DomainParser.hasSubdomain(host) ?
  {
    component: User,
    exact : true,
    path: '/',
  } : {
    component: Home,
    data: 'incomplete',
    exact: true,
    path: '/',
  };

const routes = [{
  ...rootRoute,
}, {
  component: View,
  data: 'view',
  path: '/:id',
}];

export default routes;
