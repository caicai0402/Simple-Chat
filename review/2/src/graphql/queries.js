import { gql } from 'apollo-boost'

export const QUERY = gql`
  query message(
    $myname: String
    $name: String
    $body: String
  ){
    messages (
        myname:$myname
        name:$name
        body:$body
      
    ){
      myname
      name
      body
    }
  }
`
