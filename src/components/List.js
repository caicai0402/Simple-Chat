import React, { useEffect } from 'react'
import { USER_SUBSCRIPTION } from '../graphql'
import { Menu } from 'antd'
import { MailOutlined } from '@ant-design/icons'
import '../App.css'

function List({selectedKey, setSelectedKey, setTalk_to, refetch, user_login}){
    useEffect(() => {
        user_login.subscribeToMore({
            document: USER_SUBSCRIPTION,
            updateQuery: (prev, { subscriptionData }) => {
                if (!subscriptionData.data) return prev
                    const updateUser = subscriptionData.data
                if(updateUser.user.data.name === user_login.data.user_login[0].name)
                    return {user_login : [updateUser.user.data]}
            }
        })
    }, [user_login])
    return (
        <>
            <div className="App-list">
                <Menu
                selectedKeys={[selectedKey]}
                mode="inline"
                theme="dark"
                >
                    <Menu.Item
                        key="1"
                        icon={<MailOutlined />}
                        onClick={
                            async(e)=>{
                                setSelectedKey(e.key)
                                await setTalk_to("")
                                refetch()}}
                    >
                        All
                    </Menu.Item>
                    {!user_login.loading? user_login.data.user_login[0].friends.map((item, i) => (
                        <Menu.Item key={(i+2).toString()} icon={<MailOutlined/>} onClick={async(e)=>{setSelectedKey(e.key); await setTalk_to(item)}}>
                            {item}
                        </Menu.Item>
                    )):(
                        <Menu.Item icon={<MailOutlined/>}>
                            Loading...
                        </Menu.Item>
                    )
                }
                </Menu>
            </div>
        </>
    )
}

export default List