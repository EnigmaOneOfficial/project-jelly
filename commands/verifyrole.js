module.exports = {
    config: {
        name: 'verifyrole',
        description: 'Set a role to give out after email verification',
        aliases: [],
        availability: ['text'],
        auth_level: 3,
        permitted: []
    },
    exec: async (client, message, command) => {
      let role = message.mentions.roles.first()
      await client.database.guilds.findOneAndUpdate({guild_id: message.guild.id}, {
        $set: {
          'verify_role': role.id
        }
      })
      message.channel.send(`\`\`verify role set to\`\` \`\`${role.id}\`\``)
    }
}
