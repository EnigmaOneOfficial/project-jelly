module.exports = {
    sleep: require('util').promisify(setTimeout),
    SLEEP_BETWEEN_COMMAND: 250
}