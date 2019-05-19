import log, { deSequelize } from 'lib/logger';
import Pledge from 'models/pledge';

export default (app) =>
  app.param('id', (req, res, next, id: string) => {
    // console.log('parsing id', id);
    Pledge.find({ id }).then((promise) => {
      req.promise = promise;
      // console.log('promise found', deSequelize(promise));
      return next();
    });
    // .catch(() => res.send(404));
  });
