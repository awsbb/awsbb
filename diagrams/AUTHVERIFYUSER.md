# AuthVerifyUser
![](./AUTHVERIFYUSER.png)

## WebSequenceDiagrams Code:
[WebSequenceDiagrams](https://www.websequencediagrams.comm)

```
title awsBB AuthVerifyUser

participant "User" as u
participant "S3" as s3
participant "API Gateway" as api
participant "Lambda" as l
participant "DynamoDB" as db

u->s3: User clicks link from email
activate u
activate s3
s3->api: Call API
activate api
api->l: AuthVerifyUser()
activate l
l->l: Validate Payload
l->db: Get user object
activate db
db-->l: Found True/False/Error
deactivate db
l->l: Compare supplied "Verify" token with saved
l->db: Update user with as verified
activate db
db-->l: Saved True/False/Error
deactivate db
l-->api: Success/Error
deactivate l
api-->s3: Success/Error
deactivate api
s3-->u: Render response
deactivate u
```
