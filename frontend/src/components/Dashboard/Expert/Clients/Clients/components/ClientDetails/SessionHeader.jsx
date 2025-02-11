import { BsCalendar3, BsClock } from 'react-icons/bs';

export function SessionHeader({ date, time, title, service, status, paymentStatus, rating }) {
  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <span key={index} className={`text-yellow-400 ${index < rating ? 'text-yellow-400' : 'text-gray-200'}`}>
        ★
      </span>
    ));
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
      <div>
        <div className="flex flex-wrap items-center gap-2 text-gray-600 text-sm mb-2">
          <div className="flex items-center gap-1">
            <BsCalendar3 className="text-gray-400" />
            <span>{date}</span>
          </div>
          <div className="flex items-center gap-1">
            <BsClock className="text-gray-400" />
            <span>{time}</span>
          </div>
        </div>
        <h3 className="font-medium text-green-600">{title}</h3>
        <p className="text-sm text-gray-500">{service}</p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <span className="px-2 py-1 text-sm rounded-full bg-green-100 text-green-800 whitespace-nowrap">
          {status}
        </span>
        {paymentStatus && (
          <span className="px-2 py-1 text-sm rounded-full bg-yellow-100 text-yellow-800 whitespace-nowrap">
            {paymentStatus}
          </span>
        )}
        {rating && (
          <div className="flex">
            {renderStars(rating)}
          </div>
        )}
      </div>
    </div>
  );
}