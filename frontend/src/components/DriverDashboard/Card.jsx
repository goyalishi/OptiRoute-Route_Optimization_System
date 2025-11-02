import React from 'react'
import SmallCard from './SmallCard'

const Card = () => {
  return (
    <div className="w-full mt-6">
        {/* Flex container for horizontal layout */}
        <div className="flex flex-row gap-4 w-full">
            <SmallCard name="Total Distance" value="45 Km" />
            <SmallCard name="Estimated Time" value="120 min" />
            <SmallCard name="Total Stops" value="5" />
        </div>
    </div>
  )
}

export default Card
