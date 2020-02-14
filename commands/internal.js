module.exports = {
    config: {
        name: 'internal',
        description: 'internal testing command',
        aliases: ['i'],
        availability: ['text', 'dm'],
        auth_level: 9,
        permitted: []
    },
    exec: async (client, message, command) => {
      message.channel.send('\`\`internal testing\`\`')
    }
}
