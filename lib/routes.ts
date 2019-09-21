import Home from 'src/views/home';
import View from 'src/views/promise';
import User from 'src/views/user';

const rootRoute = ({ hasSubdomain }) => {
  if (hasSubdomain) {
    return {
      component: User,
      data: 'user',
      exact : true,
      path: '/',
    };
  }
  return {
    component: Home,
    data: 'incomplete',
    exact: true,
    path: '/',
  };
};

const routes = ({ hasSubdomain = false } = {}) => [{
  ...rootRoute({ hasSubdomain }),
}, {
  component: View,
  data: 'view',
  path: '/:id',
}];

export default routes;
