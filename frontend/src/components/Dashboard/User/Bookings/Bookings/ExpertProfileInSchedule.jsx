import PropTypes from 'prop-types'

function ExpertProfileInSchedule({ expert }) {
  return (
    <div className="bg-white rounded-[32px] shadow-lg p-6 sm:p-8 w-full lg:w-[400px] h-fit">
      <div className="flex items-center gap-4 mb-6">
        <img 
          src={expert.image} 
          alt={expert.name}
          className="w-16 sm:w-[72px] h-16 sm:h-[72px] rounded-full object-cover"
        />
        <div>
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">{expert.name}</h2>
          <p className="text-sm sm:text-base text-gray-500">{expert.title}</p>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Career Strategy Session</h3>
        <div className="flex items-center gap-2">
          <span className="flex items-center text-gray-600 text-sm sm:text-base">
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="ml-1">{expert.sessionDuration} min</span>
          </span>
          <span className="ml-auto text-green-600 font-medium">₹{expert.price}</span>
        </div>
      </div>

      <div className="mb-6">
        <h4 className="font-medium text-gray-900 mb-2">Description:</h4>
        <p className="text-gray-600 text-sm leading-relaxed">{expert.description}</p>
      </div>

      <div>
        <h4 className="font-medium text-gray-900 mb-3">What's Included:</h4>
        <ul className="space-y-2">
          {expert.includes.map((item, index) => (
            <li key={index} className="flex items-center text-gray-600 text-sm">
              <span className="text-green-500 mr-2">•</span>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

ExpertProfileInSchedule.propTypes = {
  expert: PropTypes.shape({
    image: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    sessionDuration: PropTypes.number.isRequired,
    price: PropTypes.number.isRequired,
    description: PropTypes.string.isRequired,
    includes: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
}

export default ExpertProfileInSchedule