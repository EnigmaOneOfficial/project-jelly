module.exports = {
    config: {
        name: 'verify',
        description: 'Verify yourself through an email',
        aliases: [],
        availability: ['text'],
        auth_level: 0,
        permitted: []
    },
    exec: async (client, message, command) => {
        let email = command.message.content.split(' ')[1]
        let random = Math.floor(Math.random() * 90000) + 10000
        await client.globals.nodemailer.sendMail({
          from: 'ohioesports.noreply@gmail.com',
          to: email,
          subject: 'Discord Verification',
          html: `To finish verification, reply to the bot with the code <b>${random}</b>`
        }, async (err, info) => {
          if (err) {
            message.channel.send(`\`\`Could not send email to ${email}\`\``)
          } else {
            client.database.users.findOneAndUpdate({discord_id: message.author.id}, {
              $set: {
                verification: {
                  status: 'verifying',
                  code: random,
                  email: email,
                  domain: email.slice(email.search(/(?<=@)(.+)/), email.length),
                  guild: message.guild.id
                }
              }
            })
            await message.delete({timeout: 1000})
            await message.author.send(`\`\`An email has been sent to ${email}\`\`\n\`\`Please enter the 5 digit code that was sent\`\``)
          }
        })
    }
}
