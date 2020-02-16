module.exports = {
  config: {
    name: 'messageReactionAdd'
  },
  exec: async (client, reaction, user) => {
    user = await client.database.users.findOne({discord_id: user.id})
    if (reaction.emoji.name == '❌' && user.auth_level >= 9) {
<<<<<<< HEAD
      reaction.message.channel.send('\`\`deleting message...\`\`').then(async (message) => {
=======
      reaction.message.channel.send('\`\`deleting message...\`\`').then(message => {
>>>>>>> a338fd331ba029b0f08851f02d6b74e3b1420327
        await client.globals.sleep(2000)
        message.delete()
      })
      await client.globals.sleep(2000)
      reaction.message.delete()
    }
  }
}
