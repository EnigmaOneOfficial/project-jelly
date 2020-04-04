module.exports = {
    config: {
        name: 'verifychannel',
        description: 'Set a restricted channel in which people can verify in',
        aliases: [],
        availability: ['text'],
        auth_level: 3,
        permitted: []
    },
    exec: async (client, message, command) => {
      let channel = message.mentions.channels.first()
      await client.database.guilds.findOneAndUpdate({guild_id: message.guild.id}, {
        $set: {
          'verify_channel': channel.id
        }
      })
      message = await message.channel.send(`\`\`verify channel set to\`\` \`\`${channel.id}\`\``)
      await message.delete({timeout: 5000})
    }
}
