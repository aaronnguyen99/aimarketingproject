import React, { useState } from "react";

const AddCompanyModal = ({ isOpen, onClose, onAdd }) => {
  const [company, setCompany] = useState("");
  const [domain,setDomain]= useState("");
  const [isYour,setIsYour]=useState(false);
  const [error, setError] = useState("");

  const handleAdd = () => {
  if (!company.trim()) {
    setError("* School name is required");
    return;
  }
      onAdd(company,domain,isYour);
    setCompany(""); // reset textarea
    setDomain("");
    setIsYour(false);
    setError("");  // clear error
    onClose(); // close modal
  };
const handleClose = () => {
  setCompany("");
  setDomain("");
  setIsYour(false);
  setError("");  // clear error
  onClose(); // call parent close
};
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl p-8">
       
        {/* Title */}
        <h2 className="text-lg font-semibold mb-2">Add School Name and Website</h2>
        <p className="text-sm text-gray-500 mb-4">
            For the best results, please provide both the school name and its website URL</p>
        {/* Textarea */}
        <textarea
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          placeholder="Enter school name (e.g. University of Manitoba) *"
          maxLength={200}
          className="w-full h-15 px-4 py-3 rounded-lg border border-gray-300 shadow-sm
                     text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500
                     focus:border-blue-500 transition duration-200 resize-none break-words"
        />
                {error && <p className="text-red-500 font-semibold">{error}</p>}

        <textarea
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          placeholder="Enter school website (e.g. www.umanitoba.ca)"
          maxLength={200}
          className="w-full h-15 px-4 py-3 rounded-lg border border-gray-300 shadow-sm
                     text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500
                     focus:border-blue-500 transition duration-200 resize-none break-words"
        />
                <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            checked={isYour}
            onChange={(e) => setIsYour(e.target.checked)}
          />
          <span className="text-gray-700">Is this your school?</span>
        </label>
        <div className="flex mt-9 ">
          {/* Add button */}
          <button
            onClick={handleAdd}
            className="bg-neutral-900 mt-4 px-4 py-2 hover:bg-black text-white font-medium rounded-lg shadow transition"
          >
            + Add
          </button>
          {/* Close button */}
                  <button
            onClick={handleClose}
            className="ml-auto mt-4 px-4 py-2 bg-red-400 text-white px-3 py-1 hover:bg-red-600 transition-colors font-medium rounded-lg shadow transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddCompanyModal;