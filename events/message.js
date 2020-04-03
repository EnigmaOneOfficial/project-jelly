module.exports = {
  config: {
    name: 'message',
    internal: {
      sleep_between_command: 0,
      max_command_parse: 5,
      spam_detection: 2000
    }
  },
  exec: async (client, message, event) => {
    const message_read = Date.now()
    const channel_type = message.channel.type

    if (!message.author.bot) {
        let user = await client.database.users.findOneAndUpdate({discord_id: message.author.id}, {
            $setOnInsert: {
                discord_id: message.author.id,
                name: message.author.username,
                auth_level: 0,
                prefix: '.',
                verification: {
                  status: 'unverified',
                  code: 0,
                  email: '',
                  domain: ''
                }
            },
            $inc: {
                total_message_count: 1
            },
            $push: {
                stored_messages: {
                    $each: [{message_id: message.id, content: message.content, created: message.createdTimestamp}],
                    $slice: 10,
                    $position: 0
                }
            }
        },
        {
            upsert: true,
            returnOriginal: false
        })
        user = user.value

        if (user.stored_messages.length >= 4 && (Date.now() - user.stored_messages[3].created < event.internal.spam_detection)) {
            return;
        }

        if (message.content.startsWith(user.prefix)) {
          let command_parse = message.content.split(user.prefix)
          if (command_parse.length > 0) {
            command_parse = command_parse.filter(command => command != '')
            let commands = []
            let query = []

            command_parse.forEach((request, index) => {
                const args = request.split(' ')
                const command = args.shift()

                const command_index = client.commands.findIndex(command_module => (command_module.config.name.toLowerCase() == command.toLowerCase() || command_module.config.aliases.includes(command.toLowerCase())))
                if (command_index != -1) {
                    const command_module = client.commands[command_index]
                    const config = command_module.config
                    if ((user.auth_level >= config.auth_level || config.permitted.includes(message.author.id)) && config.availability.includes(channel_type)) {
                        commands.push({
                            self: command_module.config,
                            args: args.filter(arg => arg != ''),
                            called_with: command.trimRight(),
                            called_by: message.author.id,
                            query_index: index,
                            message_read: message_read,
                            user: user,
                            exec: command_module.exec,
                            message: message
                          })
                          query.push(config.name)
                      }
                      else if (user.auth_level < config.auth_level) {
                        message.reply(`\`\`you do not have the required authorization level to use this command\`\`\n\`\`required level: ${config.auth_level}\`\`\n\`\`your level: ${user.auth_level}\`\``).then(async message => {
                          await client.globals.sleep(5000)
                          message.delete()
                        })
                      }
                    }
              }, command_parse)

              if (commands.length > event.internal.max_command_parse) {
                  commands = commands.slice(0, event.internal.max_command_parse)
              }

              for (let index = 0; index < commands.length; index++) {
                  let current_time = Date.now()
                  commands[index].called_at = current_time; commands[index].query = query
                  await commands[index].exec(client, message, commands[index])
                  await client.globals.sleep(event.internal.sleep_between_command)
              }

          }
        }

        if (channel_type == 'text') {
            await client.database.guilds.findOneAndUpdate({guild_id: message.guild.id}, {
                $inc: {
                    total_message_count: 1
                }
            })
        } else if (channel_type == 'dm') {
          if (message.content.length == 5 && isNaN(message.content.trimRight()) == false && user.verification.code == message.content && user.verification.verified != 'verified') {
            let author_id = message.author.id
            message.channel.send(`\`\`verified with\`\`\n\`\`${user.verification.email}\`\``).then(async (message) => {
              await client.database.users.findOneAndUpdate({discord_id: author_id}, {
                $set: {
                  'verification.status': 'verified',
                }
              }, {returnOriginal: false, upsert: true})
            })
            let guild_db = await client.database.guilds.findOne({guild_id: user.verification.guild})
            if (guild_db.verify_role && ((guild_db.verify_domain && guild_db.verify_domain == user.verification.domain) || !guild_db.verify_domain)) {
              let guild = client.guilds.resolve(user.verification.guild)
              let role = await guild.roles.fetch(guild_db.verify_role)
              let member = await guild.members.fetch(message.author)
              await member.roles.add(role.id)
            }
          }
        }
      }
    }
}
