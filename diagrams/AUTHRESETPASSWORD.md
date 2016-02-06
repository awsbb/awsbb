# AuthResetPassword
![](./AUTHRESETPASSWORD.png)

## WebSequenceDiagrams Code:
[WebSequenceDiagrams](https://www.websequencediagrams.comm)

```
title awsBB AuthResetPassword

participant "User" as u
participant "S3" as s3
participant "API Gateway" as api
participant "Lambda" as l
participant "DynamoDB" as db

u->s3: User enters password details and clicks "Submit"
activate u
activate s3
s3->api: Call API
activate api
api->l: AuthResetPassword()
activate l
l->l: Validate Payload
l->db: Get user object's token
activate db
db-->l: Found True/False/Error
deactivate db
l->l: Compare supplied "Lost" token with saved
l->l: Generate new password hash
l->db: Update user with new hash in db
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
