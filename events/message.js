module.exports = async (client, message) => {
    if (!message.author.bot) {
        
        if (message.channel.type == 'text') {
            console.log(message.content)
        }

    }
}