import React from 'react';

const ExpertCardSkeleton = () => {
  return (
    <div className="w-[492px] h-[330px] bg-[#FDFDFD] rounded-[10px] p-5 border border-[#1D1D1D26] space-y-3 animate-pulse">
      <div className="flex items-start gap-4">
        <div className="w-28 h-28 rounded-full bg-gray-200" />
        
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="h-6 w-48 bg-gray-200 rounded-md" />
              <div className="h-4 w-32 bg-gray-200 rounded-md" />
              
              <div className="flex items-center gap-6">
                <div className="h-5 w-16 bg-gray-200 rounded-md" />
                <div className="h-5 w-32 bg-gray-200 rounded-md" />
              </div>
              
              <div className="h-4 w-40 bg-gray-200 rounded-md" />
              <div className="h-4 w-36 bg-gray-200 rounded-md" />
            </div>
            
            <div className="h-6 w-6 bg-gray-200 rounded-full" />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex flex-wrap gap-2">
          <div className="h-4 w-16 bg-gray-200 rounded-md" />
          <div className="h-6 w-20 bg-gray-200 rounded-full" />
          <div className="h-6 w-24 bg-gray-200 rounded-full" />
          <div className="h-6 w-16 bg-gray-200 rounded-full" />
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="h-4 w-16 bg-gray-200 rounded-md" />
          <div className="h-6 w-20 bg-gray-200 rounded-full" />
          <div className="h-6 w-24 bg-gray-200 rounded-full" />
          <div className="h-6 w-16 bg-gray-200 rounded-full" />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="h-10 w-48 bg-gray-200 rounded-md" />
        <div className="flex gap-2">
          <div className="h-9 w-28 bg-gray-200 rounded-xl" />
          <div className="h-9 w-28 bg-gray-200 rounded-xl" />
        </div>
      </div>
    </div>
  );
};

export default ExpertCardSkeleton;