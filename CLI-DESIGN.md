cli:

- get a request url
: see/get parameters
: have --local/--daemon whatevs arg for local proxy
# https request to request.lol/geturl

- test request url command
# makes request to result of `get request url`.

- get the request as modified / received
: provide raw API Gateway / Cloudfront event
# fetch the data from S3.

- proxy mode to send requests to actual http services, making duplicate request to requestbin.

- "solve for TLS" can we use letencrypt in some useful way?
