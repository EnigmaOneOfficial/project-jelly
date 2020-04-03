module.exports = {
  config: {
    name: 'guildCreate'
  },
  exec: async (client, guild) => {
    await client.database.guilds.findOneAndUpdate({guild_id: guild.id}, {
        $setOnInsert: {
            guild_id: guild.id,
            guild_name: guild.name,
            role_charts: {},
            role_chart_ids: [],
            total_message_count: 0
        }
    },
    {
        upsert: true,
        returnOriginal: false
    })
  }
}
