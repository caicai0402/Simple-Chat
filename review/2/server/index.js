/*
import { GraphQLServer } from 'graphql-yoga'
// ... or using `require()`
// const { GraphQLServer } = require('graphql-yoga')

const typeDefs = `
  type Query {
    hello(name: String): String!
  }
`

const resolvers = {
  Query: {
    hello: (_, { name }) => `Hello ${name || 'World'}`,
  },
}

const server = new GraphQLServer({ typeDefs, resolvers })
server.start(() => console.log('Server is running on localhost:4000'))
*/


require('dotenv-defaults').config()
const mongoose = require('mongoose')
const DBMessage = require('./models/message')
if (!process.env.MONGO_URL) {
  console.error('Missing MONGO_URL!!!')
  process.exit(1)
}
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
const db = mongoose.connection

db.on('error', (error) => {
  console.error(error)
})

db.once('open', () => {
  console.log('MongoDB connected!')
})
DBMessage.find({name: "abcTEST"}, (err, messages) => {
    if (err) {  
        return condole.error(err)
    }
    else {
        console.log(messages)
    }
})
import { GraphQLServer, PubSub } from 'graphql-yoga'
import Query from './resolvers/Query'
import Mutation from './resolvers/Mutation'
import Message from './resolvers/Message'
import Subscription from './resolvers/Subscription'
import db2 from './db2'

const pubsub = new PubSub()

const gql_server = new GraphQLServer({
  typeDefs: './server/schema.graphql',
  resolvers: {
    Query,
    Mutation,
    Subscription,
    Message
  },
  context: {
    DBMessage,
    pubsub
  }
})

gql_server.start({port: process.env.port | 4001}, () => {
    console.log(`Server up on port ${process.env.port | 4001}!`)
})

/* previous stuff starts here */
/*
require('dotenv-defaults').config()

const http = require('http')
const express = require('express')
const mongoose = require('mongoose')
const WebSocket = require('ws')

const Message = require('./models/message')

const app = express()
const server = http.createServer(app)
const wss = new WebSocket.Server({ server })

if (!process.env.MONGO_URL) {
  console.error('Missing MONGO_URL!!!')
  process.exit(1)
}

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

const db = mongoose.connection

db.on('error', (error) => {
  console.error(error)
})

db.once('open', () => {
  console.log('MongoDB connected!')

  wss.on('connection', ws => {
    const sendData = (data) => {
      ws.send(JSON.stringify(data))
    }

    const sendStatus = (s) => {
      sendData(['status', s])
    }

    Message.find()
      .limit(100)
      .sort({ _id: 1 })
      .exec((err, res) => {
        if (err) throw err

        // initialize app with existing messages
        console.log(res)
        sendData(['init', res])
      })

    ws.onmessage = (message) => {
      const { data } = message
      console.log(data)
      const [task, payload] = JSON.parse(data)

      switch (task) {
        case 'input': {
          // TODO
          console.log(payload)
          let entry = new Message({
              name: payload.name,
              body: payload.body
          })
          entry.save((err, entry) => {
             if (err) {
                 return console.error(err);
             }
          })
          sendData(['output', [entry]])
          sendStatus({
              type: 'success',
              msg: 'Message sent.'
          })
          break
        }
        case 'clear': {
          Message.deleteMany({}, () => {
            sendData(['cleared'])

            sendStatus({
              type: 'info',
              msg: 'Message cache cleared.'
            })
          })

          break
        }
        default:
          break
      }
    }
  })

  const PORT = process.env.port || 4000

  server.listen(PORT, () => {
    console.log(`Listening on http://localhost:${PORT}`)
  })
})
*/
