import React from "react";

const ExpertLoading = () => {
  return (
    <div
      className="relative rounded-lg border border-gray-300 shadow-lg p-4 animate-pulse"
      style={{
        width: "344px",
        height: "356px",
        borderRadius: "10px",
        margin: "16px auto",
        padding: "20px",
      }}
    >
      {/* Header Section */}
      <div className="flex items-start gap-4 mb-4">
        <div
          className="rounded-full bg-gray-200"
          style={{
            width: "85px",
            height: "85px",
          }}
        ></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          <div className="flex items-center gap-1">
            <div className="h-4 w-4 bg-gray-200 rounded-full"></div>
            <div className="h-3 bg-gray-200 rounded w-12"></div>
            <div className="h-3 bg-gray-200 rounded w-16"></div>
          </div>
        </div>
      </div>

      {/* Details Section */}
      <div className="space-y-2 mb-4">
        <div className="h-3 bg-gray-200 rounded w-full"></div>
        <div className="h-3 bg-gray-200 rounded w-3/4"></div>
        <div className="h-3 bg-gray-200 rounded w-2/3"></div>
      </div>

      {/* Expertise Section */}
      <div className="mb-4">
        <div className="flex flex-wrap gap-1">
          <div className="h-4 bg-gray-200 rounded-full px-3 py-1 w-20"></div>
          <div className="h-4 bg-gray-200 rounded-full px-3 py-1 w-24"></div>
          <div className="h-4 bg-gray-200 rounded-full px-3 py-1 w-28"></div>
        </div>
      </div>

      {/* Next Slot Section */}
      <div className="mb-4 rounded-md border p-2">
        <div className="h-3 bg-gray-200 rounded w-3/4"></div>
      </div>

      {/* Buttons Section */}
      <div className="flex gap-3">
        <div className="h-8 bg-gray-200 rounded-xl flex-1"></div>
        <div className="h-8 bg-gray-200 rounded-xl flex-1"></div>
      </div>
    </div>
  );
};

export default ExpertLoading;
