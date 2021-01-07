// import React from 'react'
// import ReactDOM from 'react-dom'
// import './index.css'
// import App from './App'
// import reportWebVitals from './reportWebVitals'
// import 'antd/dist/antd.css'

// ReactDOM.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
//   document.getElementById('root')
// )

// // If you want to start measuring performance in your app, pass a function
// // to log results (for example: reportWebVitals(console.log))
// // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals()
import React from 'react'
import ReactDOM from 'react-dom'
import { ApolloClient, InMemoryCache } from 'apollo-boost'
import { ApolloProvider } from '@apollo/client'
import { split } from 'apollo-link'
import { HttpLink } from 'apollo-link-http'
import { WebSocketLink } from 'apollo-link-ws'
import { getMainDefinition } from 'apollo-utilities'
//import 'bootstrap/dist/css/bootstrap.min.css'

import './index.css'
import App from './App'
import * as serviceWorker from './serviceWorker'

// Create an http link:
const httpLink = new HttpLink({
  uri: 'http://localhost:4001/'
})

// Create a WebSocket link:
const wsLink = new WebSocketLink({
  uri: `ws://localhost:4001/`,
  options: { reconnect: true }
})

// using the ability to split links, you can send data to each link
// depending on what kind of operation is being sent
const link = split(
  // split based on operation type
  ({ query }) => {
    const definition = getMainDefinition(query)
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    )
  },
  wsLink,
  httpLink
)

const client = new ApolloClient({
  link,
  cache: new InMemoryCache().restore({})
})

const wrappedApp = (
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
)

ReactDOM.render(wrappedApp, document.getElementById('root'))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
