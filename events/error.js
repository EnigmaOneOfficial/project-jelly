module.exports = {
  config: {
    name: 'error',
    aliases: []
  },
  exec: async (client, err) => {
    console.log('Client has errored')
  }
}
