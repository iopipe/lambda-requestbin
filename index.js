import iopipe from '@iopipe/iopipe'

import aws from 'aws-sdk'
const jsonwebtoken = require('jsonwebtoken');
const fs = require('fs');
const PRIVATE_KEY = require('./key');

const iopipe_profiler = require('@iopipe/profiler');
const IOpipe = iopipe({
  token:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhNDAyZTQzNy0wNzIyLTQ0ZDktOGUyNy1jMGFjMjc2MzgxZTQiLCJqdGkiOiJmYTQzMDQxMi0zYThkLTQ5MzgtODA4My00YWIxODRjNmZmZjEiLCJpYXQiOjE1MDAzODgzMjgsImlzcyI6Imh0dHBzOi8vaW9waXBlLmNvbSIsImF1ZCI6Imh0dHBzOi8vaW9waXBlLmNvbSxodHRwczovL21ldHJpY3MtYXBpLmlvcGlwZS5jb20vZXZlbnQvLGh0dHBzOi8vZ3JhcGhxbC5pb3BpcGUuY29tIn0.Iez7L1pRsC1gk50H6-Qh99ZaduFfCixAPxgkfPmpElI",
  plugins: [ iopipe_profiler({ enabled: true }) ]
});
const S3 = new aws.S3();

function encrypt () {
}

/* Endpoint that provides a JWT signed by us,
   creating a valid key on S3 & allowing access */
/* website will generate pub key, send to getKey
   which will return a JWT for use in sending request */
export const getRequestJwt = IOpipe((event, context, callback) => {
  callback(null, jsonwebtoken.sign(event.body, PRIVATE_KEY));
});

// eslint-disable-next-line import/prefer-default-export
export const handler = IOpipe((event, context, callback) => {
  var pathJwt = event.path;
  jsonwebtoken.verify(pathJwt, PRIVATE_KEY, (err, decodedJwt) => {
    if (err) return callback(null, {
      "statusCode": 400,
      "body": "Error in pathJwt"
    });
 
    var encryptedRequest = encrypt(event, decodedJwt.aud);
    const p = new Promise((resolve) => {
      S3.putObject(
        {
          Bucket: process.env.S3BUCKET,
          Key: decodedJwt.aud,
          Body: encryptedRequest
        },
        () => { resolve() }
      );
    });
    p
      .then(() => callback(null, 
        {
            "statusCode": 200,
            "body": "Hello RequestBin!"
        }
      ))
      .catch(e => callback(e));
  });
});
