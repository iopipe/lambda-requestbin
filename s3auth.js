import iopipe from '@iopipe/iopipe'
const jsonwebtoken = require('jsonwebtoken');
const keys = require('./keys');
import _ from 'lodash'


const IOpipe = iopipe();

export const handler = IOpipe((event, context, callback) => {
  console.log(event);
  var uri = event.Records[0].cf.request.uri;
  var authHeader = _.get(event.Records[0].cf.request.headers,
    'authorization',
    [ { value: '' } ]
  )[0].value.split(" ");

  if (! authHeader[0].toLowerCase() === "bearer") {
    return callback(null, { status: 401 });
  }

  jsonwebtoken.verify(authHeader[1], keys.public,
    (err, decodedJwt) => {
      if (err) return callback(err, { status: 401 });
      callback(null, event);
    }
  )
});
