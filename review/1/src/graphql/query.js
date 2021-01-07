import { gql } from '@apollo/client';

export const MESSAGES_QUERY= gql`
    query {
        messages{
            username
            targetname
            body
        }
    }
`