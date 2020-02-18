module.exports = {
    config: {
        name: 'verify',
        description: 'Verify yourself through an email',
        aliases: [],
        availability: ['text', 'dm'],
        auth_level: 0,
        permitted: [],
        cooldown: 30000
    },
    exec: async (client, message, command) => {
        let email = command.message.content.split(' ')[1]
        let random = Math.floor(Math.random() * 90000) + 10000
        await client.globals.nodemailer.sendMail({
          from: 'ohioesports.noreply@gmail.com',
          to: email,
          subject: 'Discord Verification',
          text: `To verify your account, respond to the bot\'s DM with the code ${random}`
        }, (err, info) => {
          if (err) {
            message.channel.send(`Could not send verification email to \`\`${email}\`\``)
          } else {
            client.database.users.findOneAndUpdate({discord_id: message.author.id}, {
              $set: {
                verification: {
                  verified: false,
                  code: random,
                  sent: Date.now(),
                  email: email,
                  domain: email.slice(email.search(/(?<=@)(.+)/), email.length)
                },
                'cooldowns.verify': Date.now()
              }
            })
            message.author.send('Please enter the verification code that we sent to your email.\nIf the email you tried to verify with was incorrect, please try to verify again.')
          }
        })
    }
}
