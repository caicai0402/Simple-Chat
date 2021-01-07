import './App.css'
import React, { useEffect, useRef, useState } from 'react'
//import useChat from './useChat'
import { Button, Input, message, Tag } from 'antd'

import { useQuery, useMutation } from '@apollo/react-hooks'
import {
  QUERY,
  CREATE_MUTATION,
  SUBSCRIPTION
} from './graphql'

const App = () => {
  const { loading, error, data, subscribeToMore } = useQuery(QUERY)
  const[formName, setFormName] = useState('')
  const[formBody, setFormBody] = useState('')
  const[formMyname, setFormMyname] = useState('')
  const[messages, setMessages] = useState([])

  const[start, setStart] = useState(false)
  
  const [addMessage] = useMutation(CREATE_MUTATION)
  
  useEffect(() => {
    if(start){
    subscribeToMore({
      document: SUBSCRIPTION,
      variables: {
        myname: formMyname
      },
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev
        const newMessage = subscriptionData.data.data
        setMessages([newMessage, ...prev.data])

        return {
          ...prev,
          message: [newMessage, ...prev.data]
        }
      }
    })
  }}, [subscribeToMore, start])

  const handleFormSubmit = () => {
      if (!formName || !formBody || !formMyname) return

      addMessage({
        variables: {
          myname: formMyname,
          name: formName,
          body: formBody
        }
      })
      setFormMyname('')
      setFormName('')
      setFormBody('')
    }
  //const { status, opened, messages, sendMessage, clearMessages } = useChat()
  //const [message, setMessage] = useState([])

  const bodyRef = useRef(null)

  const displayStatus = (s) => {
    if (s.msg) {
      const { type, msg } = s
      const content = {
        content: msg,
        duration: 0.5
      }

      switch (type) {
        case 'success':
          message.success(content)
          break
        case 'info':
          message.info(content)
          break
        case 'danger':
        default:
          message.error(content)
          break
      }
    }
  }


  return(start?(
    <div className="App">
      <div className="App-title">
        <h1>Simple Chat</h1>
        <Button type="primary" danger >
          Clear
        </Button>
      </div>
      <div className="App-messages">
        {loading? (
          <p style={{ color: '#ccc' }}>
            loading...
          </p>
        ) : (
          messages.map(({myname, name, body }, i) => (
            <p className="App-message" key={i}>
              <Tag color="blue">{name}</Tag> {body}
            </p>
          ))
        )}
      </div>
      <Input
        placeholder="Username"
        value={formName}
        onChange={(e) => setFormName(e.target.value)}
        style={{ marginBottom: 10 }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            bodyRef.current.focus()
          }
        }}
      ></Input>
      <Input.Search
        rows={4}
        value={formBody}
        ref={bodyRef}
        enterButton="Send"
        onChange={(e) => setFormBody(e.target.value)}
        placeholder="Type a message here..."
        onSearch={(msg) => {
          if (!msg || !formName) {
            displayStatus({
              type: 'error',
              msg: 'Please enter a username and a message body.'
            })
            return
          }
          handleFormSubmit()
          setFormBody('')
        }}
      ></Input.Search>
    </div>
  ):(
    <div className="App">
      <input placeholder="enter your name" onChange = {(e) => setFormMyname(e.target.value)}/>
      <button onClick={() => {
        console.log(messages)
        setStart(true)
      }} disabled={!formMyname}>confirm</button>
    </div>
    )
  )
}

export default App
