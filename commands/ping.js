module.exports = {
    config: {
        name: 'ping',
        description: 'Test command to ping back',
        aliases: [],
        availability: ['text', 'dm'],
        auth_level: 0,
        permitted: []
    },
    exec: async (client, message, command) => {
        let now = Date.now()
        await client.globals.sleep(client.globals.SLEEP_BETWEEN_COMMAND)
        let after = Date.now()
        message.channel.send(`\`\`returned: ${(after - now) + (command.called_at - message.createdTimestamp)} ms\`\`\n\`\`after: ${client.globals.SLEEP_BETWEEN_COMMAND} ms delay\`\``)
    }
}
