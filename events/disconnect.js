module.exports = {
  config: {
    name: 'disconnect',
    aliases: ['dc']
  },
  exec: async (client) => {
    console.log('Client has disconnected')
  }
}
