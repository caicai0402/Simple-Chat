import { gql } from 'apollo-boost'

const USER_NAME_QUERY = gql`
  query (
    $name: String!
    $password: String
    ){
      user_name (
        name: $name
        password: $password
      ){
        name
    }
  }
`

const USER_LOGIN_QUERY = gql`
  query (
    $name: String!
    $password: String!
    ){
      user_login (
        name: $name
        password: $password
      ){
        name
        password
        friends
    }
  }
`

const MESSAGES_SHOW_QUERY = gql`
  query (
    $name: String!
    $talk_to: String!
    ){
    messages_show(
      name: $name
      talk_to: $talk_to
      ){
      name
      talk_to
      body
    }
  }
`

export { USER_NAME_QUERY,  USER_LOGIN_QUERY, MESSAGES_SHOW_QUERY }
