# Review me

## Requirements


- [apex](http://apex.run/)

## Setup

- _~/.aws/credentials_

```
[hoi]
aws_access_key_id = AWS_ACCESS_KEY_ID
aws_secret_access_key = AWS_SECRET_ACCESS_KEY
```

- _~/.aws/config_

````
[profile hoi]
output = json
region = ap-northeast-1
```

```
$ cp env.json.sample env.json
$ apex deploy --profile hoi --env-file env.json
```
