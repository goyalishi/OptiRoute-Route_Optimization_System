import React from 'react'
import { FiMapPin } from "react-icons/fi";
import Navbar from '../components/Navbar';

const DriverDashboard = () => {
    const user = {
        name: "Krati Agrawal",
        role: "driver",
        onLogout: () => alert("Logged out successfully!"),
    };
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        <Navbar user={user}/>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
                title="Total Stops"
                value="1,245"
                icon="📦"
                color="bg-blue-100 text-blue-600"
            />
            <StatCard
                title="Pending"
                value="1,245"
                icon="⏱️"
                color="bg-blue-100 text-blue-600"
            />
            <StatCard
                title="Delivered"
                value="1,245"
                icon="✅"
                color="bg-blue-100 text-blue-600"
            />
            <StatCard
                title="In Progress"
                value="1,245"
                icon="📦"
                color="bg-blue-100 text-blue-600"
            />
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border mb-8">
            <div>
                Route Progress
            </div>
            <div>

            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* left */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border flex flex-col items-center justify-center transition-transform hover:scale-[1.01]">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Route Overview</h2>
                <div className="w-full h-64 bg-gradient-to-br from-gray-100 to-gray-200 rounded-md flex items-center justify-center text-gray-500 font-medium">Map Preview Coming Soon 🗺️</div>
            </div>
            {/* right */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border flex flex-col items-center justify-center transition-transform hover:scale-[1.01]">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Delivery Stops</h2>
                
                <div className="w-full h-64 rounded-md flex flex-col items-center justify-center  text-gray-400 font-medium space-y-2">
      <FiMapPin className="text-3xl mb-2 text-gray-400" />
      <p className="text-center leading-relaxed">
        No waypoints assigned yet 📍<br />
        <span className="text-gray-500">Check back later for new routes</span>
      </p>
    </div>
            </div>
        </div>
    </div>  
    
  )
}




const StatCard = ({ title, value, icon, color }) => (
    <div className="bg-white rounded-2xl p-5 shadow-lg border hover:shadow-xl transition-all duration-200">
        <div className="flex items-center justify-between mb-2">
            <div className={`${color} rounded-full p-2 text-xl`}>{icon}</div>
            <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        </div>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
);

export default DriverDashboard