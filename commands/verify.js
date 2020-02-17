module.exports = {
    config: {
        name: 'verify',
        description: 'Verify yourself through an email',
        aliases: [],
        availability: ['text', 'dm'],
        auth_level: 0,
        permitted: []
    },
    exec: async (client, message, command) => {
      let email = command.args[0].search(/^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/)
      if (email != null) {
        await client.globals.nodemailer.sendMail({
          to: email,
          subject: 'Discord Verification',
          text: `To verify your account, respond to the bot\`s DM with the code ${Math.floor(Math.random() * 90000 + 10000)}`
        })
      }
    }
}
