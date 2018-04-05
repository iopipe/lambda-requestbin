import iopipe from '@iopipe/iopipe'

//import aws from 'aws-sdk'
const aws = require('aws-sdk');
const jsonwebtoken = require('jsonwebtoken');
const fs = require('fs');
const keys = require('./keys');
const crypto = require('crypto');

//const iopipe_profiler = require('@iopipe/profiler');
const IOpipe = iopipe({
  token:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhNDAyZTQzNy0wNzIyLTQ0ZDktOGUyNy1jMGFjMjc2MzgxZTQiLCJqdGkiOiJmYTQzMDQxMi0zYThkLTQ5MzgtODA4My00YWIxODRjNmZmZjEiLCJpYXQiOjE1MDAzODgzMjgsImlzcyI6Imh0dHBzOi8vaW9waXBlLmNvbSIsImF1ZCI6Imh0dHBzOi8vaW9waXBlLmNvbSxodHRwczovL21ldHJpY3MtYXBpLmlvcGlwZS5jb20vZXZlbnQvLGh0dHBzOi8vZ3JhcGhxbC5pb3BpcGUuY29tIn0.Iez7L1pRsC1gk50H6-Qh99ZaduFfCixAPxgkfPmpElI",
  /*plugins: [ iopipe_profiler({ enabled: true }) ]*/
});
const S3 = new aws.S3();

/* A thing that should encrypt... but doesn't yet! */
function encrypt (data, key) {
  return JSON.stringify(data);
}

/* Endpoint that provides a JWT signed by us,
   creating a valid key on S3 & allowing access */
/* website will generate pub key, send to getKey
   which will return a JWT for use in sending request */
export const getRequestURL = IOpipe((event, context, callback) => {
  jsonwebtoken.sign(
      { data: 'hello world' },
      keys.private,
      { algorithm: 'RS256' },
      (err, token) => {
    if (err) {
      context.iopipe.log("error", err);
      context.iopipe.log("token", token);
      callback(null, { "statusCode": "400", "body": err });
      return;
    }
    callback(null, {
      "statusCode": 200,
      "body": `${event.headers['X-Forwarded-Proto']}://${event.headers['Host']}/dev/req/${token}\n`
    });
  });
});

// eslint-disable-next-line import/prefer-default-export
export const handleRequest = IOpipe((event, context, callback) => {
  console.log(event);
  var pathJwt = event.pathParameters.token;
  jsonwebtoken.verify(pathJwt, keys.public,
    { algorithms: [ 'RS256' ] },
    (err, decodedJwt) => {
      if (err) return callback(null, {
        "statusCode": 400,
        "body": `Error in pathJwt: ${err}\n`
      });

      /* We've received a user's request, encrypt and "bin" it!  */
      var encryptedRequest = encrypt(event, decodedJwt.aud);
      const p = new Promise((resolve, reject) => {
        var hash = crypto.createHash('sha256');
        hash.update(pathJwt);

        S3.putObject(
          {
            Bucket: process.env.S3BUCKET || "iopipe-requestbin",
            Key: hash.digest('hex'),
            Body: encryptedRequest
          },
          (err) => {
            (err) ? reject(err) : resolve();
          }
        );
      });
      p
        .then(() => callback(null, 
          {
              "statusCode": 200,
              "body": "Content accepted.\n"
          }
        ))
        .catch(e => callback(e));
  });
});
