const cache = require("memory-cache");
const randomToken = require('uniqid');
const request = require("request-promise-native");
const parser = require("node-html-parser");
const config = require("./config.js");
const util = require("./util");

const fastify = require("fastify")({
    logger: {
        level: 'warn',
    }
});

// rate limiting
fastify.register(require('fastify-rate-limit'), {
    max: 100,
    timeWindow: '1 minute'
});

// error handling
fastify.decorate("notFound", function (req, res) {
    res.code(404).send(config.errors.notFound);
});

fastify.decorate("error", function (err, req, res) {
    res.code(500).send(config.errors.internalServerError);
});

fastify.setNotFoundHandler(fastify.notFound);
fastify.setErrorHandler(fastify.error);


// create a token and attach it to a username
fastify.get("/v1/register/:username", async function (req, res) {
    const username = req.params.username;
    if (!(await util.verifyUsername(username))) {
        return res.code(400).send(config.errors.invalidUsername);
    }
    const token = randomToken();
    cache.put(token, username, config.tokenValidTime);
    return res.send({status: 200, token: token, username: username});
});


// validate that the token is in the user's description
fastify.get("/v1/authenticate/:token", async function (req, res) {
    const token = req.params.token;
    if (!util.verifyToken(token)) {
        return res.code(400).send(config.errors.invalidToken);
    }
    const username = cache.get(token);
    if (!username) {
        return res.code(400).send(config.errors.invalidToken);
    }
    cache.del(token);
    try {
        const response = await request(config.dmoj.userProfileEndpoint + username);
        const parsedResponse = parser.parse(response);
        const userDescription = parsedResponse.querySelector(".content-description").toString();
        if (userDescription.indexOf(token) !== -1) {
            return res.send({status: 200, authenticated: true});
        } else {
            return res.send({status: 200, authenticated: false});
        }
    } catch (e) {
        console.error(e);
        return res.code(500).send(config.errors.internalServerError)
    }
});

fastify.listen(config.port, function () {
    console.log("API server started");
});