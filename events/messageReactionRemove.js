module.exports = {
  config: {
    name: 'messageReactionRemove'
  },
  exec: async (client, reaction, user, event) => {
    if (user.bot == true) return

    let message = reaction.message
    let member = await message.guild.members.fetch(user.id)

    let guild = await client.database.guilds.findOne({guild_id: reaction.message.guild.id})
    let chart = guild.role_charts[reaction.message.id]

    if (chart != null) {
      let index = chart.reactions.findIndex(emoji => emoji == reaction.emoji.name)
      let role = await message.guild.roles.fetch(chart.roles[index])

      if (role && member.roles.cache.has(role.id)) {
        await member.roles.remove(role)
        chart.embed.embed.fields[index].name = `**${role.name} / ${role.members.size} members**`
        await message.edit(chart.embed)
        await client.database.guilds.findOneAndUpdate({guild_id: reaction.message.guild.id}, {
          $set :{
            [`role_charts.${reaction.message.id}.embed`]: chart.embed
          }
        })
      }
    }

  }
}
