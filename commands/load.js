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
        const curl = client.globals.curl

        let commands = await git.repos.getContents({
          owner: 'EnigmaOneOfficial',
          repo: 'project-jelly',
          path: `commands/`
        })
        let command_index = commands.data.findIndex(index => (index.name.toLowerCase() == `${target}.js`) && (index.type == 'file'))
        let command_found = client.commands.findIndex(index => index.config.name.toLowerCase() == `${target}`)
        let events = await git.repos.getContents({
          owner: 'EnigmaOneOfficial',
          repo: 'project-jelly',
          path: `events/`
        })
        let event_index = events.data.findIndex(index => (index.name.toLowerCase() == `${target}.js`) && (index.type == 'file'))
        let event_found = client.events.findIndex(index => index.config.name.toLowerCase() == `${target}`)

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
            console.log('Reloaded globals')
          })

        } else if (command_index != -1) {
          let path = commands.data[command_index].name
          await load_file(`commands/${path}`, async () => {
            if (command_found != -1) {
              delete require.cache[require.resolve(`./${path}`)]
              client.commands[command_found] = require(`./${path}`)
            } else {
              client.commands.push(require(`./${path}`))
            }
            message.channel.send(`Reloaded command file \`\`${path.slice(0, path.length - 3)}\`\``)
            console.log(`Reloaded command file ${path.slice(0, path.length - 3)}`)
          })

        } else if (event_index != -1) {
          let path = events.data[event_index].name
          await load_file(`events/${path}`, async () => {
            if (event_found != -1) {
              delete require.cache[require.resolve(`../events/${path}`)]
              client.events[event_found] = require(`../events/${path}`)
            } else {
              let event_module = require(`../events/${path}`)
              client.events.push(event_module)
              client.on(path.slice(0, path.length - 3), async (...args) => {args.unshift(client); args.push(event_module.config); await client.events[client.events.length - 1].exec.apply(null, args) })
            }
            message.channel.send(`Reloaded event file \`\`${path.slice(0, path.length - 3)}\`\``)
            console.log(`Reloaded event file ${path.slice(0, path.length - 3)}`)
          })
        } else {
            message.channel.send(`Failed to locate file \`\`${command.args[0]}\`\``)
        }
    }
}
