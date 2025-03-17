"use client"

import { Heart } from "lucide-react"
import { useState } from "react"

export default function HomeCard() {
  const [isFavorite, setIsFavorite] = useState(false)

  return (
    <div className="w-[445px] h-[300px] rounded-lg border border-gray-300 p-[16px_20px_23px_20px] relative">
      <button onClick={() => setIsFavorite(!isFavorite)} className="absolute top-3 right-3 p-1 z-10">
        <Heart className={`w-6 h-6 ${isFavorite ? "fill-red-500 text-red-500" : "text-gray-400"}`} />
      </button>
      {/* Inner container */}
      <div className="w-[378px] h-[270px] flex flex-col gap-[12px]">
        {/* First section: image, name, title, review, experience, price */}
        <div className="w-[348px] h-[122px] flex gap-[12px]">
          <div className="relative flex items-center">
            <div className="w-[90px] h-[90px] rounded-full overflow-hidden">
              <img
                src="https://live.staticflickr.com/5252/5403292396_0804de9bcf_b.jpg?height=94&width=94"
                alt="Brooklyn Simmons"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-semibold">Brooklyn Simmons</h2>
                <p className="text-gray-700 text-sm">Startup Advisor & Entrepreneur</p>
                <div className="flex items-center mt-1 text-sm">
                  <span className="text-yellow-400">★</span>
                  <span className="ml-1 font-medium">4.5/5</span>
                  <span className="text-gray-500 ml-1">({756})</span>
                </div>
              </div>
            </div>
            <p className="text-gray-700 text-sm mb-1">
              Experience: <span className="font-medium">2+ yrs in industry</span>
            </p>
            <p className="text-gray-700 text-sm mb-1">
              Starts at <span className="text-blue-600 font-medium">$1400</span> for{" "}
              <span className="font-medium text-blue-600">50mins</span>
            </p>
          </div>
        </div>

        {/* Second section: expertise */}
        <div>
          <div className="flex flex-wrap gap-2">
            <p className="text-gray-900 text-sm">Expertise:</p>
            <span className="px-3 py-1 bg-gray-100 border border-gray-200 rounded-full text-[13px]">
              Relationship skills
            </span>
            <span className="px-3 py-1 bg-gray-100 border border-gray-200 rounded-full text-[13px]">Mental Health</span>
            <span className="px-3 py-1 bg-gray-100 border border-gray-200 rounded-full text-[13px]">
              Relationship skills
            </span>
            <span className="px-3 py-1 bg-gray-100 border border-gray-200 rounded-full text-[13px]">
              Stress Management
            </span>
            <span className="px-3 py-1 bg-gray-100 border border-gray-200 rounded-full text-[13px]">Stress</span>
          </div>
        </div>

        <div className="flex gap-3 justify-between">
          <div>
            <p className="text-gray-800 text-sm">Next Available Slot:</p>
            <p className="text-blue-600 text-sm">Tomorrow, 10:00 AM</p>
          </div>
          <div className="flex gap-3">
            <button className="px-3 py-0 border border-gray-200 text-sm rounded-md hover:bg-gray-100">
              View Profile
            </button>
            <button className="px-7 bg-green-500 text-white text-sm rounded-md hover:bg-green-600">Book</button>
          </div>
        </div>
      </div>
    </div>
  )
}

