import React, { useState, useEffect } from "react";

export default function EditModal({ isOpen, onClose, data, onSave }) {
  const [formData, setFormData] = useState({});

  // Initialize modal with current row data
  useEffect(() => {
    if (data) setFormData({ ...data });
  }, [data]);

  if (!isOpen) return null;

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">
      <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 font-bold"
        >
          ×
        </button>

        <h2 className="text-lg font-semibold mb-4">Edit</h2>

        <div className="mb-4 space-y-3 max-h-80 overflow-auto">
          {Object.keys(formData).map((key) => {
            // Skip id or system fields if needed
            if (key === "id" || key === "_id"||key === "snapshot"|| key === "userId"|| key === "createdAt"|| key === "updatedAt"|| key === "__v"|| key === "count") return null;

            return (
              <div key={key} className="flex flex-col">
                <label className="text-sm text-gray-600">{key === "isYour"?"Is this your school?":key.toUpperCase()}</label>

                {key === "isYour" ? (
                    <input
                    type="checkbox"
                    checked={formData[key]}
                    onChange={(e) => handleChange(key, e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                ) : (
                    
                    <input
                    type="text"
                    value={formData[key]}
                    onChange={(e) => handleChange(key, e.target.value)}
                    className="w-full border p-2 rounded"
                    />
                )}

              </div>
            );
          })}
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-3 py-1 rounded border hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-3 py-1 rounded bg-blue-500 text-white hover:bg-blue-600"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}