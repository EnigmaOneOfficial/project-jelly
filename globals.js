module.exports = {
    discord: require('discord.js'),
    util: require('util'),
    fs: require('fs'),
    octokit: require('@octokit/rest').Octokit,
    curl: require('curlrequest'),
    config: require('./config.json'),
    http: require('http'),
    google: require('googleapis').google,
    readline: require('readline'),
    nodemailer: require('nodemailer').createTransport({
      host: 'smtp.gmail.com',
      secure: true,
      auth: {
        type: 'OAuth2',
        clientId: '1042462839159-unmrtm7sjsi7f8ttgjq5apsbm2qr8qoq.apps.googleusercontent.com',
        clientSecret: '6OAT6CsJYydySWDlP0MSiuY2',
      }
    }),
    load: async function() {
      this.promisify = this.util.promisify
      this.readdir = this.promisify(this.fs.readdir)
      this.writeFile = this.promisify(this.fs.writeFile)
      this.readFile = this.promisify(this.fs.readFile)
      this.sleep = this.promisify(setTimeout)
      this.git = new this.octokit({
        auth: this.config.git_token,
        userAgent: 'project-jelly'
      })
    }
}
