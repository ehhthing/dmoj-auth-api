const config = require("./config");
const request = require("request-promise-native");
module.exports = {
    // validates that a username is valid and exists.
    verifyUsername: async function (username) {
        if (!((typeof username === "string") && (username.length > 0) && (!username.match(config.usernameRegex)))) {
            return false;
        }
        try {
            await request(config.dmoj.userInfoEndpoint + username);
        } catch (e) {
            return false;
        }
        return true;
    },

    // verify a token as valid
    verifyToken: function (token) {
        return (typeof token === "string") && (token.length > 10) && (token.length < 100) && (!token.match(config.tokenRegex));
    }
};
