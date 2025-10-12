// src/components/RoleSelector.jsx
import React from "react";

const RoleSelector = ({ role, setRole }) => {
  return (
    <div className="flex flex-col gap-2 mt-2">
      <label className="text-sm font-medium text-gray-700">Account Type</label>
      <div className="flex flex-col gap-2">
        <label className="flex items-center gap-2 border rounded-md px-3 py-2 cursor-pointer hover:border-green-500">
          <input
            type="radio"
            name="role"
            value="admin"
            checked={role === "admin"}
            onChange={() => setRole("admin")}
          />
          <span className="text-sm">
            <strong>Admin Account</strong>
          </span>
        </label>

        <label className="flex items-center gap-2 border rounded-md px-3 py-2 cursor-pointer hover:border-green-500">
          <input
            type="radio"
            name="role"
            value="driver"
            checked={role === "driver"}
            onChange={() => setRole("driver")}
          />
          <span className="text-sm">
            <strong>Driver Account</strong>
          </span>
        </label>
      </div>
    </div>
  );
};

export default RoleSelector;
