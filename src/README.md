# Enc Web RTC Connection Workflow

Some text

1. Client1: Create Server

Request
```
POST api/v1/create
```

Response
```
{
    "id": "myId1"
}
```

2. Client1: Periodically check if someone wants to connect

Request
```
GET api/v1/connectstart/myId1
```

Response
```
[
    {
        "id": "myId2"
    },
    {
        "id": "myId3"
    }
]
```

3. Client2: Initiate connection

Request
```
POST api/v1/connectstart/myId1
```

Response
```
{
    "id": "myId2"
}
```

4. Client2: Periodically check for a connect offer

Request
```
GET api/v1/connectoffer/myId1/myId2
```

Response
```
{...}
```


5. Client1: Offer a connection

Request
```
PUT api/v1/connectoffer/myId1/myId2

{...}
```

6. Client2: Answer connect offer

Request
```
PUT api/v1/connectanswer/myId1/myId2

{...}
```

7. Client1: Get connect answer

Request
```
GET api/v1/connectanswer/myId1/myId2
```

Response
```
{...}
```

8. Client1: Send ICE Candidate
Request
```
PUT api/v1/client1icecandidate/myId1/myId2

{...}
```

9. Client1: Get ICE Candidate
Request
```
GET api/v1/client2icecandidates/myId1/myId2
```

Response
```
[{...}}
```

10. Client2: Send ICE Candidate

Request
```
PUT api/v1/client2icecandidate/myId1/myId2

{...}
```

11. Client2: Get ICE Candidate
Request
```
GET api/v1/client1icecandidates/myId1/myId2
```

Response
```
[{...}}
```

