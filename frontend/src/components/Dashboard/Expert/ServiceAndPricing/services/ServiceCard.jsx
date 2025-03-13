import PropTypes from 'prop-types';
import TimeSlot from './TimeSlot';
import ServiceFeatures from './ServiceFeatures';
import ServiceActions from './ServiceActions';

export default function ServiceCard({ 
  id, 
  title, 
  description,
  timeSlots,
  duration,
  price,
  features,
  isActive = true,
  onEdit,
  onDelete,
  onToggle
}) {
  const slots = timeSlots || [{ duration, price }];
  const isDefaultCard = id === 'default';

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
          <p className="text-gray-600">{description}</p>
        </div>
        <ServiceActions 
          isActive={isActive}
          onEdit={() => onEdit(id)}
          onDelete={() => onDelete(id)}
          onToggle={() => onToggle(id)}
          isDefaultService={isDefaultCard}
        />
      </div>

      <div className="flex flex-wrap gap-2 my-6">
        {slots.map((slot, index) => (
          <TimeSlot 
            key={index}
            duration={slot.duration}
            price={slot.price}
          />
        ))}
      </div>

      <ServiceFeatures features={features} showMore={isDefaultCard} />
    </div>
  );
}