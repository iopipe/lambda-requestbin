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

### 1st way: using `eva`

Check out http://github.io/iopipe/eva for more details

### 2nd way: using `curl`

#### Curl your lambda 

```
curl your-lambda-domain/geturl
```

This will return the Request Address (the URL you send requests to to capture results)

#### Curl your response URL (retrieve your request)

```
curl [returned URL from previous step] 
```

#### Curl CloudFront Domain

```
curl -H "Authorization: Bearer [the JWT included in the GetURL step]" your-cloudfront-domain/[return JSON filename]
```
This returns the request you wish to play back.


# License

Apache/2.0
