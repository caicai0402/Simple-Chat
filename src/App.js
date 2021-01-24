import './App.css'
import React, { useState } from 'react'
import { useQuery } from '@apollo/react-hooks'
import {
  USER_NAME_QUERY,
  USER_LOGIN_QUERY
} from './graphql'
import Chat from './components/Chat'
import Init from './components/Init'

function App() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [login, setLogin] = useState(false)
    const user_name = useQuery(USER_NAME_QUERY, {variables:{
      name: username
    }}, [username])
    const user_login = useQuery(USER_LOGIN_QUERY, {variables:{
      name: username,
      password: password
    }}, [username, password])
return (
  <>
    {!login?
      (
      <Init
        username={username} 
        setUsername={setUsername}
        password={password}
        setPassword={setPassword}
        login={login}
        setLogin={setLogin}
        user_name={user_name}
        user_login={user_login}
      />
      )
      : (
        <>
          <Chat
            username={username}
            password={password}
            user_login={user_login}
          />
        </>
      )
    }
  </>)
}

export default App
