import React from 'react'
import Delivery from './Delivery'

const DeliveryList = () => {
  return (
    <div>
        <Delivery name="GLA University" location="Mathura" status="Complete" />
        <Delivery name="GL Bajaj" location="Mathura" status="In-progress" />
        <Delivery name="IIT Delhi" location="Delhi" status="Pending" />
    </div>
  )
}

export default DeliveryList
