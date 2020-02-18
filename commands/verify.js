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
        let email = command.args[0]
        await client.globals.nodemailer.sendMail({
          from: 'ohioesports.noreply@gmail.com',
          to: email,
          subject: 'Discord Verification',
          text: `To verify your account, respond to the bot\`s DM with the code ${Math.floor(Math.random() * 90000 + 10000)}`
        }, (err, info) => {
          if (err) {
            message.channel.send(`Could not send verification email to \`\`${email}\`\``)
          } else {
            message.author.send('Please enter the verification code that we sent to your email.\nIf the email you tried to verify with was incorrect, please try to verify again.')
          }
        })
    }
}
