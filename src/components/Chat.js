import '../App.css'
import React, { useEffect, useRef, useState } from 'react'
import { useQuery, useMutation } from '@apollo/react-hooks'
import { Button, Input, message, Tag } from 'antd'
import {
    USER_NAME_QUERY,
    UPDATE_USER_MUTATION,
    MESSAGES_SHOW_QUERY,
    CREATE_MESSAGE_MUTATION,
    MESSAGES_SUBSCRIPTION,
    DELETE_MESSAGE_MUTATION,
} from '../graphql'
import List from './List'

function Chat({username, password, user_login}){
    const [talk_to, setTalk_to] = useState('')
    const [body, setBody] = useState('')
    const [selectedKey, setSelectedKey] = useState("1")
    const { loading, error, data, subscribeToMore, refetch } = useQuery(MESSAGES_SHOW_QUERY, {variables:{name: username, talk_to: talk_to}}, [talk_to])
    const user_name = useQuery(USER_NAME_QUERY, {variables:{
        name: talk_to
      }}, [username])
    const [updateUser] = useMutation(UPDATE_USER_MUTATION)
    const [addMessage] = useMutation(CREATE_MESSAGE_MUTATION)
    const [clearMessage] = useMutation(DELETE_MESSAGE_MUTATION)
    const bodyRef = useRef(null)

    const displayStatus = (s) => {
        if (s.msg) {
            const { type, msg } = s
            const content = {
                content: msg,
                duration: 2}
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
                break}
        }    
    }
    
    const handleMessageSubmit = async () => {
        if (!talk_to || !body){
            displayStatus({
                type: 'error',
                msg: 'Please enter a username and a message body.'
            })
            return
        }
        if (user_name.loading) return null;
        if (user_name.error) return `Error! ${user_name.error}`;
        if (user_name.data.user_name.length === 0){
            displayStatus({
                type: 'error',
                msg: 'User is not exit.'
            })
            return
        }
        if (user_login.loading) return null;
        if (user_login.error) return `Error! ${user_login.error}`;
        if (user_login.data.user_login[0].friends.indexOf(talk_to) === -1){
            await updateUser({
                variables: {
                    name: username,
                    password: password,
                    friends: user_login.data.user_login[0].friends,
                    update: talk_to}
            })
        }
        await addMessage({
            variables: {
                name: username,
                talk_to: talk_to,
                body: body}
        })
        setBody('')
        }

    const handleMessageClear = async () => {
        if (loading) return null;
        if (error) return `Error! ${error}`;
        if (data.messages_show.length === 0){
            displayStatus({
                type: 'error',
                msg: 'You do not have any message.'
            })
            return
        }
        var times = data.messages_show.length
        for(var i = 0; i < times; i++)
            await clearMessage({variables:{name:username, talk_to:talk_to, body:""}})
        setBody("")
    }    
    
    useEffect(() => {
        subscribeToMore({
            document: MESSAGES_SUBSCRIPTION,
            updateQuery: (prev, { subscriptionData }) => {
                if (!subscriptionData.data) return prev
                    const newMessage = subscriptionData.data
                if(newMessage.message.mutation === "CREATED"){
                    if(newMessage.message.data.name === username || newMessage.message.data.talk_to === username)
                        return {messages_show: [...prev.messages_show, newMessage.message.data]}}
                else if(newMessage.message.mutation === "DELETED")
                    return {messages_show: []}
                }
        })
    }, [subscribeToMore, username])

    useEffect(
        ()=>{
            if(!user_login.loading){
                let index = user_login.data.user_login[0].friends.indexOf(talk_to)
                if(index === selectedKey)
                    return
                if(index !== -1)
                    setSelectedKey((index+2).toString())
                else
                    setSelectedKey("1")}
        }, [user_login, talk_to, selectedKey])

    return (
        <div className="App-test">
            <List
                selectedKey={selectedKey}
                setSelectedKey={setSelectedKey}
                setTalk_to={setTalk_to}
                refetch={refetch}
                user_login={user_login}
            />
            <div className="App" >
                <div className="App-title">
                    <h1>Simple Chat</h1>
                    <Button type="primary" danger onClick={handleMessageClear}> 
                        Clear
                    </Button>
                </div>
                <div className="App-messages">
                    {loading ? (
                        <p style={{ color: '#ccc' }}>
                            {'Loading...'}
                        </p>
                        ) : (data.messages_show.length === 0 ? (
                            <p style={{ color: '#ccc' }}>
                                {'No messages...'}
                            </p>
                            ) : (data.messages_show.map(({ name, body }, i) => (
                                <p className="App-message" key={i}>
                                    {name === username? 
                                    (<Tag color="purple">{name}</Tag>) : (<Tag color="blue">{name}</Tag>)}
                                    {body}
                                </p>))
                                ))}
                </div>
                <Input
                    placeholder="User name"
                    value={talk_to}
                    onChange={(e) => setTalk_to(e.target.value)}
                    style={{ marginBottom: 10 }}
                    onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        bodyRef.current.focus()}
                    }}
                ></Input>
                <Input.Search
                    rows={4}
                    value={body}
                    ref={bodyRef}
                    enterButton="Send"
                    onChange={(e) => setBody(e.target.value)}
                    placeholder="Type a message here..."
                    onSearch={handleMessageSubmit}
                ></Input.Search>
            </div>
        </div>
    )
    
}

export default Chat