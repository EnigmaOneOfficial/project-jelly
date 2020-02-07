const discord = require('discord.js')
const client = new discord.Client()

const { readdir } = require('fs').promises

const config = require('./config.json')
const mongo = new require('mongodb').MongoClient


const init = async () => {

    console.log('Connecting to database...')
    mongo.connect(config.mongo_token, {useNewUrlParser: true}, async (err, database) => {
        if (err) console.log('Connection status: [ failure ]\n')
        else { 
            console.log('Connection status: [ success ]\n')

            console.log('Initializing client... \n')
            var events = await readdir('./events/').catch(_ => console.log('Could not find directory'))
            
            if (events && events.length > 0) {

                events = events.filter(event => !event.search(/\w+(?=.js)/))
                var events_cache = events.slice()

                for (var cursor = 0; cursor < events.length; cursor++) {
                    events_cache[cursor] = events_cache[cursor].split('.')[0]
                    events[cursor] = require('./events/' + events[cursor])
                }

                var cursor = 0; client.events = events; client.database = database;
                events.forEach(event => {
                    client.on(events_cache[cursor], event.bind(null, client)); cursor++;
                })


                switch (events.length) {
                    case 1:
                        console.log('Loaded [1] event\n', events_cache, '\n')
                        break;
                    default:
                        console.log(`Loaded [${events.length}] events\n`, events_cache, '\n')
                        break;
                }
            }
            client.login(config.bot_token)
        }
    })
}
init()