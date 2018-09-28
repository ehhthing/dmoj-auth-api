# DMOJ Authentication API

This API lets third parties verify that a user has control over a DMOJ account. This is done by asking the user to add a randomly generated token to their profile.


## API
#### `/v1/register/:username` 
Request a token from the API, this token should be added to anywhere on the user's profile description and can be removed after confirmation. Tokens by default expire after 10 minutes.

**Example Response**
```javascript
{
    "status": 200,
    "token": "10r6pa2o7h4jmmn14op",
    "username": "example"
}
```

#### `/v1/authenticate/:token`
Verify that the token has been added to the user's profile, once you call this with a valid token, the token will be invalidated. Users can remove this from their profile after calling this.

**Example Response**
```javascript
{
    "status": 200,
    "authenticated": true // if this is false, then the user has not authenticated yet and a new token needs to be generated
}
```

## Config

```javascript
    usernameRegex: /[^0-9a-zA-Z_]/g,    // regex to detect any invalid username characters
    tokenRegex: /[^0-9a-z]/g,           // regex to detect any
    tokenValidTime: 1000 * 60 * 10,     // tokens are valid for 10 minutes
    dmoj: {                             // dmoj endpoints
        userInfoEndpoint: "https://dmoj.ca/api/user/info/",
        userProfileEndpoint: "https://dmoj.ca/user/"
    },
    errors: { // Error messages
        notFound: {
            status: 404,
            error: "not found"
        },
        internalServerError: {
            status: 500,
            error: "internal server error"
        },
        invalidUsername: {
            status: 400,
            error: "Invalid username."
        },
        invalidToken: {
            status: 400,
            error: "Invalid token"
        },
    },
    port: 3005 // Port that the app will listen on.
```
