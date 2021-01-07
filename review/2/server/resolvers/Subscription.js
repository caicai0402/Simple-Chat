const Subscription = {
    messages: {
        subscribe(parent, args, {DBMessage, pubsub}, info) {
            return pubsub.asyncIterator(`${args.myname} message`)
        }
    }
}

export { Subscription as default } 
