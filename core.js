const discord = require('discord.js')
const client = new discord.Client()

const config = require('./config.json')

const globals = require('./globals.js')

const { readdir } = require('fs').promises
globals.readdir = readdir

const init = async () => {

    console.log('Initializing client... ')
    var events = await readdir('./events/').catch(_ => console.log('Could not find directory'))
    
    if (events && events.length > 0) {

        events = events.filter(event => !event.search(/\w+(?=.js)/))
        let events_cache = []

        events.forEach(function(event, index) {
            events_cache.push(event.split('.')[0])
            this[index] = require(`./events/${event}`)
        }, events)

        switch (events.length) {
            case 1:
                console.log('Loaded [1] event\n', events_cache)
                break;
            default:
                console.log(`Loaded [${events.length}] events\n`, events_cache)
                break;
        }

        var commands = await readdir('./commands/').catch(_ => console.log('Could not find directory'))

        if (commands && commands.length > 0) {

            commands = commands.filter(command => !command.search(/\w+(?=.js)/))
            let commands_cache = []

            commands.forEach(function(command, index) {
                commands_cache.push(command.split('.')[0])
                this[index] = require(`./commands/${command}`)
            }, commands)

            switch (commands.length) {
                case 1:
                    console.log('Loaded [1] command\n', commands_cache)
                    break;
                default:
                    console.log(`Loaded [${events.length}] commands\n`, commands_cache)
                    break;
            }
            const mongo = await new require('mongodb').MongoClient
            const connection = await mongo.connect(require('./config').mongo_token, {useNewUrlParser: true})
            const database = connection.db('discord')

            database.users = database.collection('users'); database.guilds = database.collection('guilds'); client.database = database;
            client.events = {real: events, cached: events_cache}; client.commands = {real: commands, cached: commands_cache}; client.globals = globals;
            events.forEach(function(event, index) {
                client.on(events_cache[index], event.bind(null, client))
            }, events)

            client.login(config.bot_token)
        }
    }

}
init()