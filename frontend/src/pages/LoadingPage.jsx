import React from "react";

const LoadingPage = () => {
  return (
  <div className="space-y-2">
    <div className="h-6 bg-gray-300 rounded animate-pulse w-3/4"></div>
    <div className="h-6 bg-gray-300 rounded animate-pulse w-1/2"></div>
    <div className="h-6 bg-gray-300 rounded animate-pulse w-full"></div>
  </div>
  );
};

export default LoadingPage;