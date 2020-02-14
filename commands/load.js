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
        let commands_index = commands.data.findIndex(index => (index.name.toLowerCase() == target) && (index.type == 'file'))
        let commnd_found = client.commands.findIndex(index => index.config.name.toLowerCase() == target)
        let events = await git.repos.getContents({
          owner: 'EnigmaOneOfficial',
          repo: 'project-jelly',
          path: `events/`
        })
        let events_index = events.data.findIndex(index => (index.name.toLowerCase() == target) && (index.type == 'file'))
        let event_found = client.commands.findIndex(index => index.config.name.toLowerCase() == target)

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

        } else if (commands_index != -1) {

          await load_file(`commands/${target}.js`, async () => {
            if (command_found != -1) {
              delete require.cache[require.resolve(`./${target}.js`)]
              client.commands.splice(command_found, 1, require(`./${target}.js`))
            } else {
              client.commands.push(require(`./${target}`))
            }
            message.channel.send(`Reloaded command file \`\`${target}\`\``)
          })

        } else if (events_index != -1) {

          await load_file(`events/${target}.js`, async () => {
            if (event_found != -1) {
              delete require.cache[require.resolve(`../events/${target}.js`)]
              client.events.splice(event_found, 1, require(`./${target}.js`))
            } else {
              client.commands.push(require(`./${target}`))
            }
            message.channel.send(`Reloaded event file \`\`${target}\`\``)
          })
        } else {
            message.channel.send(`Failed to locate file \`\`${command.args[0]}\`\``)
        }
    }
}
