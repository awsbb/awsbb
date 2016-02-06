# AuthLostPassword
![](./AUTHLOSTPASSWORD.png)

## WebSequenceDiagrams Code:
[WebSequenceDiagrams](https://www.websequencediagrams.comm)

```
title awsBB AuthLostPassword

participant "User" as u
participant "S3" as s3
participant "API Gateway" as api
participant "Lambda" as l
participant "DynamoDB" as db
participant "SES" as ses

u->s3: User enters email and clicks "Submit"
activate u
activate s3
s3->api: Call API
activate api
api->l: AuthLostPassword()
activate l
l->l: Validate Payload
l->db: Get user object
activate db
db-->l: Found True/False/Error
deactivate db
l->l: Create "Lost" token
l->db: Update user with "Lost" token in db
activate db
db-->l: Saved True/False/Error
deactivate db
l->ses: Send "Lost" token via email with link
activate ses
ses-->l: Success/Error
deactivate ses
l-->api: Success/Error
deactivate l
api-->s3: Success/Error
deactivate api
s3-->u: Render response
```
