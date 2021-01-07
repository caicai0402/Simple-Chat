import { gql } from '@apollo/client'

export const SEND_MESSAGE_MUTATION = gql`
    mutation sendMessage($name: String! $body: String!) {
        sendMessage(name: $name, body: $body)
    }
`