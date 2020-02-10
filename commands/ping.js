module.exports = {
    config: {
        name: 'ping',
        description: 'Test command to ping back',
        aliases: [],
        availability: ['text'],
        auth_level: 0,
        permitted: []
    },
    exec: async (client, message, other) => {
        message.channel.send(`\`\`returned: ${other.current_time - message.createdTimestamp} ms\`\``)
    }
}