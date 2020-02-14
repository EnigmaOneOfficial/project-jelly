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
        command.args[0] = command.args[0].toLowerCase()
        let command_index = client.commands.findIndex(command_cache => (command_cache.config.name.toLowerCase() == command.args[0] || command_cache.config.aliases.includes(command.args[0])))
        let events_index = client.events.findIndex(event_cache => (event_cache.config.name.toLowerCase() == command.args[0] || event_cache.config.aliases.includes(command.args[0])))


        const git = client.globals.git
        const writeFile = client.globals.writeFile
        const readdir = client.globals.readdir
        const curl = client.globals.curl

        let commands_search = await git.repos.getContents({
          owner: 'EnigmaOneOfficial',
          repo: 'project-jelly',
          path: `commands/`
        })
        let events_search = await git.repos.getContents({
          owner: 'EnigmaOneOfficial',
          repo: 'project-jelly',
          path: `events/`
        })

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

          }

        } else if (events_index != -1) {

          let event_name = client.events[events_index].config.name
          delete require.cache[require.resolve(`../events/${event_name}.js`)]
          let download = await git.repos.getContents({
            owner: 'EnigmaOneOfficial',
            repo: 'project-jelly',
            path: `events/${event_name}.js`
          })

          curl.request({url: download.data.download_url}, async (err, content) => {
            if (err) return
            await writeFile(`./events/${event_name}.js`, content).then(_ => {
              client.events[events_index] = require(`../events/${event_name}.js`)
              message.channel.send(`Reloaded event file \`\`${event_name}\`\``)
            })
          })

        } else if (command.args[0] == 'globals') {

          delete require.cache[require.resolve('../globals.js')]
          let download = await git.repos.getContents({
            owner: 'EnigmaOneOfficial',
            repo: 'project-jelly',
            path: `globals.js`
          })


          curl.request({url: download.data.download_url}, async (err, content) => {
            if (err) return
            await writeFile(`./globals.js`, content).then(async (_) => {
              client.globals = require('../globals.js')
              await client.globals.load()
              message.channel.send('Reloaded \`\`globals\`\`')
            })
          })

        } else if (commands_search && commands_search.data && commands_search.data.findIndex(index => (index.type == 'file' && index.name.toLowerCase() == `${command.args[0]}.js`)) != -1) {

            let target = commands_search.data.find(index => (index.type == 'file' && index.name.toLowerCase() == `${command.args[0]}.js`))
            curl.request({url: target.download_url}, async (err, content) => {
              if (err) return
              await writeFile(`./commands/${target.name}`, content).then(_ => {
                client.commands.push(require(`../commands/${target.name}`))
                message.channel.send(`Reloaded event file \`\`${target.name}\`\``)
              })
            })
        } else if (events_search && events_search.data && events_search.data.findIndex(index => (index.type == 'file' && index.name.toLowerCase() == `${command.args[0]}.js`)) != -1) {

            let target = events_search.data.find(index => (index.type == 'file' && index.name.toLowerCase() == `${command.args[0]}.js`))
            curl.request({url: target.download_url}, async (err, content) => {
              if (err) return
              await writeFile(`./events/${target.name}`, content).then(_ => {
                client.events.push(require(`../events/${target.name}`))
                message.channel.send(`Reloaded event file \`\`${target.name}\`\``)
              })
            })
        } else {
            message.channel.send(`Failed to locate file \`\`${command.args[0]}\`\``)
        }
    }
}
