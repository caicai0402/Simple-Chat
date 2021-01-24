import { GraphQLServer, PubSub } from 'graphql-yoga'
import Query from './server/resolvers/Query'
import Mutation from './server/resolvers/Mutation'
import Subscription from './server/resolvers/Subscription'
require('dotenv-defaults').config()

const mongoose = require('mongoose')
if (!process.env.MONGO_URL) {
  console.error('Missing MONGO_URL!!!')
  process.exit(1)
}
mongoose.connect(
  process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
const db = mongoose.connection
db.on('error', (error) => {
  console.error(error)
})
db.once('open', () => {
  console.log('MongoDB connected!')})

const express = require('express')
const path = require('path')
const app = express();
app.use(express.static(path.join(__dirname, 'build')));
const apiRoute = require('./src/route/api');
app.use('/api', apiRoute);
app.get('/ping', function (req, res) {
  return res.send('pong');
});
app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});


const pubsub = new PubSub()
const Graphql = new GraphQLServer({
  typeDefs: './server/schema.graphql',
  resolvers: {
    Query,
    Mutation,
    Subscription
  },
  context: {
    //db
    pubsub
  }
})

const GRAPHQL_PORT = process.env.port || 4000
Graphql.start(GRAPHQL_PORT, () => {
  console.log(`The grapgql server is up on http://localhost:${GRAPHQL_PORT}!`)
})


const port = process.env.PORT || 80;
app.listen(port);
console.log("Server Ready!")

