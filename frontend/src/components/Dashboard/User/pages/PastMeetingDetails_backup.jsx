import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getMeetingbyid } from '@/Redux/Slices/meetingSlice';
import { AiOutlineUser, AiOutlineCalendar, AiOutlineClockCircle, AiFillStar, AiOutlineArrowLeft, AiOutlineUp, AiOutlineDown, AiOutlineStar } from 'react-icons/ai';
import { BiDownload } from 'react-icons/bi';
import { BsChatDots } from 'react-icons/bs';
import { IoClose } from 'react-icons/io5';
import Spinner from '@/components/LoadingSkeleton/Spinner';

export default function PastMeetingDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showPopup, setShowPopup] = useState(false);
  const [meeting, setMeeting] = useState(null);
  const [showDetails, setShowDetails] = useState(true);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const { selectedMeeting, loading, error } = useSelector((state) => state.meeting);

  useEffect(() => {
    const fetchMeeting = async () => {
      if (id) {
        setIsLoading(true);
        try {
          const response = await dispatch(getMeetingbyid(id));
          if (response.payload) {
            setMeeting(response.payload);
            
            // Get saved ratings from localStorage
            const savedMeetings = JSON.parse(localStorage.getItem('pastMeetings') || '[]');
            const savedMeeting = savedMeetings.find(m => m.id === id);
            if (savedMeeting) {
              setRating(savedMeeting.rating || 0);
              setFeedback(savedMeeting.feedback || '');
            }
          } else {
            console.error('Meeting not found');
            navigate('/dashboard/user/meetings');
          }
        } catch (error) {
          console.error('Error fetching meeting:', error);
          navigate('/dashboard/user/meetings');
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchMeeting();
  }, [id, dispatch, navigate]);

  const handleShowPopup = () => {
    setShowPopup(true);
    setTimeout(() => {
      setShowPopup(false);
    }, 3000);
  };

  const handleSubmitRating = () => {
    const updatedMeeting = { ...meeting, rating, feedback };
    setMeeting(updatedMeeting);
    
    // Save to localStorage
    const savedMeetings = JSON.parse(localStorage.getItem('pastMeetings') || '[]');
    const updatedMeetings = savedMeetings.map(m => 
      m.id === meeting.id ? { ...m, rating, feedback } : m
    );
    if (!savedMeetings.some(m => m.id === meeting.id)) {
      updatedMeetings.push({ id: meeting.id, rating, feedback });
    }
    localStorage.setItem('pastMeetings', JSON.stringify(updatedMeetings));
    
    setIsRatingModalOpen(false);
  };

  const handleBackToMeetings = () => {
    // Navigate to meetings page with past tab active
    navigate('/dashboard/user/meetings');
  };

  if (isLoading || loading) {
    return <Spinner />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Meeting</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => navigate('/dashboard/user/meetings')}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            Back to Meetings
          </button>
        </div>
      </div>
    );
  }

  if (!meeting) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Meeting Not Found</h2>
          <p className="text-gray-600 mb-4">The meeting you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/dashboard/user/meetings')}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            Back to Meetings
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-4 lg:p-8 flex flex-col lg:flex-row max-w-7xl mx-auto">
        {/* Main content */}
        <div className="flex-1">
          <div className="flex items-center mb-6">
            <button
              onClick={handleBackToMeetings}
              className="flex items-center text-gray-600 hover:text-gray-800"
            >
              <AiOutlineArrowLeft className="w-5 h-5 mr-2" />
              Back to Meetings
            </button>
          </div>

          {/* Meeting Info Card */}
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{meeting.serviceName || 'Meeting Details'}</h1>
                <p className="text-lg text-gray-600">With: {meeting.expertName || 'Expert'}</p>
              </div>
              <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                Completed
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-gray-600">
              <div className="flex items-center">
                <AiOutlineCalendar className="w-5 h-5 mr-2 text-green-600" />
                {meeting.daySpecific?.date ? new Date(meeting.daySpecific.date).toLocaleDateString() : 'Date not available'}
              </div>
              <div className="flex items-center">
                <AiOutlineClockCircle className="w-5 h-5 mr-2 text-green-600" />
                {meeting.daySpecific?.slot ? `${meeting.daySpecific.slot.startTime} - ${meeting.daySpecific.slot.endTime}` : 'Time not available'}
              </div>
              <div className="flex items-center">
                <AiOutlineUser className="w-5 h-5 mr-2 text-green-600" />
                User: {meeting.userName || 'User'}
              </div>
            </div>
          </div>

          {/* Rating Section */}
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">Your Rating</h2>
            {rating > 0 ? (
              <div className="flex items-center space-x-2">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <AiFillStar
                      key={star}
                      className={`w-5 h-5 ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
                <span className="text-gray-600">{rating}/5</span>
                {feedback && (
                  <p className="text-gray-600 mt-2">"{feedback}"</p>
                )}
                <button
                  onClick={() => setIsRatingModalOpen(true)}
                  className="ml-4 text-green-600 hover:text-green-700"
                >
                  Edit Rating
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsRatingModalOpen(true)}
                className="flex items-center space-x-2 text-green-600 hover:text-green-700"
              >
                <AiOutlineStar className="w-5 h-5" />
                <span>Rate this meeting</span>
              </button>
            )}
          </div>

          {/* Meeting Details */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Meeting Details</h2>
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="text-gray-500 hover:text-gray-700"
              >
                {showDetails ? <AiOutlineUp className="w-5 h-5" /> : <AiOutlineDown className="w-5 h-5" />}
              </button>
            </div>
            
            {showDetails && (
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Service Description</h3>
                  <p className="text-gray-600">{meeting.message || 'No description available'}</p>
                </div>
                
                {meeting.amount && (
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Amount Paid</h3>
                    <p className="text-gray-600">₹{meeting.amount}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Rating Modal */}
      {isRatingModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96 mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Rate Your Meeting</h3>
              <button
                onClick={() => setIsRatingModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <IoClose className="w-5 h-5" />
              </button>
            </div>

            <div className="flex space-x-1 mb-4 justify-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className="text-2xl focus:outline-none"
                >
                  {star <= rating ? (
                    <AiFillStar className="text-yellow-400" />
                  ) : (
                    <AiOutlineStar className="text-gray-300 hover:text-yellow-400" />
                  )}
                </button>
              ))}
            </div>

            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Share your feedback about this meeting..."
              className="w-full p-3 border border-gray-200 rounded-lg mb-4 h-24 resize-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />

            <div className="flex space-x-3">
              <button
                onClick={() => setIsRatingModalOpen(false)}
                className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitRating}
                className="flex-1 py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700"
                disabled={rating === 0}
              >
                Submit Rating
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Popup */}
      {showPopup && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white p-4 rounded-lg shadow-lg z-50">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">Rating submitted successfully!</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}