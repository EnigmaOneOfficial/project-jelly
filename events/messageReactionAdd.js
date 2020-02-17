module.exports = {
  config: {
    name: 'messageReactionAdd'
  },
  exec: async (client, reaction, user) => {
    user = await client.database.users.findOne({discord_id: user.id})
    if (reaction.emoji.name == '❌' && user.auth_level >= 9 && reaction.message.deletable == true) {
      reaction.message.channel.send('\`\`deleting\`\`').then(async (message) => {
         await client.globals.sleep(2000)
         if (message.deleted == false) {
           message.delete()
         }
      })
      await client.globals.sleep(2000)
      reaction.message.delete()
    } else if (reaction.emoji.name == '💣' && user.auth_level >= 9 && reaction.message.deletable == true) {
      reaction.message.channel.send('\`\`purging\`\`').then(async (message) => {
         await client.globals.sleep(2000)
         if (message.deleted == false) {
           message.delete()
         }
      })
      await client.globals.sleep(2000)
      reaction.message.channel.fetchMessages({limit: 100}).then(messages => {
        reaction.message.channel.bulkDelete(message)
      })
    }
  }
}
