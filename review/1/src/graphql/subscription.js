import { gql } from '@apollo/client';

export const MESSAGES_SUBSCRIPTION = gql`
    subscription messageSend($name: String!){
        messageSend(name: $name) {
            name
            body
        }
    }
`