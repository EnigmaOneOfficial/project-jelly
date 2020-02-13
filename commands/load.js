module.exports = {
    config: {
        name: 'load',
        description: 'Loads or reloads a file into cache',
        aliases: ['reload'],
        availability: ['text', 'dm'],
        auth_level: 9,
        permitted: []
    },
    exec: async (client, message, command) => {
        let command_index = client.commands.findIndex(command_cache => (command_cache.config.name == command.args[0] || command_cache.config.aliases.includes(command.args[0])))
        let events_index = client.events.findIndex(event_cache => (event_cache.config.name == command.args[0] || event_cache.config.aliases.includes(command.args[0])))

        const git = client.globals.git
        const writeFile = client.globals.writeFile
        const curl = client.globals.curl

        if (command_index != -1) {

          let command_name = client.commands[command_index].config.name
          delete require.cache[require.resolve(`../commands/${command_name}.js`)]

          let download = await git.repos.getContents({
            owner: 'EnigmaOneOfficial',
            repo: 'project-jelly',
            path: `commands/${command_name}.js`
          })
          if (download && download.data)  {

          curl.request({url: download.data.download_url}, async (err, content) => {
              if (err) return
              await writeFile(`./commands/${command_name}.js`, content).then(_ => {
                client.commands[command_index] = require(`../commands/${command_name}.js`)
                message.channel.send(`Reloaded command file \`\`${command_name}\`\``)
              })
            })

          } else {

            message.channel.send('Could not find file on Github, make sure to push commits')

          }

        } else if (events_index != -1) {

          let event_name = client.events[events_index].config.name
          delete require.cache[require.resolve(`../events/${event_name}.js`)]
          client.events[events_index] = require(`../events/${event_name}.js`)
          message.channel.send(`Reloaded event file \`\`${event_name}\`\``)

        } else {

          let commands = await client.globals.readdir('./commands/')
          let events = await client.globals.readdir('./events/')

          if (commands.includes(command.args[0] + '.js')) {

            let name = command.args[0]
            client.commands.push(require(`../commands/${name}.js`))
            message.channel.send(`Loaded command file \`\`${name}\`\``)

          } else if (events.includes(command.args[0] + '.js')) {

            let name = command.args[0]
            client.events.push(require(`../events/${name}.js`))
            message.channel.send(`Loaded event file \`\`${name}\`\``)

          } else if (command.args[0] == 'globals') {

            delete require.cache[require.resolve('../globals.js')]
            client.globals = require('../globals.js')
            client.globals.promisify = client.globals.util.promisify
            client.globals.readdir = client.globals.promisify(client.globals.fs.readdir)
            client.globals.writeFile = client.globals.promisify(client.globals.fs.writeFile)
            client.globals.sleep = client.globals.promisify(setTimeout)
            client.globals.git = new client.globals.octokit({
              auth: config.git_token,
              userAgent: 'project-jelly'
            })
            message.channel.send('Reloaded \`\`globals\`\`')

          } else {

            message.channel.send(`Failed to locate file \`\`${command.args[0]}\`\``)

          }
        }

    }
}
