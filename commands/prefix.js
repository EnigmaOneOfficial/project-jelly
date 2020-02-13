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
        if (prefix && prefix.length > 0 && prefix.length <= 8) {
            client.database.users.updateOne({discord_id: message.author.id}, {
                $set: {
                    prefix: prefix
                }
            })
            message.channel.send(`\`\`new prefix\`\` \`\`${prefix}\`\``)
        } else if (!prefix) {
            message.channel.send('\`\`too short\`\`\n\`\`must be between 1-8 characters\`\`')
        } else if (prefix && prefix.length > 8) {
            message.channel.send('\`\`too long\`\`\n\`\`must be between 1-8 characters\`\`')
        }
    }
}
