const discord = require('discord.js')
const discordClient = new discord.Client()
const mongo = require('mongodb')
const mongoClient = new mongo.MongoClient('mongodb://localhost:27017/', {useUnifiedTopology: true, retryWrites: true})

const { promisify } = require('util')
const readdir = promisify(require('fs').readdir)

const init = async () => {
    var events = await readdir('./events/').catch(_ => console.log('Could not find directory'))
    
    if (events && events.length > 0) {
        let events_cache = []
        for(var cursor = 0; cursor < events.length; cursor++) {
            events_cache.push(events[cursor])
            events[cursor] = require('./events/' + events[cursor])
        }
        switch(events.length) {
            case 1:
                console.log('Loaded [1] event\n', events_cache)
                break;
            default:
                console.log(`Loaded [${events.length}] events\n`, events_cache)
                break;
        }
    }

    

}
init().then(_ => {
    // init function succeeded
})