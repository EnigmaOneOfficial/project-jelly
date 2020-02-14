module.exports = {
  config: {
    name: 'messageReactionRemove',
    aliases: ['mrr']
  },
  exec: async (client, reaction, msg) => {
    console.log(reaction, msg)
  }
}
