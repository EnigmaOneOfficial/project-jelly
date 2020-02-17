module.exports = {
    config: {
        name: 'ping',
        description: 'Test command to ping back',
        aliases: [],
        availability: ['text', 'dm'],
        auth_level: 0,
        permitted: [],
        internal: {
          delay: 5
        }
    },
    exec: async (client, message, command) => {
        let now = Date.now()
        await client.globals.sleep(client.globals.internal.ping_timeout)
        let after = Date.now()
        message.channel.send(`\`\`returned\`\` \`\`${(after - now) + (command.called_at - command.message_read)} ms\`\`\n\`\`after\`\` \`\`0 ms delay\`\``)
    }
}
