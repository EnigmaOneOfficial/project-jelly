module.exports = {
    config: {
        name: 'github',
        description: 'Get a link to the project\'s Github',
        aliases: ['git', 'project'],
        availability: ['text', 'dm'],
        auth_level: 0,
        permitted: []
    },
    exec: async (client, message, other) => {
      message.channel.send('https://github.com/EnigmaOneOfficial/project-jelly')
    }
}
