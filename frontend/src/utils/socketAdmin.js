import { io } from "socket.io-client";
import toast from "react-hot-toast";

let socket = null;

export const initializeAdminSocket = (adminId) => {
  socket = io(import.meta.env.VITE_APP_SERVER_URL);

  socket.on("connect", () => {
    console.log("Connected to socket server");
  });

  socket.on("driver_registered", (data) => {
    console.log("New driver registered:", data);
    toast.success(`Verification request from Driver: ${data.driver.name}`, {
      duration: 3000,
      position: "top-right",
    });
  });

  socket.on("route_started", (data) => {
    console.log("Route started:", data);
    toast.info(
      `${data.driverName} started route with(${data.totalDeliveries} deliveries)`,
      {
        duration: 3000,
        position: "top-right",
      },
    );
    triggerDriverDataRefresh();
  });

  socket.on("delivery_updated", (data) => {
    console.log("Delivery updated:", data);

    if (data.status === "failed" || data.status === "cancelled") {
      toast.error(`⚠️ ${data.customerName} delivery status: ${data.status}`, {
        duration: 4000,
        position: "top-right",
      });
    }

    triggerDriverDataRefresh();
  });

  socket.on("route_completed", (data) => {
    console.log("Route completed:", data);
    toast.success(
      `${data.driverName} completed route with(${data.totalDeliveries} deliveries)`,
      {
        duration: 4000,
        position: "top-right",
        icon: "✅",
      },
    );
    triggerDriverDataRefresh();
  });

  return socket;
};

export const disconnectAdminSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const getAdminSocket = () => socket;

// Callback to refresh driver data when updates occur
let driverDataRefreshCallback = null;

export const registerDriverDataRefresh = (callback) => {
  driverDataRefreshCallback = callback;
};

const triggerDriverDataRefresh = () => {
  if (driverDataRefreshCallback) {
    driverDataRefreshCallback();
  }
};
