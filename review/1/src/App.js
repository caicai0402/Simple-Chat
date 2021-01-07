import './App.css'
import React, { useRef, useState } from 'react'
import { Button, Input, Tag } from 'antd'
import { useQuery, useMutation , gql } from '@apollo/client'
import { MESSAGES_QUERY } from './graphql/query'

function App() {

  const MESSAGES_SUBSCRIPTION = gql`
    subscription messageSend($username: String!){
        messageSend(username: $username) {
            username
            targetname
            body
        }
    }
  `
  const SEND_MESSAGE_MUTATION = gql`
  mutation sendMessage($username: String!, $targetname: String!, $body: String!) {
      sendMessage(username: $username, targetname: $targetname, body: $body)
  }
  `
  
  const [ sendMessage ] = useMutation(SEND_MESSAGE_MUTATION)
  const [targetname, setTargetname] = useState('')
  const [username, setUsername] = useState('')
  const {subscribeToMore, ...result} = useQuery(MESSAGES_QUERY, {variables: {username: username}})

  const [body, setBody] = useState('')

  const bodyRef = useRef(null)

  if (username === "") {
    return (<Input.Search
      rows={4}
      value={body}
      ref={bodyRef}
      enterButton="Login"
      onChange={(e) => setBody(e.target.value)}
      placeholder="Type your username here..."
      onSearch={(finalusername) => {
        subscribeToMore({
          document: MESSAGES_SUBSCRIPTION,
          variables: {username : finalusername},
          updateQuery: (prev, { subscriptionData }) => {
            if (!subscriptionData.data) return prev;
            const newMessageSend = subscriptionData.data.messageSend;
            return Object.assign({}, prev, {
              messages: [...prev.messages, newMessageSend]
            })

          }
        })
        setUsername(finalusername)
        setBody('')
      }}
    ></Input.Search>)
  }
  
  else {
    return (
      <div className="App">
        <div className="App-title">
          <h1>Simple Chat. Welcome, {username}</h1>
          <Button type="primary">
            Clear
          </Button>
        </div>
        <div className="App-messages">
        {result.data.messages.length === 0 ? (
          <p style={{ color: '#ccc' }}>
            {'No messages...'}
          </p>
        ) : (
          result.data.messages.filter(message => message.targetname === username).map(({ username, body }, i) => (
            <p className="App-message" key={i}>
              <Tag color="blue">{username}</Tag>
              {body}
            </p>
          )))
        }
        </div>
        <Input
          placeholder="Targetname"
          value={targetname}
          onChange={(e) => setTargetname(e.target.value)}
          style={{ marginBottom: 10 }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              bodyRef.current.focus()
            }
          }}
        ></Input>
        <Input.Search
          rows={4}
          value={body}
          ref={bodyRef}
          enterButton="Send"
          onChange={(e) => setBody(e.target.value)}
          placeholder="Type a message here..."
          onSearch={(msg) => {

            sendMessage({variables : { username: username,targetname: targetname, body: msg }})
            setBody('')
          }}
        ></Input.Search>
      </div>
  )}
}

export default App;
