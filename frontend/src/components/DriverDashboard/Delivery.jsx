import React from 'react'

const Delivery = ({ name, location, status }) => {
  return (
    <div>
      <div className="bg-white shadow-md rounded-lg p-4 mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        {/* Left content */}
        <div>
          <h3 className="text-lg font-semibold mb-2">{name}</h3>
          <p className="text-gray-600 mb-1">Location: {location}</p>
          <p className="text-gray-600">Status: {status}</p>
        </div>

        {/* Button on the right */}
        <button className="mt-3 sm:mt-0 bg-green-500 text-white px-4 py-2 rounded-lg shadow hover:bg-green-600 transition-all duration-300">
          Update Status
        </button>
      </div>
    </div>
  )
}

export default Delivery
