import React from 'react'

const SmallCard = ({ name, value }) => {
  return (
    <div className="flex-1 flex flex-col  justify-center px-4 py-6 bg-gray-50 rounded-lg shadow-sm min-h-[100px]">
        <h3 className="text-sm font-medium text-gray-500">{name}</h3>
        <h1 className="text-xl font-bold text-blue-800 mt-2">{value}</h1>
    </div>
  )
}

export default SmallCard
