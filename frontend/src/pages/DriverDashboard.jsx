import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { FiMapPin,FiActivity } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import Navbar from '../components/Navbar';
import Card from '../components/DriverDashboard/Card';
import DeliveryList from '../components/DriverDashboard/DeliveryList';

const DriverDashboard = () => {
    const user = {
  name: sessionStorage.getItem("username"),
  role: sessionStorage.getItem("role"),
  onLogout: () => {
    sessionStorage.clear(); 
    alert("Logged out successfully!");
    window.location.href = "/"; 
  },
};

    const [activeTab, setActiveTab] = useState("routemap");
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
  
    // Fetch dummy data
    useEffect(() => {
      if (activeTab === "deliveries") {
        setLoading(true);
        const apiUrl ="https://jsonplaceholder.typicode.com/todos?_limit=5"
           
        axios
          .get(apiUrl)
          .then((res) => setData(res.data))
          .catch((err) => console.error(err))
          .finally(() => setLoading(false));
      }
    }, [activeTab]);


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 ">
        <Navbar user={user}/>

        {/* Tabs Section */}
      <div className="flex ml-14 mt-6">
        <div className="flex items-center justify-between gap-4 rounded-3xl bg-gradient-to-r from-blue-100 to-green-100 shadow-md py-2 px-3 text-black w-fit">
          {[
            { id: "routemap", label: "RouteMap", icon: "📊" },
            { id: "deliveries", label: "Deliveries", icon: "👥" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-2 rounded-3xl text-base font-medium transition-all duration-300 ${
                activeTab === tab.id
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-700 hover:bg-white/80 hover:text-blue-600"
              }`}
            >
              <span className="text-lg">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>


    {/* Stats Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 w-full px-6 lg:px-16">
    <StatCard
        title="Total Deliveries"
        value="1,245"
        icon="📦"
        color="bg-blue-100 text-blue-600"
    />
    <StatCard
        title="Completed"
        value="1,245"
        icon="✅"
        color="bg-blue-100 text-blue-600"
    />
    <StatCard
        title="In Progress"
        value="1,245"
        icon="⏱️"
        color="bg-blue-100 text-blue-600"
    />
    <StatCard
        title="Distance"
        value="1,245"
        icon={<FiActivity className="text-xl" />}
        color="bg-blue-100 text-blue-600"
    />
      </div>

        <div>
        {activeTab === "routemap" && (
            <>
    <div className="w-full px-6 lg:px-16 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-lg border w-full flex flex-col items-center justify-center transition-transform hover:scale-[1.01]">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Route Overview</h2>
            <div className="w-full h-72 bg-gradient-to-br from-gray-100 to-gray-200 rounded-md flex flex-col items-center justify-center text-gray-600 font-medium shadow-sm">
                <FiMapPin className="text-5xl mb-3 text-gray-500" />
                <p className="text-lg">Map Preview Coming Soon 🗺️</p>
            </div>
            <Card/>
        </div>
    </div>

    <div className="w-full px-6 lg:px-16 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-lg border w-full flex flex-col  justify-center transition-transform hover:scale-[1.01]">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Delivery List</h2>
            <DeliveryList/>
        </div>
    </div>
        
        </>
        )}


        {/* {activeTab === "deliveries" && (

        )} */}



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