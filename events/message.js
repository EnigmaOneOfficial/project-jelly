module.exports = {
  config: {
    name: 'message'
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
                    $each: [{message_id: message.id, original_content: message.cleanContent, created: message.createdTimestamp}],
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

        const command_parse = message.cleanContent.split(user.prefix)
        let commands = []

        command_parse.forEach(request => {
            const args = request.split(' ')
            const command = args.shift()

            const index = client.commands.findIndex(command_module => command_module.config.name == command.toLowerCase() || command_module.config.aliases.includes(command.toLowerCase()))
            if (index != -1) {
                const command_module = client.commands[index]
                const config = command_module.config
                if (user.auth_level >= config.auth_level || config.permitted.includes(message.author.id)) {
                    if (config.availability.includes(message.channel.type)) {
                        commands.push({exec: command_module.exec, args: args, called_with: request})
                    }
                }
            }
        })

        if (commands.length > client.globals.MAX_COMMAND_PARSE) {
            commands.slice(client.globals.MAX_COMMAND_PARSE - 1)
        }

        const current_time = Date.now()
        for (command of commands) {
            await command.exec(client, message, {args: command.args, called_with: command.called_with, current_time: current_time})
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
            console.log(guild)

        } else if (message.channel.type == 'dm') {

        }

    }
  }
}
