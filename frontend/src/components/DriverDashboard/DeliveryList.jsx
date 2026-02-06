import React from 'react';
import Delivery from './Delivery';

const DeliveryList = ({ deliveries, onUpdateStatus }) => {
  if (!deliveries || deliveries.length === 0) {
    return <div className="p-4 text-center text-gray-500">No deliveries assigned for this route.</div>;
  }

  return (
    <div className="w-full">
      {deliveries.map((delivery) => (
        <Delivery
          key={delivery._id}
          delivery={delivery}
          onUpdateStatus={onUpdateStatus}
        />
      ))}
    </div>
  );
};

export default DeliveryList;
