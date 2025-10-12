// src/components/InputField.jsx
import React from "react";

const InputField = ({ label, type, placeholder, optional }) => {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700">
        {label}{" "}
        {optional && <span className="text-gray-400 text-xs">(Optional)</span>}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
      />
    </div>
  );
};

export default InputField;
