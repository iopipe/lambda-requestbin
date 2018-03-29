import iopipe from '@iopipe/iopipe'
import 'jsonwebtoken'
import _ from 'lodash'

const IOpipe = iopipe();
const PRIVATE_KEY = process.env.PRIVATE_KEY;

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
