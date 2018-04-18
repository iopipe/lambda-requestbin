# RequestBin-Lambda

## *WARNING* This is not production-ready code and is not supported by IOpipe.

RequestBin service based on AWS Lambda.

Live-coded on the [IOpipe Twitch Channel](https://twitch.tv/iopipe)!

## Setup

### Install dependencies/tools

RequestBin's deps are documented in `package.json`. You'll also need to install the [serverless framework](http://serverless.com) as a build tool.

```
npm i
sudo npm i -g serverless
```

### Deploy via `sls`

Make sure you've [configured your AWS login with serverless framework](https://serverless.com/framework/docs/providers/aws/guide/quick-start/), then:

```
sls deploy
``` 

### Configure CloudFront Distribution

#### Create CloudFront Distribution

Specify S3 Bucket as Origin-- this is done in the wizard when creating CloudFront Distribution.

#### Edit Behavior

Associate Lambda Function for Viewer Request-- you'll use an ARN with an exact version number to associate.

## How to make requests

### Curl your lambda 

#### Get a RequestBin:

```
curl your-lambda-domain/geturl
```

This will return JSON in the following format:

```
{
  requestTo: "<https url>",
  requestFrom: "<https url>",
  requestFromToken: "<Bearer Token for Authorization Header>",
  requestFromCurl: "<curl command that uses requestFrom url and bearer token>"
}
```

# Use the RequestBin:

1. Send request to `requestTo` url.
2. Run the `requestFromCurl` command.

If desiring to build an API consumer, make an HTTP GET request from the `requestFrom` url using an `Authoriation: Bearer <requestFromToken>` header.

# License

Apache/2.0
