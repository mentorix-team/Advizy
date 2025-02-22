import React from 'react';
import { BiChevronRight } from 'react-icons/bi';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

export default function CompleteProfile({ 
  completion = 0,
}) {

  const navigate = useNavigate();

  const onCompleteProfile = () => {
    navigate('/dashboard/expert/profile-detail')
  }

  return (
    <div className="bg-white border rounded-lg shadow-sm p-4 sm:p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg sm:text-xl font-bold">Complete Your Profile</h2>
        <ArrowUpRight onClick={onCompleteProfile} className='w-4 h-4 text-gray-600' />
        <button className="text-gray-400 hover:text-gray-600">→</button>
      </div>
      
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600">Profile Completion</span>
          <span className="text-sm font-medium">{completion}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-black rounded-full h-2 transition-all duration-300" 
            style={{ width: `${completion}%` }}
          ></div>
        </div>
      </div>

      <p className="text-sm text-gray-600 mb-6">
        Complete your profile to increase visibility and attract more clients.
      </p>


      <button 
        onClick={onCompleteProfile}
        className="w-full bg-black text-white rounded-lg py-2 px-4 hover:bg-gray-800 flex items-center justify-center gap-2"
      >
        Complete Profile
        <BiChevronRight size={20} />
      </button>
    </div>
  );
}

CompleteProfile.propTypes = {
  completion: PropTypes.number,
  sections: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    status: PropTypes.oneOf(['completed', 'in-progress', 'pending']).isRequired
  })),
  onCompleteProfile: PropTypes.func
};