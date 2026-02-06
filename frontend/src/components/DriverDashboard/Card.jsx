import React from 'react';
import SmallCard from './SmallCard';

const Card = ({ route }) => {
  if (!route) return null;

  const totalTimeMinutes = Math.round(route.totalTime / 60);
  const totalStops = route.deliveryPoints ? route.deliveryPoints.length : 0;
  // Distance is not in the snippet, using placeholder or checking if it exists
  const totalDistance = route.totalDistance ? `${(route.totalDistance / 1000).toFixed(1)} km` : "N/A";

  return (
    <div className="w-full mt-6">
      {/* Flex container for horizontal layout */}
      <div className="flex flex-row gap-4 w-full">
        <SmallCard name="Total Distance" value={totalDistance} />
        <SmallCard name="Estimated Time" value={`${totalTimeMinutes} min`} />
        <SmallCard name="Total Stops" value={totalStops} />
      </div>
    </div>
  );
};

export default Card;
