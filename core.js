const discord = require('discord.js')
const client = new discord.Client()
const mongo = require('mongodb')
const mongoClient = new mongo.MongoClient('mongodb://localhost:27017/', {useUnifiedTopology: true, retryWrites: true})

const { readdir } = require('fs').promises

const config = require('./config.json')

const init = async () => {
    console.log('Initializing client... \n')
    var events = await readdir('./events/').catch(_ => console.log('Could not find directory'))
    
    if (events && events.length > 0) {

        events = events.filter(event => !event.search(/\w+(?=.js)/))
        var events_cache = events.slice()

        for(var cursor = 0; cursor < events.length; cursor++) {
            events_cache[cursor] = events_cache[cursor].split('.')[0]
            events[cursor] = require('./events/' + events[cursor])

            client.on(events_cache[cursor], events[cursor].bind(null, {client: client}))
        }

        switch(events.length) {
            case 1:
                console.log('Loaded [1] event\n', events_cache, '\n')
                break;
            default:
                console.log(`Loaded [${events.length}] events\n`, events_cache, '\n')
                break;
        }
    }

}
init().then(_ => {
    client.login(config.bot_token)
})