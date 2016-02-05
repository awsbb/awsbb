# AuthCreateUser
![](./AUTHCREATEUSER.png)

## WebSequenceDiagrams Code:
[WebSequenceDiagrams](https://www.websequencediagrams.comm)

```
title awsBB AuthCreateUser

participant "User" as u
participant "S3" as s3
participant "API Gateway" as api
participant "Lambda" as l
participant "DynamoDB" as db
participant "SNS" as sns

u->s3: User enters registration details and clicks "Submit"
activate u
activate s3
s3->api: Call API
activate api
api->l: AuthCreateUser()
activate l
l->l: Validate Payload
l->db: Ensure user is unique
activate db
db-->l: Unique True/False/Error
deactivate db
l->l: Create User object
l->l: Create Verify token
l->db: Save User with Token
activate db
db-->l: Saved True/False/Error
deactivate db
l->l: Generate verification E-mail
l->sns: Send verification E-mail
activate sns
sns-->l: Sent True/False/Error
deactivate sns
l-->api: Success/Error
deactivate l
api-->s3: Success/Error
deactivate api
s3-->u: Render response
deactivate u
```
