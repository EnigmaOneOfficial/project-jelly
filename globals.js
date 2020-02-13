module.exports = {
    util: require('util'),
    fs: require('fs'),
    octokit: require('@octokit/rest').Octokit,
    curl: require('curlrequest'),
    SLEEP_BETWEEN_COMMAND: 0,
    MAX_COMMAND_PARSE: 10,
    internal: {
      ping_timeout: 100
    }
}
