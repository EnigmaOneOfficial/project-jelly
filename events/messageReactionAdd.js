module.exports = {
  config: {
    name: 'messageReactionAdd',
    internal: {
      time_to_delete: 2000
    }
  },
  exec: async (client, reaction, user, event) => {
    if (user.bot == true) return

    let message = reaction.message
    let member = await message.guild.members.fetch(user.id)

    let guild = await client.database.guilds.findOne({guild_id: reaction.message.guild.id})
    let chart = guild.role_charts[reaction.message.id]

    if (chart != null) {
      if (chart.index != chart.length && chart.creator == user.id) {
        chart.embed.embed.fields[chart.index].value = reaction.emoji.name
        if (chart.index + 1 != chart.length) {
          chart.embed.embed.fields[chart.index + 1].value = '**React to select an emoji for this role**'
        }

        await client.database.guilds.findOneAndUpdate({guild_id: reaction.message.guild.id}, {
          $inc: {
            [`role_charts.${reaction.message.id}.index`]: 1
          },
          $set: {
            [`role_charts.${reaction.message.id}.embed`]: chart.embed
          },
          $push: {
            [`role_charts.${reaction.message.id}.reactions`]: reaction.emoji.name
          }
        })
        message.edit(chart.embed).then(async message => {
          await message.react(reaction.emoji.name)
          await reaction.users.remove(user.id)
        })
      } else if (chart.index == chart.length) {
        let index = chart.reactions.findIndex(emoji => emoji == reaction.emoji.name)
        let role = await message.guild.roles.fetch(chart.roles[index])

        if (role && !member.roles.cache.has(role.id)) {
          await member.roles.add(role)
          chart.embed.embed.fields[index].name = `**${role.name} / ${role.members.array().length} members**`
          message.edit(chart.embed)
          await client.database.guilds.findOneAndUpdate({guild_id: reaction.message.guild.id}, {
            $set: {
              [`role_charts.${reaction.message.id}.embed`]: chart.embed
            }
          })
        }

      }
    } else if (reaction.emoji.name == '❌' && user.auth_level >= 9 && reaction.message.deletable == true && reaction.message.channel.type == 'text') {
      reaction.message.channel.send('\`\`deleting\`\`').then(async (message) => {
         await client.globals.sleep(event.internal.time_to_delete)
         if (message.deleted == false) {
           message.delete()
         }
      })
    }
  }
}
