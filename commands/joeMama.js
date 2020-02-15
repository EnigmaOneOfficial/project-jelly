module.exports = {
    config: {
        name: 'joeMama',
        description: 'internal testing command',
        aliases: [],
        availability: ['text', 'dm'],
        auth_level: 9,
        permitted: []
    },
    exec: async (client, message, command) => {
      message.channel.send('\`\`internal testing\`\`')
    }
}
