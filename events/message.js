module.exports = {
  config: {
    name: 'message',
    aliases: ['msg']
  },
  exec: async (client, message) => {
    if (!message.author.bot) {
        let user = await client.database.users.findOneAndUpdate({discord_id: message.author.id}, {
            $setOnInsert: {
                discord_id: message.author.id,
                auth_level: 0,
                prefix: '.'
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

        if (user.stored_messages.length >= 4 && (Date.now() - user.stored_messages[4].created < 3000)) {
            return;
        }

        let command_parse = message.content.split(user.prefix)
        command_parse = command_parse.filter(command => command != '')
        let commands = []

        command_parse.forEach((request, index) => {
            const args = request.split(' ')
            const command = args.shift()

            const command_index = client.commands.findIndex(command_module => command_module.config.name == command.toLowerCase() || command_module.config.aliases.includes(command.toLowerCase()))
            if (command_index != -1) {
                const command_module = client.commands[command_index]
                const config = command_module.config
                if (user.auth_level >= config.auth_level || config.permitted.includes(message.author.id)) {
                    if (config.availability.includes(message.channel.type)) {
                        commands.push({
                            exec: command_module.exec,
                            args: args.filter(arg => arg != ''),
                            called_with: command.trimRight(),
                            query_index: index,
                            query_total: command_parse.length
                          })
                    }
                }
            }
          }, command_parse)

        if (commands.length > client.globals.MAX_COMMAND_PARSE) {
            commands.slice(client.globals.MAX_COMMAND_PARSE - 1)
        }

        const original_time = Date.now()
        for (let index = 0; index < commands.length; index++) {
            commands[index].called_at = Date.now(); commands[index].original_time = original_time
            await commands[index].exec(client, message, commands[index])
            await client.globals.sleep(client.globals.SLEEP_BETWEEN_COMMAND)
        }

        if (message.channel.type == 'text') {
            let guild = await client.database.guilds.findOneAndUpdate({guild_id: message.guild.id}, {
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
            guild = guild.value

        } else if (message.channel.type == 'dm') {

        }

    }
  }
}
