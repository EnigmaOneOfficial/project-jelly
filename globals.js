module.exports = {
    util: require('util'),
    fs: require('fs'),
    octokit: require('@octokit/rest').Octokit,
    curl: require('curlrequest'),
    config: require('./config.json'),
    SLEEP_BETWEEN_COMMAND: 0,
    MAX_COMMAND_PARSE: 10,
    load: async function() {
      this.promisify = this.util.promisify
      this.readdir = this.promisify(this.fs.readdir)
      this.writeFile = this.promisify(this.fs.writeFile)
      this.sleep = this.promisify(setTimeout)
      this.git = new this.octokit({
        auth: this.config.git_token,
        userAgent: 'project-jelly'
      })

    },
    internal: {
      ping_timeout: 100
    }
}
