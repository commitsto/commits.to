import { find, get } from 'lodash';
import { matchPath } from "react-router-dom";

import routes from 'lib/routes';
import Pledge from 'models/pledge';
import User from 'models/user';

const endpoints = {
  incomplete: () => Pledge.findIncomplete(),
  user: ({ username = '' } = {}) => User.pledges({ username }),
  view: ({ id = '', username = '', urtext = '' } = {}) => Pledge.find({ id, username, urtext }),
};

export default (req, res, next) => {
  const hasSubdomain = get(req, 'metadata.username');
  const currentRoute = find(routes({ hasSubdomain }), (route) => matchPath(req.path, route));
  const getData = currentRoute.data && endpoints[currentRoute.data];

  if (typeof getData === 'function') {
    return getData(req.metadata)
      .then((pledgeData) => {
        req.data = JSON.stringify(pledgeData);

        next();
      })
      .catch((reason) => console.log('error', reason)); // tslint:disable-line no-console
  }

  next();
};
