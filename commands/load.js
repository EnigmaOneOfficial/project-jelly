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
        const readdir = client.globals.readdir
        const curl = client.globals.curl

        if (command_index != -1) {

          let command_name = client.commands[command_index].config.name
          delete require.cache[require.resolve(`../commands/${command_name}.js`)]

          let download = await git.repos.getContents({
            owner: 'EnigmaOneOfficial',
            repo: 'project-jelly',
            path: `commands/${command_name}.js`
          }).catch(err => message.channel.send(`Failed to locate file \`\`${command.args[0]}\`\``))
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
          }).catch(err => message.channel.send(`Failed to locate file \`\`${command.args[0]}\`\``))
          if (download && download.data)  {

            curl.request({url: download.data.download_url}, async (err, content) => {
              if (err) return
              await writeFile(`./events/${event_name}.js`, content).then(_ => {
                client.commands[events_index] = require(`../event/${event_name}.js`)
                message.channel.send(`Reloaded event file \`\`${event_name}\`\``)
              })
            })

          }

        } else if (command.args[0] == 'globals') {

          delete require.cache[require.resolve('../globals.js')]
          let download = await git.repos.getContents({
            owner: 'EnigmaOneOfficial',
            repo: 'project-jelly',
            path: `globals.js`
          }).catch(err => message.channel.send(`Failed to locate file \`\`${command.args[0]}\`\``))

          if (download && download.data)  {

            curl.request({url: download.data.download_url}, async (err, content) => {
              if (err) return
              await writeFile(`./globals.js`, content).then(async (_) => {
                client.globals = require('../globals.js')
                await client.globals.load()
                message.channel.send('Reloaded \`\`globals\`\`')
              })
            })
          }

        } else {

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
          if (commands_search && commands_search.data) {
            commands_search = commands_search.data
            let commands_search_index = commands_search.findIndex(git_command => git_command.name == command.args[0])

            if (commands_search_index != -1) {

              let download = await git.repos.getContents({
                owner: 'EnigmaOneOfficial',
                repo: 'project-jelly',
                path: `commands/${command.args[0]}.js`
              }).catch(err => message.channel.send(`Failed to locate file \`\`${command.args[0]}\`\``))

                curl.request({url: download.data.download_url}, async (err, content) => {
                  if (err) return
                  await writeFile(`./commands/${command.args[0]}.js`, content).then(_ => {
                    client.commands.push(require(`../commands/${command.args[0]}.js`))
                    message.channel.send(`Reloaded event file \`\`${command.args[0]}\`\``)
                  }
                )
              })
            }
          } else if (events_search && events_search.data) {
            events_search = events_search.data
            let events_search_index = events_search.data.findIndex(git_event => git_event.name == command.args[0])

            if (events_search_index != -1) {

              let download = await git.repos.getContents({
                owner: 'EnigmaOneOfficial',
                repo: 'project-jelly',
                path: `events/${command.args[0]}.js`
              }).catch(err => message.channel.send(`Failed to locate file \`\`${command.args[0]}\`\``))

              if (download && download.data) {
                curl.request({url: download.data.download_url}, async (err, content) => {
                  if (err) return
                  await writeFile(`./events/${command.args[0]}.js`, content).then(_ => {
                    client.commands.push(require(`../event/${command.args[0]}.js`))
                    message.channel.send(`Reloaded event file \`\`${event_name}\`\``)
                  })
                })
              }

            }
          } else {

              message.channel.send(`Failed to locate file \`\`${command.args[0]}\`\``)

          }

        }
      }

}
