module.exports = {
  config: {
    name: 'ready'
  },
  exec: async (client) => {
    client.guilds.cache.forEach(async guild_cache => {
      let guild = await client.database.guilds.findOne({guild_id: guild_cache.id})
      if (guild == null) {
        guild = await client.database.guilds.findOneAndUpdate({guild_id: guild_cache.id}, {
            $setOnInsert: {
                guild_id: guild_cache.id,
                guild_name: guild_cache.name,
                role_charts: {},
                role_chart_ids: [],
                total_message_count: 0
            }
        },
        {
            upsert: true,
            returnOriginal: false
        })
        guild = guild.value
      }
      if (guild.role_chart_ids.length > 0) {
        for (let index = 0; index < guild.role_chart_ids.length; index++) {
          let channels = guild_cache.channels.cache.filter(channel => channel.type == 'text')
          channels.forEach(async channel => {
            await channel.messages.fetch(guild.role_chart_ids[index])
          })
        }
      }
    })

    console.log(`Client ready at ${client.readyAt}`)
  }
}
