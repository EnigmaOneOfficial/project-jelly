module.exports = {
    config: {
        name: 'verifydomain',
        description: 'Link the verification role to a certain domain',
        aliases: [],
        availability: ['text'],
        auth_level: 3,
        permitted: []
    },
    exec: async (client, message, command) => {
      let domain = message.cleanContent.split(' ')[1]
      await client.database.guilds.findOneAndUpdate({guild_id: message.guild.id}, {
        $set: {
          'verify_domain': domain
        }
      })

      message.channel.send(`\`\`verify domain set to\`\` \`\`${domain}\`\``)
    }
}
