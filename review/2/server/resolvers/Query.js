const Query = {
    async messages(parent, args, { DBMessage }, info) {
        if (args.myname) {
            //return all messages
            var ret
            await DBMessage.find({}, (err, messages) => {
                if (err) {
                    console.error(err)
                } 
                else {
                    ret = messages
                }
            })
            return  ret.filter(content => (content.name == args.myname || content.myname == args.myname))
            
        }
    }
}

export {Query as default}
