module.exports = {
    config: {
        name: 'joe',
        description: 'internal testing command',
        aliases: [],
        availability: ['text', 'dm'],
        auth_level: 9,
        permitted: []
    },
    exec: async (client, message, command) => {
      message.channel.send('mama')
    }
}