import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { AiOutlineUser, AiOutlineCalendar, AiOutlineClockCircle, AiFillStar, AiOutlineArrowLeft, AiOutlineUp, AiOutlineDown, AiOutlineStar } from 'react-icons/ai';
import { BiDownload } from 'react-icons/bi';
import { BsChatDots } from 'react-icons/bs';
import { IoClose } from 'react-icons/io5';

export default function PastMeetingDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  const [meeting, setMeeting] = useState(null);
  const [showDetails, setShowDetails] = useState(true);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    // Get saved ratings from localStorage
    const savedMeetings = JSON.parse(localStorage.getItem('pastMeetings') || '[]');
    
    // Find the meeting in past meetings
    const pastMeetings = [
      {
        id: 9,
        type: '1-on-1 Call',
        title: 'Legal Consultation',
        status: 'Completed',
        with: 'Atty. Sarah Thompson',
        date: '15 Jan, 2024',
        time: '11:00 AM - 11:45 AM',
        rating: null,
        feedback: '',
        description: 'Legal consultation session to discuss contract review and business regulations.',
        price: 150,
        expert: {
          name: 'Atty. Sarah Thompson',
          role: 'Corporate Lawyer',
          rating: '4.9 (50+ reviews)'
        },
        features: [
          'Contract Review',
          'Legal Advice',
          'Document Analysis',
          'Compliance Guidance'
        ]
      },
      {
        id: 10,
        type: '1-on-1 Call',
        title: 'Fitness Assessment',
        status: 'Completed',
        with: 'Coach David Wilson',
        date: '14 Jan, 2024',
        time: '2:00 PM - 2:30 PM',
        rating: null,
        feedback: '',
        description: 'Comprehensive fitness assessment and personalized workout planning session.',
        price: 80,
        expert: {
          name: 'Coach David Wilson',
          role: 'Certified Fitness Trainer',
          rating: '4.8 (40+ reviews)'
        },
        features: [
          'Fitness Assessment',
          'Workout Planning',
          'Nutrition Guidance',
          'Progress Tracking'
        ]
      }
    ];

    let meetingData = pastMeetings.find(m => m.id === Number(id));
    if (!meetingData) {
      navigate('/meetings');
      return;
    }

    // Check if there's a saved rating for this meeting
    const savedMeeting = savedMeetings.find(m => m.id === Number(id));
    if (savedMeeting) {
      meetingData = { ...meetingData, ...savedMeeting };
    }

    setMeeting(meetingData);
  }, [id, navigate]);

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

  if (!meeting) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-4 lg:p-8 flex flex-col lg:flex-row max-w-7xl mx-auto">
        {/* Main content */}
        <div className="flex-1">
          <div className="flex items-center mb-6">
            <button
              onClick={handleBackToMeetings}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <AiOutlineArrowLeft className="w-5 h-5 mr-2" />
              Back to Meetings
            </button>
          </div>
          
          <div className="bg-white rounded-lg p-4 md:p-6 shadow-sm">
            {/* Meeting Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start gap-2 mb-6">
              <div>
                <h2 className="text-lg md:text-xl text-green-600">{meeting.type}</h2>
                <p className="text-gray-600 mt-1 text-sm md:text-base">{meeting.title}</p>
              </div>
              <span className="px-3 py-1 bg-gray-50 text-gray-600 rounded-full text-sm whitespace-nowrap">
                {meeting.status}
              </span>
            </div>

            {/* Expert Info */}
            <div className="flex flex-col sm:flex-row items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center shrink-0">
                <AiOutlineUser className="w-6 h-6 text-green-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-center">
                  <h3 className="text-lg font-medium">{meeting.expert.name}</h3>
                </div>
                <p className="text-gray-500 text-sm">{meeting.expert.role}</p>
                <div className="flex items-center mt-1">
                  <span className="text-gray-600">{meeting.expert.rating}</span>
                </div>
              </div>
              <button 
                onClick={handleShowPopup}
                className="flex items-center space-x-2 text-gray-700 border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50"
              >
                <BsChatDots className="w-5 h-5" />
                <span className="text-sm">Chat with Expert</span>
              </button>
            </div>

            {/* Meeting Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center text-gray-600 mb-2">
                  <AiOutlineCalendar className="w-5 h-5 mr-2 text-green-600" />
                  <span className="text-sm">Date</span>
                </div>
                <p className="text-gray-900 font-medium">{meeting.date}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center text-gray-600 mb-2">
                  <AiOutlineClockCircle className="w-5 h-5 mr-2 text-green-600" />
                  <span className="text-sm">Time Slot</span>
                </div>
                <p className="text-gray-900 font-medium">{meeting.time}</p>
              </div>
            </div>

            {/* Price Section */}
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div>
                  <div className="flex items-center text-gray-600 mb-1">
                    <span className="text-xl">$</span>
                    <span className="ml-2 text-sm">Price</span>
                  </div>
                  <p className="text-2xl font-medium">${meeting.price}</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  {/* <button className="text-green-600 hover:text-green-700 border border-gray-200 px-4 py-2 rounded-lg text-sm">
                    Order Summary
                  </button> */}
                  <button className="text-green-600 hover:text-green-700 flex items-center justify-center border border-gray-200 px-4 py-2 rounded-lg text-sm">
                    <BiDownload className="w-5 h-5 mr-1" />
                    Download Invoice
                  </button>
                </div>
              </div>
            </div>

            {/* Description Section */}
            <div>
              <div className="flex items-center justify-between cursor-pointer" onClick={() => setShowDetails(!showDetails)}>
                <h3 className="text-lg font-medium">Service Description & Features</h3>
                <button className="text-gray-500 hover:text-gray-700">
                  {showDetails ? <AiOutlineUp className="w-5 h-5" /> : <AiOutlineDown className="w-5 h-5" />}
                </button>
              </div>
              {showDetails && (
                <div className="mt-4">
                  <p className="text-gray-600 text-sm md:text-base mb-4">{meeting.description}</p>
                  <h4 className="font-medium mb-2 text-sm md:text-base">Features included:</h4>
                  <ul className="text-gray-600 space-y-2">
                    {meeting.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-sm md:text-base">
                        <span className="w-1.5 h-1.5 bg-gray-600 rounded-full mr-2"></span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Rating and Feedback Section */}
            {(meeting.rating || meeting.feedback) && (
              <div className="border-t pt-6 mt-6">
                <h3 className="text-lg font-medium mb-4">Your Rating and Feedback</h3>
                {meeting.rating && (
                  <div className="flex items-center mb-3">
                    {[...Array(5)].map((_, index) => (
                      <AiFillStar
                        key={index}
                        className={`w-6 h-6 ${
                          index < meeting.rating ? 'text-yellow-400' : 'text-gray-200'
                        }`}
                      />
                    ))}
                    <span className="ml-2 text-gray-600">{meeting.rating}/5</span>
                  </div>
                )}
                {meeting.feedback && (
                  <p className="text-gray-600 italic">"{meeting.feedback}"</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right sidebar */}
        <div className="hidden lg:block lg:w-80 lg:ml-8">
          <div className="space-y-6 sticky top-8">
            {!meeting.rating && (
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <button 
                  onClick={() => setIsRatingModalOpen(true)}
                  className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
                >
                  <AiOutlineStar className="w-5 h-5" />
                  Add Rating
                </button>
              </div>
            )}

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-medium mb-2">Need Help?</h3>
              <p className="text-gray-600 text-sm mb-4">
                If you have any questions or need assistance, our support team is here to help.
              </p>
              <button 
                onClick={handleShowPopup}
                className="w-full py-2 px-4 text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Rating Modal */}
      {isRatingModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Rate Your Meeting</h3>
              <button
                onClick={() => setIsRatingModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <IoClose className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex space-x-1 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className="text-2xl"
                >
                  {star <= rating ? (
                    <AiFillStar className="text-yellow-400" />
                  ) : (
                    <AiOutlineStar className="text-gray-300" />
                  )}
                </button>
              ))}
            </div>

            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Share your feedback..."
              className="w-full p-2 border border-gray-200 rounded-lg mb-4 h-32 resize-none"
            />

            <button
              onClick={handleSubmitRating}
              className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Submit Feedback
            </button>
          </div>
        </div>
      )}

      {/* Coming Soon Popup */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"></div>
          <div className="bg-white rounded-lg p-6 shadow-xl relative z-10 w-full max-w-md transform transition-all animate-fade-in">
            <div className="absolute top-4 right-4">
              <button 
                onClick={() => setShowPopup(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <IoClose className="w-6 h-6" />
              </button>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <BsChatDots className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Coming Soon!</h3>
              <p className="text-gray-600">
                We're working hard to bring you this feature. Stay tuned for updates!
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}