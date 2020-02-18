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
    let message_read = Date.now()
    const channel_type = message.channel.type
    if (!message.author.bot) {
        let user = await client.database.users.findOneAndUpdate({discord_id: message.author.id}, {
            $setOnInsert: {
                discord_id: message.author.id,
                auth_level: 0,
                prefix: '.',
                verification: {
                  verified: false,
                  code: 0,
                  sent: 0,
                  email: ''
                },
                cooldowns: {},
            },
            $inc: {
                total_message_count: 1
            },
            $push: {
                stored_messages: {
                    $each: [{message_id: message.id, original_content: message.content, created: message.createdTimestamp}],
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

        if (user.stored_messages.length >= 4 && (Date.now() - user.stored_messages[4].created < event.internal.spam_detection)) {
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
                    if ((user.auth_level >= config.auth_level || config.permitted.includes(message.author.id)) && config.availability.includes(channel_type) &&
                      (user.cooldowns[config.name] && config.cooldown && message_read - user.cooldowns[config.name] > config.cooldown) || !user.cooldowns[config.name]) {
                          commands.push({
                              self: command_module.config,
                              args: args.filter(arg => arg != ''),
                              called_with: command.trimRight(),
                              query_index: index,
                              message_read: message_read,
                              user: user,
                              exec: command_module.exec,
                              message: message
                            })
                            query.push(config.name)
                      } else if ((user.auth_level >= config.auth_level || config.permitted.includes(message.author.id)) && config.availability.includes(channel_type) &&
                        user.cooldowns[config.name] && config.cooldown && message_read - user.cooldowns[config.name] > config.cooldown < config.cooldown) {
                          message.channel.send(`you can not use that command for \`\`${config.cooldown - (message_read - user.cooldowns[config.name])}\`\``)
                      }
                    }
              }, command_parse)

            if (commands.length > event.internal.max_command_parse) {
                commands = commands.slice(0, event.internal.max_command_parse)
            }

            const original_time = Date.now()
            for (let index = 0; index < commands.length; index++) {
                commands[index].called_at = Date.now(); commands[index].original_time = original_time; commands[index].query = query
                await commands[index].exec(client, message, commands[index])
                if (commands[index].self.cooldown && commands[index].self.cooldown > 0 && commands[index].self.cooldown < 10000) {
                  await client.globals.sleep(commands[index].self.cooldown)
                }
                await client.globals.sleep(event.internal.sleep_between_command)
            }
          }
        }

        if (channel_type == 'text') {
            await client.database.guilds.findOneAndUpdate({guild_id: message.guild.id}, {
                $setOnInsert: {
                    guild_id: message.guild.id,
                    settings: {

                    }
                },
                $inc: {
                    total_message_count: 1
                }
            },
            {
                upsert: true,
                returnOriginal: false
            })
        } else if (channel_type == 'dm') {
          if (message.content.length == 5 && isNaN(message.content.trimRight()) == false && user.verification.code == message.content && user.verification.verified == false) {
            let author_id = message.author.id
            message.channel.send(`\`\`verifying...\`\``).then(async (message) => {
              let updated_user = await client.database.users.findOneAndUpdate({discord_id: author_id}, {
                $set: {
                  'verification.verified': true,
                  'verification.code': 0
                }
              }, {returnOriginal: false, upsert: true})
              await client.globals.sleep(2000)
              message.edit(`\`\`verified with\`\`\n\`\`${updated_user.value.verification.email}\`\``)
            })
          }
        }
      }
    }
}
