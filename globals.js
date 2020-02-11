module.exports = {
    sleep: require('util').promisify(setTimeout),
    SLEEP_BETWEEN_COMMAND: 1000,
    MAX_COMMAND_PARSE: 10
}
