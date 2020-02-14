module.exports = {
  config: {
    name: 'messageReactionRemove'
  },
  exec: async (client, reaction, msg) => {
    console.log(reaction, msg)
  }
}
