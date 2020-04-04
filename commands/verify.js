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
        let info = await client.globals.nodemailer.sendMail({
          from: 'ohioesports.noreply@gmail.com',
          to: email,
          subject: 'Discord Verification',
          html: `To finish verification, reply to the bot with the code <b>${random}</b>`,
          auth: {
            user: 'ohioesports.noreply@gmail.com',
            refreshToken: '1//04wNyONUBfmdmCgYIARAAGAQSNwF-L9IrqHzjVz1fc_kThdJ3bvo-VHJb7VINfyUkzZ8qPw1JUL0TK2wBSdMriypv_NwzHnPkn5o',
            accessToken: 'ya29.a0Ae4lvC0xGFt3f8vvG-IFLUIFiGkOK-PP_tDoYFE4f69FgNILrr0Nn6cgv0-hI3vIeGbWvESAn6aHj-g3tjisluUslRyHReEIzEZMpoy2Xo3hmm369eQmd9XQ70vwjTOiLAo9fBxyF3-C261eUmK__Fqse8Z9ka00MX0'
          }
        })
        if (!info) {
          message = await message.channel.send(`\`\`Could not send email to ${email}\`\``)
          await message.delete({timeout: 2000}).catch(err => 1)
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
          await message.delete({timeout: 1000}).catch(err => 1)
          await message.author.send(`\`\`An email has been sent to ${email}\`\`\n\`\`Please enter the 5 digit code that was sent\`\``)
        }
    }
}
