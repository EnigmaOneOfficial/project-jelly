module.exports = {
    util: require('util'),
    fs: require('fs'),
    octokit: require('@octokit/rest').Octokit,
    curl: require('curlrequest'),
    config: require('./config.json'),
    nodemailer: require('nodemailer'),createTransport({
      auth: {
        user: 'ohioesports.noreply@gmail.com',
        pass: 'LkQPQwJVb8Kfc9w'
      }
    },
    {
      from: 'ohioesports.noreply@gmail.com'
    }),
    load: async function() {
      this.promisify = this.util.promisify
      this.readdir = this.promisify(this.fs.readdir)
      this.writeFile = this.promisify(this.fs.writeFile)
      this.sleep = this.promisify(setTimeout)
      this.git = new this.octokit({
        auth: this.config.git_token,
        userAgent: 'project-jelly'
      })
    }
}
