import { gql } from 'apollo-boost'

export const SUBSCRIPTION = gql`
  subscription messages(
    $myname: String!
  ){
    messages (
      myname: $myname
    ){
      mutation
      data {
        myname
        name
        body
      }
    }
  }
`
