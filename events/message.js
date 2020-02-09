module.exports = async (client, message) => {
    if (!message.author.bot) {

        let user = await client.database.users.findOneAndUpdate({discord_id: message.author.id}, {
            $setOnInsert: {
                discord_id: message.author.id,
                auth_level: 0,

            },
            $inc: {
                totalMessageCount: 1
            },
            $push: {
                storedMessages: {
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

        if (message.channel.type == 'text') {
            let guild = await client.database.guilds.findOneAndUpdate({guild_id: message.guild.id}, {
                $setOnInsert: {
                    guild_id: message.guild.id
                }
            },
            {
                upsert: true,
                returnOriginal: false
            })
            guild = guild.value

            if ((Date.now() - user.storedMessages[4].created) < 3000) {
                message.delete()
                message.channel.send('do not spam dude')
            }

        } else if (message.channel.type == 'dm') {
            
        }

    }
}