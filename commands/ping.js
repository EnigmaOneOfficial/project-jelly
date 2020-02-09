module.exports = {
    config: {
        name: 'ping',
        description: 'Test command to ping back',
        aliases: [],

    },
    exec: async (client, message) => {
        let t = Date.now()
        await client.sleep(5000)
        message.channel.send(`Waited ${Date.now() - t}`)
    }
}