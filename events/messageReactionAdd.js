module.exports = {
  config: {
    name: 'messageReactionAdd',
    internal: {
      time_to_delete: 2000
    }
  },
  exec: async (client, reaction, user, event) => {
    user = await client.database.users.findOne({discord_id: user.id})
    if (reaction.emoji.name == '❌' && user.auth_level >= 9 && reaction.message.deletable == true && reaction.message.channel.type == 'text') {
      reaction.message.channel.send('\`\`deleting\`\`').then(async (message) => {
         await client.globals.sleep(event.internal.time_to_delete)
         if (message.deleted == false) {
           message.delete()
         }
      })
      await client.globals.sleep(event.internal.time_to_delete)
      reaction.message.delete()
    } else if (reaction.emoji.name == '💣' && user.auth_level >= 9 && reaction.message.deletable == true && reaction.message.channel.type == 'text') {
      reaction.message.channel.send(`\`\`purging ${reaction.message.author.username}\'s messages\`\``).then(async (message) => {
         await client.globals.sleep(event.internal.time_to_delete)
         if (message.deleted == false) {
           message.delete()
         }
      })
      await client.globals.sleep(event.internal.time_to_delete)
      reaction.message.channel.fetchMessages({limit: 100}).then(messages => {
        messages = messages.filter(message => (message.author.id == reaction.message.author.id && message.deletable == true))
        reaction.message.channel.bulkDelete(messages)
      })
    }
  }
}
