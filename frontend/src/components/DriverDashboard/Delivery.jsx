import React, { useState } from 'react';

const Delivery = ({ delivery, onUpdateStatus }) => {
  if (!delivery) return null;
  const { customerDetails, address, status, _id } = delivery;
  const [selectedStatus, setSelectedStatus] = useState(status === 'assigned' ? 'in-progress' : status);

  const handleStatusChange = (e) => {
    setSelectedStatus(e.target.value);
  };

  const handleUpdateClick = () => {
    if (selectedStatus === status) return; // No change

    let failureReason = null;
    if (selectedStatus === 'failed' || selectedStatus === 'cancelled') {
      failureReason = prompt("Please provide a reason for cancellation/failure:");
      if (!failureReason) return; // Cancel update if no reason provided
    }

    onUpdateStatus(_id, selectedStatus, failureReason);
  };

  const isFinalStatus = ['delivered', 'completed', 'failed', 'cancelled'].includes(status);

  return (
    <div>
      <div className="bg-white shadow-md rounded-lg p-4 mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        {/* Left content */}
        <div>
          <h3 className="text-lg font-semibold mb-2">{customerDetails.name}</h3>
          <p className="text-gray-600 mb-1">Location: {address}</p>
          <p className="text-gray-600">
            Status:
            <span className={`ml-2 font-medium ${status === 'completed' || status === 'delivered' ? 'text-green-600' :
              status === 'in-progress' ? 'text-yellow-600' :
                status === 'failed' || status === 'cancelled' ? 'text-red-600' :
                  'text-blue-600'
              }`}>
              {status}
            </span>
          </p>
        </div>

        {/* Action Section */}
        <div className="mt-3 sm:mt-0 flex flex-col sm:flex-row gap-2 items-center">
          {!isFinalStatus && (
            <>
              <select
                value={selectedStatus}
                onChange={handleStatusChange}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="in-progress">In Progress</option>
                <option value="delivered">Delivered</option>
                <option value="failed">Failed</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <button
                onClick={handleUpdateClick}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition-all duration-300"
              >
                Update
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Delivery;
