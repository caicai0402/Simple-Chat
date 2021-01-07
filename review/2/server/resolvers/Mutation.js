const Mutation = {
    async createMessage(parent, args, { DBMessage, pubsub }, info) {
        //add new message with args
        //return the new message
        const newMessage = {myname: args.myname, name: args.name, body: args.body}
//        db2.messages.push(newMessage)
        const newDBMessage = new DBMessage(newMessage)
        await newDBMessage.save((err, newDBMessage) => {
            if (err) {
                return console.error(err)
            }
        })
        pubsub.publish(`${newMessage.name} message`, 
        {
            messages: {
                mutation: 'CREATED', 
                data: newMessage
            }
        })
        pubsub.publish(`${newMessage.myname} message`, 
        {
            messages: {
                mutation: 'CREATED', 
                data: newMessage
            }
        })
        return newMessage
    },
    async deleteMessage(parent, args, { DBMessage, pubsub }, info) {
        //delete message with args
        //return the deleted message
/*
        const messageIndex = db2.messages.findIndex(message => (message.name === args.name && message.body === args.body))
        if (messageIndex === -1) {
            throw new Error('message not found')
        }
        else {
            db2.messages.splice(messageIndex, 1)
        }
*/
        const deletedMessage = {myname: args.myname, name: args.name, body: args.body}
        await DBMessage.deleteMany(deletedMessage)
        pubsub.publish(`${deletedMessage.name} message`,
        {
            messages: {
                mutation: 'DELETED',
                data: deletedMessage
            }
        })
        pubsub.publish(`${deletedMessage.myname} message`,
        {
            messages: {
                mutation: 'DELETED',
                data: deletedMessage
            }
        })
        return (deletedMessage)
    }
    
}

export {Mutation as default}
