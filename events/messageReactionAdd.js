module.exports = {
  config: {
    name: 'messageReactionAdd'
  },
  exec: async (client, reaction, user) => {
    user = await client.database.users.findOne({discord_id: user.id})
    if (reaction.emoji.name == '❌' && user.auth_level >= 9) {
      reaction.message.channel.send('\`\`deleting\`\`').then(async (message) => {
         await client.globals.sleep(2000)
         message.delete()
      })
      await client.globals.sleep(2000)
      reaction.message.delete()
    }
  }
}
