import log, { deSequelize } from '../../lib/logger'
import { Promises } from '../models'

export default (app) =>
  app.param('id', function (req, res, next, param) {
    log.debug('parsing id', param);
    Promises.findOne({
      where: {
        id: param,
      },
    }).then((promise) => {
      req.promise = promise
      log.debug('promise found', deSequelize(promise));
      return next();
    }).catch((reason) => res.send(404));
  });
