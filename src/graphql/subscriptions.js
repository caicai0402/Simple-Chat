import { gql } from 'apollo-boost'

const MESSAGES_SUBSCRIPTION = gql`
  subscription {
    message {
      mutation
      data {
        name
        talk_to
        body
      }
    }
  }
`

const USER_SUBSCRIPTION = gql`
  subscription {
    user {
      mutation
      data {
        name
        password
        friends
      }
    }
  }
`



export { MESSAGES_SUBSCRIPTION, USER_SUBSCRIPTION }