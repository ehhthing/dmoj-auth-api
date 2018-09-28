module.exports = {

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
};