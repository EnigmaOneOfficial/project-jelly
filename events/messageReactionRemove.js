module.exports = {
  config: {
    name: 'messageReactionAdd',
    aliases: ['mra']
  },
  exec: async (client, reaction, msg) => {
    console.log(reaction, msg)
  }
}
