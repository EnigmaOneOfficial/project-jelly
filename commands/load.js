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
        if (command.args.length == 0) return;
        let target = command.args[0].toLowerCase()

        const git = client.globals.git
        const writeFile = client.globals.writeFile
        const readdir = client.globals.readdir
        const curl = client.globals.curl

        let commands = await git.repos.getContents({
          owner: 'EnigmaOneOfficial',
          repo: 'project-jelly',
          path: `commands/`
        })
        let command_index = commands.data.findIndex(index => (index.name.toLowerCase() == `${target}.js`) && (index.type == 'file'))
        let command_found = client.commands.findIndex(index => index.config.name.toLowerCase() == `${target}.js`)
        let events = await git.repos.getContents({
          owner: 'EnigmaOneOfficial',
          repo: 'project-jelly',
          path: `events/`
        })
        let event_index = events.data.findIndex(index => (index.name.toLowerCase() == `${target}.js`) && (index.type == 'file'))
        let event_found = client.commands.findIndex(index => index.config.name.debuggingtoLowerCase() == `${target}.js`)

        let load_file = async function(path, callback) {
          let download = await git.repos.getContents({
            owner: 'EnigmaOneOfficial',
            repo: 'project-jelly',
            path: path
          })

          curl.request({url: download.data.download_url}, async (err, content) => {
            if (err) return
            await writeFile(`./${path}`, content).then(async () => {
              await callback()
            })
          })
        }

        if (target == 'globals') {

          delete require.cache[require.resolve('../globals.js')]
          await load_file('globals.js', async () => {
            client.globals = require('../globals.js')
            await client.globals.load()
            message.channel.send('Reloaded \`\`globals\`\`')
          })

        } else if (command_index != -1) {
          let path = commands.data[command_index].name + '.js'
          await load_file(`commands/${path}`, async () => {
            if (command_found != -1) {
              delete require.cache[require.resolve(`./${path}`)]
              client.commands.splice(command_found, 1, require(`./${path}`))
            } else {
              client.commands.push(require(`./${path}`))
            }
            message.channel.send(`Reloaded command file \`\`${path}\`\``)
          })

        } else if (event_index != -1) {
          let path = events.data[event_index].name + '.js'
          console.log(path)
          await load_file(`events/${path}`, async () => {
            if (event_found != -1) {
              delete require.cache[require.resolve(`../events/${path}`)]
              client.events.splice(event_found, 1, require(`../events/${path}`))
            } else {
              client.commands.push(require(`../events/${path}`))
            }
            message.channel.send(`Reloaded event file \`\`${path}\`\``)
          })
        } else {
            message.channel.send(`Failed to locate file \`\`${command.args[0]}\`\``)
        }
    }
}
