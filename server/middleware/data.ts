import { find } from 'lodash';
import { matchPath } from "react-router-dom";

import routes from 'lib/routes';
import Pledge from 'models/pledge';

const endpoints = {
  incomplete: () => Pledge.findIncomplete(),
  view: ({ username = '', urtext = '' } = {}) => Pledge.find({ username, urtext }),
};

export default (req, res, next) => {
  const currentRoute = find(routes, (route) => matchPath(req.path, route));
  const getData = currentRoute.data && endpoints[currentRoute.data];

  if (typeof getData === 'function') {
    getData(req.pledge)
      .then((pledgeData) => {
        req.data = JSON.stringify(pledgeData || {});
        next();
      })
      .catch((reason) => console.log('error', reason)); // tslint:disable-line no-console
  }
};
