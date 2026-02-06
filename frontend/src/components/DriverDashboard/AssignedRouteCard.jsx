import React, { useState } from 'react';
import { FiMapPin, FiTruck, FiChevronDown, FiChevronUp, FiPackage } from 'react-icons/fi';
import axios from 'axios';
import toast from 'react-hot-toast';

const AssignedRouteCard = ({ route, onStartRoute }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [loading, setLoading] = useState(false);

    if (!route) return null;

    const { _id, googleMapsLink, deliveryPoints } = route;

    // Calculate total weight if available, or just count deliveries
    const totalDeliveries = deliveryPoints?.length || 0;

    const handleStartClick = async () => {
        setLoading(true);
        try {
            await onStartRoute(_id);
        } catch (error) {
            console.error("Failed to start route", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden mb-6 transition-all hover:shadow-lg">
            <div className="p-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                    <div>
                        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                            <FiTruck className="text-blue-600" />
                            Route #{_id.slice(-6).toUpperCase()}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                            {totalDeliveries} Deliveries Assigned
                        </p>
                    </div>

                    <div className="flex gap-3 w-full md:w-auto">
                        {googleMapsLink && (
                            <a
                                href={googleMapsLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                            >
                                <FiMapPin /> Open Maps
                            </a>
                        )}
                        {onStartRoute && (
                            <button
                                onClick={handleStartClick}
                                disabled={loading}
                                className="flex-1 md:flex-none px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Starting...' : 'Start Route'}
                            </button>
                        )}
                    </div>
                </div>

                {/* Dropdown Toggle */}
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
                >
                    <span className="font-medium">View Deliveries</span>
                    {isExpanded ? <FiChevronUp /> : <FiChevronDown />}
                </button>
            </div>

            {/* Expandable Delivery List */}
            {isExpanded && (
                <div className="border-t border-gray-100 bg-gray-50 p-4 space-y-3">
                    {deliveryPoints && deliveryPoints.map((delivery, index) => (
                        <div key={delivery._id || index} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                            <div className="flex justify-between items-start">
                                <div className="space-y-1">
                                    <h4 className="font-semibold text-gray-800">{delivery.customerDetails?.name || 'Unknown Customer'}</h4>
                                    <p className="text-sm text-gray-600">{delivery.address}</p>
                                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                                        <span className="flex items-center gap-1">
                                            <FiPackage /> {delivery.weight || 'N/A'} kg
                                        </span>
                                        <span className={`px-2 py-0.5 rounded-full capitalize ${delivery.status === 'delivered' ? 'bg-green-100 text-green-700' :
                                            delivery.status === 'failed' ? 'bg-red-100 text-red-700' :
                                                'bg-blue-50 text-blue-700'
                                            }`}>
                                            {delivery.status}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                    {(!deliveryPoints || deliveryPoints.length === 0) && (
                        <p className="text-center text-gray-500 py-4">No deliveries found for this route.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default AssignedRouteCard;
