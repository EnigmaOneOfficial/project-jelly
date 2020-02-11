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
        let command_index = client.commands.findIndex(command => (command.config.name == other.args[0] || command.config.aliases.includes(other.args[0])))
        let events_index = client.events.findIndex(event => (event.config.name == other.args[0]))

        if (command_index != -1) {
          let command_name = client.commands[command_index].config.name
          delete require.cache[require.resolve(`../commands/${command_name}.js`)]
          client.commands[command_index] = require(`../commands/${command_name}.js`)
          console.log(`Reloading command file [ ${command_name} ]`)
        } else if (events_index != -1) {
          let event_name = client.events[events_index].config.name
          delete require.cache[require.resolve(`../events/${event_name}.js`)]
          client.events[events_index] = require(`../events/${event_name}.js`)
          console.log(`Reloading event file [ ${event_name} ]`)
        } else {
          let commands = await client.globals.readdir('./commands/')
          let events = await client.globals.readdir('./events/')

          if (commands.includes(other.args[0] + '.js')) {
            let name = other.args[0]
            client.commands.push(require(`../commands/${name}.js`))
            console.log(`Loading command file [ ${name} ]`)
          } else if (events.includes(other.args[0] + '.js')) {
            let name = other.args[0]
            client.events.push(require(`../events/${name}.js`))
            console.log(`Loading event file [ ${name} ]`)
          } else {
            console.log('Failed to locate file')
          }
        }

    }
}
