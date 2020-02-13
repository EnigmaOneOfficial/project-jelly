const discord = require('discord.js')
const client = new discord.Client()

const config = require('./config.json')

const globals = require('./globals.js')

globals.promisify = globals.util.promisify
globals.readdir = globals.promisify(globals.fs.readdir)
globals.sleep = globals.promisify(setTimeout)

const init = async () => {
    const readdir = globals.readdir

    globals.git = new globals.octokit({
      auth: config.git_token,
      userAgent: 'project-jelly'
    })




    console.log('Initializing client... ')
    client.events = await readdir('./events/').catch(_ => console.log('Could not find directory'))

    if (client.events && client.events.length > 0) {

        client.events = client.events.filter(event => !event.search(/\w+(?=.js)/))
        let events_cache = []

        client.events.forEach(function(event, index) {
            events_cache.push(event.split('.')[0])
            this[index] = require(`./events/${event}`)
        }, client.events)

        switch (client.events.length) {
            case 1:
                console.log('Loaded [1] event\n', events_cache)
                break;
            default:
                console.log(`Loaded [${client.events.length}] events\n`, events_cache)
                break;
        }

        client.commands = await readdir('./commands/').catch(_ => console.log('Could not find directory'))

        if (client.commands && client.commands.length > 0) {

            client.commands = client.commands.filter(command => !command.search(/\w+(?=.js)/))
            let commands_cache = []

            client.commands.forEach(function(command, index) {
                commands_cache.push(command.split('.')[0])
                this[index] = require(`./commands/${command}`)
            }, client.commands)

            switch (client.commands.length) {
                case 1:
                    console.log('Loaded [1] command\n', commands_cache)
                    break;
                default:
                    console.log(`Loaded [${client.commands.length}] commands\n`, commands_cache)
                    break;
            }

            const mongo = await new require('mongodb').MongoClient
            const connection = await mongo.connect(config.mongo_token, {useNewUrlParser: true, useUnifiedTopology: true})
            const database = connection.db('discord')

            database.users = database.collection('users'); database.guilds = database.collection('guilds'); client.database = database;
            client.globals = globals;

            client.events.forEach(function(event, index) {
                client.on(events_cache[index], (...args) => { args.unshift(client); client.events[index].exec.apply(null, args) })
            }, client.events)

            client.login(config.bot_token)
        }
    }

}
init()
