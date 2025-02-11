import React from 'react';
import ServiceCard from './ServiceCard';

const ServiceGrid = () => {
  const services = [
    {
      type: 'Mock Interview',
      description: 'Personalized guidance for your career growth and technical challenges',
      duration: '90',
      price: '200'
    },
    {
      type: 'Resume Review',
      description: 'Personalized guidance for your career growth and technical challenges',
      duration: '90',
      price: '200'
    }
  ];

  return (
    <div className="grid grid-cols-2 gap-4">
      {services.map((service, index) => (
        <React.Fragment key={index}>
          <ServiceCard service={service} />
          <ServiceCard service={service} />
        </React.Fragment>
      ))}
    </div>
  );
};

export default ServiceGrid;