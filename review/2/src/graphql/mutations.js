import { gql } from 'apollo-boost'

export const CREATE_MUTATION = gql`
  mutation createMessage(
    $myname: String!
    $name: String!
    $body: String!
  ) {
    createMessage(
      myname: $myname
      name: $name
      body: $body
    ) {
      myname
      name
      body
    }
  }
`
