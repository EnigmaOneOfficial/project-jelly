module.exports = {
  config: {
    name: 'messageReactionAdd'
  },
  exec: async (client, reaction, user) => {
    user = await client.database.users.findOne({discord_id: user.id})
    console.log(user)
    if (reaction.emoji.name == '❌') {

    }
  }
}
