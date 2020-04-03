module.exports = {
    config: {
        name: 'rolechart',
        description: 'Create a chart for role reactions',
        aliases: [],
        availability: ['text'],
        auth_level: 3,
        permitted: []
    },
    exec: async (client, message, command) => {
      let roles = message.mentions.roles
      if (roles.array().length > 20) return
      let embed = {embed: {
        fields: [],
        footer: {
          text: ''
        }
      }}

      let index = 0
      let role_ids = []
      roles.forEach(role => {
        role_ids.push(role.id)
        switch(index) {
          case 0:
            embed.embed.fields.push({name: `**${role.name} / ${role.members.size} members**`, value: '**React to select an emoji for this role**', inline: false})
            break;
          default:
            embed.embed.fields.push({name: `**${role.name} / ${role.members.size} members**`, value: '...', inline: false})
            break;
        }
        index++
      })

      message.channel.send(embed).then(async message => {
        embed.embed.footer.text = 'id: ' + message.id
        await client.database.guilds.findOneAndUpdate({guild_id: message.guild.id}, {
            $set: {
              [`role_charts.${message.id}`]: {
                index: 0,
                length: index,
                creator: command.called_by,
                embed: embed,
                reactions: [],
                roles: role_ids
              }
            },
            $push: {
              role_chart_ids: message.id
            }
          })
          message.edit(embed)
        })

    }
}
