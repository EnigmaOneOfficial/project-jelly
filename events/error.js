module.exports = {
  config: {
    name: 'error'
  },
  exec: async (client, err) => {
    console.log('Client has errored')
  }
}
