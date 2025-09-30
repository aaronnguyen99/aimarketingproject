import React from "react";

export default function OptionModal({ isOpen, onClose, title, children, actions }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">
      <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 font-bold"
        >
          ×
        </button>

        {/* Title */}
        {title && <h2 className="text-lg font-semibold mb-4">{title}</h2>}

        {/* Content */}
        <div className="mb-4">{children}</div>

        {/* Action buttons */}
        <div className="flex justify-end gap-3">
          {actions &&
            actions.map((action, idx) => (
              <button
                key={idx}
                onClick={action.onClick}
                className={`px-3 py-1 rounded ${
                  action.variant === "danger"
                    ? "bg-red-500 text-white hover:bg-red-600"
                    : "border bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                {action.label}
              </button>
            ))}
        </div>
      </div>
    </div>
  );
}