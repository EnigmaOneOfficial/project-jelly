module.exports = {
    config: {
        name: 'prefix',
        description: 'Changes your prefix',
        aliases: ['pre'],
        availability: ['text', 'dm'],
        auth_level: 0,
        permitted: []
    },
    exec: async (client, message, command) => {
        let prefix = command.args[0]
        if (prefix.length > 0) {
            client.database.users.updateOne({discord_id: message.author.id}, {
                $set: {
                    prefix: prefix
                }
            })
        }
    }
}
