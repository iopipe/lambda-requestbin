import iopipe from '@iopipe/iopipe'
const jsonwebtoken = require('jsonwebtoken');
const keys = require('./keys');
import _ from 'lodash'


const IOpipe = iopipe({
  token:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhNDAyZTQzNy0wNzIyLTQ0ZDktOGUyNy1jMGFjMjc2MzgxZTQiLCJqdGkiOiJmYTQzMDQxMi0zYThkLTQ5MzgtODA4My00YWIxODRjNmZmZjEiLCJpYXQiOjE1MDAzODgzMjgsImlzcyI6Imh0dHBzOi8vaW9waXBlLmNvbSIsImF1ZCI6Imh0dHBzOi8vaW9waXBlLmNvbSxodHRwczovL21ldHJpY3MtYXBpLmlvcGlwZS5jb20vZXZlbnQvLGh0dHBzOi8vZ3JhcGhxbC5pb3BpcGUuY29tIn0.Iez7L1pRsC1gk50H6-Qh99ZaduFfCixAPxgkfPmpElI"
});

export const handler = IOpipe((event, context, callback) => {
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
      if (err) return callback(null, { status: 401, body: err });
      callback(null, event.Records[0].cf.request);
    }
  )
});
