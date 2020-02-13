module.exports = {
    util: require('util'),
    fs: require('fs'),
    fetch: require('node-fetch'),
    SLEEP_BETWEEN_COMMAND: 0,
    MAX_COMMAND_PARSE: 10,
    internal: {
      ping_timeout: 100
    }
}
