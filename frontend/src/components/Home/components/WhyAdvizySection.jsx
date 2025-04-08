import React from 'react';
import { Zap, Users, TrendingUp } from "lucide-react";

const WhyAdvizySection = () => {
  const features = [
    {
      icon: <Zap className="w-6 h-6 text-[#169544]" />,
      title: "A Vision Beyond Mentorship",
      description: "More than just finding an expert, we help you discover what's next for you. Our mission is to help everyone unlock their true potential."
    },
    {
      icon: <Users className="w-6 h-6 text-[#169544]" />,
      title: "Community-Driven Growth",
      description: "Our platform connects you with those who genuinely want to uplift others—mentors, achievers, and guides dedicated to your success."
    },
    {
      icon: <TrendingUp className="w-6 h-6 text-[#169544]" />,
      title: "Learn From Those Who've Done It",
      description: "Whether it's career decisions, freelancing, or starting a business, connect with real people who've been in your shoes."
    }
  ];

  return (
    <div className="py-16 bg-white -mx-4 sm:-mx-6 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-12">
            Why Adviszy?
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center px-4">
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 bg-[#E8F5E9] rounded-full flex items-center justify-center">
                  {feature.icon}
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WhyAdvizySection;