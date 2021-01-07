//import { GraphQLServer } from 'graphql-yoga'
// ... or using `require()`
require('dotenv-defaults').config()
const { GraphQLServer, PubSub } = require('graphql-yoga')
const mongoose = require('mongoose')
const Message = require('./models/message')

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

const db = mongoose.connection
const pubsub = new PubSub()
db.on('error', (error) => {
  console.error(error)
})

const typeDefs = `
  type Query {
    messages: [Message!]!
  }
  type Mutation {
    sendMessage(username: String!, targetname: String!, body: String!): Boolean!
  }
  type Subscription {
    messageSend(username: String!): Message!
  }
  type Message {
    username: String!
    targetname: String!
    body: String!
  }
`

const resolvers = {
  Query: {
    messages: async () => {
      const Messages = await Message.find({});
      console.log(Messages);
      return Messages;
    }
  },

  Mutation: {
    sendMessage: async (parent, {username, targetname, body}) => {
      const newMessage = new Message({
          username : username,
          targetname : targetname,
          body : body
      })
      try {
        await newMessage.save();
      } catch(e) {
        throw new Error('Cannot save message');
      }
      pubsub.publish(`messageSend ${targetname}`, {messageSend: newMessage});
      return true;
    }
  },
  
  Subscription: {
    messageSend: {
      subscribe: (parent, { username }, {db, pubsub}) => pubsub.asyncIterator(`messageSend ${username}`)
    }
  }
}
const context = {
  db,
  pubsub
}

const server = new GraphQLServer({ typeDefs, resolvers, context })
server.start(() => console.log('Server is running on localhost:4000'))