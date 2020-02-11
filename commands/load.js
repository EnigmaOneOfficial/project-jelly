module.exports = {
    config: {
        name: 'load',
        description: 'Loads or reloads a file into cache',
        aliases: ['reload'],
        availability: ['text', 'dm'],
        auth_level: 9,
        permitted: []
    },
    exec: async (client, message, other) => {
        let module_type;
        await client.globals.readdir('./events/').then(events => {
          if (events.includes(other.args[0] + '.js')) {
            module_type = 'events'
          }
        })
        await client.globals.readdir('./commands/').then(commands => {
          if (commands.includes(other.args[0] + '.js')) {
            module_type = 'commands'
          }
        })
        if (module_type) {
          let index = client[module_type].findIndex(cached_module => cached_module.config.name == other.args[0])
          if (index != -1) {
            delete require.cache[require.resolve(`../${module_type}/${other.args[0]}.js`)]
            client[module_type][index] = require(`../${module_type}/${other.args[0]}.js`)
          } else {
            client[module_type].push(require(`../${module_type}/${other.args[0]}.js`))
          }
        }
    }
}
