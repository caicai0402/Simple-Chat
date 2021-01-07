import React from 'react'

import { Card, CardHeader, CardFooter, CardBody } from 'reactstrap'

const Message = ({
  data: {
    name,
    body
  }
}) => (
  <Card style={{ margin: '30px auto', width: '400px' }}>
    <CardHeader>{name}</CardHeader>
    <CardBody>
      {body || <p style={{ opacity: 0.5 }}>No body for this post...</p>}
    </CardBody>
  </Card>
)

export default Message
