import { gql } from 'apollo-boost'

const CREATE_MESSAGE_MUTATION = gql`
    mutation createMessage(
        $name: String!
        $talk_to: String!
        $body: String!
        ){
            createMessage(
                name: $name
                talk_to: $talk_to
                body: $body
            )
        {
            name
            talk_to
            body
        }
    }
`
const DELETE_MESSAGE_MUTATION = gql`
    mutation deleteMessage(
        $name: String!
        $body: String!
        ){
            deleteMessage(
                name: $name
                body: $body
            )
        {
            name
            body
        }
    }
`

const CREATE_USER_MUTATION = gql`
    mutation createUser(
        $name: String!
        $password: String!
        ){
            createUser(
                name: $name
                password: $password
            )
        {
            name
            password
        }
    }
`

const UPDATE_USER_MUTATION = gql`
    mutation updateUser(
        $name: String!
        $password: String!
        $friends: [String]!
        $update: String!
        ){
            updateUser(
                name: $name
                password: $password
                friends: $friends
                update: $update
            )
        {
            name
            friends
        }
    }
`

export { CREATE_MESSAGE_MUTATION, DELETE_MESSAGE_MUTATION, CREATE_USER_MUTATION, UPDATE_USER_MUTATION }