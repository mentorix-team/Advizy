import React from 'react';
import ServiceOption from './ServiceOption';
import ServiceDescription from './ServiceDescription';

const ServicesOffered = () => {
  const services = [
    {
      title: "One-on-One Career Coaching Sessions",
      description: "Personalized guidance for your career growth and technical challenges Personalized guidance for your career growth and technical challenges Personalized guidance for your career growth and technical challenges",
      isPopular: true,
      options: [
        { price: "600", duration: "50" },
        { price: "400", duration: "30" },
        { price: "800", duration: "60" }
      ]
    },
    {
      title: "Resume and Cover Letter Review",
      description: "Detailed feedback within 48 hours uidance for your career growth and technical challenges Personalized guidance for your career growth and technical challenges Personalized guidance for your career growth and technical challenges Personalized guidance for your career growth and technical challenges Personalized guidance for your career growth and technical challenges",
      options: [{ price: "500", duration: "60" }]
    },
    {
      title: "Mock Interview",
      description: "90-min session with feedback",
      options: [{ price: "700", duration: "90" }]
    },
    {
      title: "Code Review",
      description: "In-depth analysis and feedback on your code",
      options: [{ price: "500", duration: "60" }]
    }
  ];

  return (
    <div className="bg-white rounded-[20px] p-8 mt-6 shadow-sm">
      <h2 className="text-2xl font-semibold mb-2">
        Services Offered <span className="text-gray-500 font-normal">(Select service)</span>
      </h2>
      
      <div className="text-sm mb-6">
        Next Available Slot: <span className="text-green-600 underline cursor-pointer">Tomorrow, 10:00 AM</span>
      </div>

      <div className="space-y-6">
        {services.map((service, index) => (
          <div key={index} className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-semibold">{service.title}</h3>
              {service.isPopular && (
                <span className="text-sm text-gray-600">Most Popular</span>
              )}
            </div>
            <ServiceDescription description={service.description} />
            <div className={`grid grid-cols-${service.options.length} gap-4`}>
              {service.options.map((option, idx) => (
                <ServiceOption
                  key={idx}
                  price={option.price}
                  duration={option.duration}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServicesOffered;