import '../App.css'
import React from 'react'
import { useMutation } from '@apollo/react-hooks'
import { Button, Input, message, Tooltip } from 'antd'
import { EyeInvisibleOutlined, EyeTwoTone, InfoCircleOutlined, UserOutlined } from '@ant-design/icons'
import { CREATE_USER_MUTATION } from '../graphql'

function Init({username, setUsername, setLogin, password, setPassword, user_name, user_login}) {
    //console.log(user_login.loading, user_login.error, user_login.data)
    const [addUser] = useMutation(CREATE_USER_MUTATION)
    const displayStatus = (s) => {
        if (s.msg) {
            const { type, msg } = s
            const content = {
                content: msg,
                duration: 2
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
  
    const handleLogin = async () => {
        if( username === '' || password === '' ){
            displayStatus({
                type: 'error',
                msg: 'Please enter your name and password.'
            })
            return
        }
        else{
            if (user_name.loading) return null;
            if (user_name.error) return `Error! ${user_name.error}`;
            if (user_name.data.user_name.length === 0){
                displayStatus({
                    type: 'error',
                    msg: 'Name does not exist.'
                })
                return
            }
            if (user_login.loading) return null;
            if (user_login.error) return `Error! ${user_login.error}`;
            if (user_login.data.user_login.length === 0)
                displayStatus({
                    type: 'error',
                    msg: 'Password is incorrect.'
                })
            else if(user_login.data.user_login.length === 1)
                setLogin(true)
            return
        }
    }
  
    const handleRegister = async () => {
        if( username === '' || password === '' ){
            displayStatus({
                type: 'error',
                msg: 'Please enter your name and password.'
            })
            return
        }
        else{
            if (user_name.loading) return null;
            if (user_name.error) return `Error! ${user_name.error}`;
            if (user_name.data.user_name.length !== 0){
                displayStatus({
                    type: 'error',
                    msg: 'Name has been used.'
                })
                return
            }
            await addUser({
                variables:{
                    name: username,
                    password: password,
                    friends: []}
            })
            displayStatus({
                type: 'success',
                msg: 'You have registered an account successfully!'
            })
            setUsername("")
            setPassword("")
            setTimeout(()=>window.location.reload(), 1000);
        }
    }
  
    return (
        <div className="App">
            <h1>Simple Chat</h1>
            <Input
                placeholder="Enter your name"
                prefix={<UserOutlined className="site-form-item-icon" />}
                suffix={
                    <Tooltip title="You have to login!!">
                    <InfoCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
                    </Tooltip>}
                style={{ marginBottom: 20 }}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <Input.Password
                placeholder="Input password"
                iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                style={{ marginBottom: 20 }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <div>
                <Button
                    type="primary"
                    float="left"
                    style={{ marginRight: 10 }}
                    onClick={handleLogin}
                >
                    Login
                </Button>
                <Button
                    type="primary"
                    float="right"
                    style={{ marginLeft: 10 }}
                    onClick={handleRegister}
                >
                    Register
                </Button>
            </div>
      </div>
    )    
    
}

export default Init