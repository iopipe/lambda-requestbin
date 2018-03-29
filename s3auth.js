import iopipe from '@iopipe/iopipe'
const jsonwebtoken = require('jsonwebtoken');
const PRIVATE_KEY = require('./key');
import _ from 'lodash'


const IOpipe = iopipe();

export const handler = IOpipe((event, context, callback) => {
  console.log(event);
  var uri = event[0].request.uri;
  var authHeader = _.get(event[0].request.headers,
    'authorization',
    [ { value: '' } ]
  )[0].value;

  jsonwebtoken.verify(authHeader, PRIVATE_KEY, {
    audience: uri,
  }, (err, decodedJwt) => {
    if (err) return callback(err, { status: 401 });
    callback(null, event);
  })
});
