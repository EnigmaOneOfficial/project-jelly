module.exports = {
  config: {
    name: 'messageReactionAdd'
  },
  exec: async (client, reaction, msg) => {
    console.log(reaction, msg)
  }
}
