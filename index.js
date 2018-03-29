import iopipe from '@iopipe/iopipe'
import aws from 'aws-sdk'

const IOpipe = iopipe();
const S3 = new aws.S3();

function encrypt () {
}

/* Endpoint that provides a JWT signed by us,
   creating a valid key on S3 & allowing access */
/* website will generate pub key, send to getKey
   which will return a JWT for use in sending request */
export const getRequestJwt = IOpipe((event, context, callback) => {
  callback(null, jwt.sign(event.body, PRIVATE_KEY));
});

// eslint-disable-next-line import/prefer-default-export
export const handler = IOpipe((event, context, callback) => {
  var pathJwt = event.path;
  jwt.verify(pathJwt, PRIVATE_KEY, (err, decodedJwt) => {
    if (err) return callback("Error in pathJwt");
 
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
            "isBase64Encoded": false,
            "statusCode": 200,
            "body": "Hello RequestBin!"
        }
      ))
      .catch(e => callback(e));
  });
});
