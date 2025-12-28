import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getMeetingbyid, givefeedback } from '@/Redux/Slices/meetingSlice';
import { AiOutlineUser, AiOutlineCalendar, AiOutlineClockCircle, AiFillStar, AiOutlineArrowLeft, AiOutlineUp, AiOutlineDown, AiOutlineStar } from 'react-icons/ai';
import { BiDownload } from 'react-icons/bi';
import { BsChatDots } from 'react-icons/bs';
import { IoClose } from 'react-icons/io5';
import Spinner from '@/components/LoadingSkeleton/Spinner';
import { getMeetingStatusLabel, getMeetingStatusPillTone } from '@/utils/meetingStatus';

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
  const [error, setError] = useState(null);

  const { meetings, loading, selectedMeeting, error: meetingError } = useSelector((state) => state.meeting);
  const { data: userData } = useSelector((state) => state.auth);

  // console.log('PastMeetingDetails rendered with:', { id, isLoading, loading, selectedMeeting, meetingError, meeting });
  // console.log('About to render main content...');

  useEffect(() => {
    // console.log('Target meeting ID:', id);

    if (id) {
      // console.log('Fetching meeting with ID:', id);
      setError(null);
      dispatch(getMeetingbyid(id))
        .unwrap()
        .then(() => {
          // console.log('Meeting fetch successful');
        })
        .catch((err) => {
          console.error('Error fetching meeting:', err);
          setError('Failed to load meeting details. Please try again.');
          setIsLoading(false);
        });
    } else {
      // console.log('No meeting ID provided');
      setError('No meeting ID provided');
      setIsLoading(false);
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (selectedMeeting) {
      // console.log('Selected meeting from Redux:', selectedMeeting);
      // console.log('Meeting feedback object:', selectedMeeting.feedback);

      if (selectedMeeting.feedback) {
        // console.log('Feedback rating:', selectedMeeting.feedback.rating);
        // console.log('Feedback text:', selectedMeeting.feedback.feedback);
      }

      setMeeting(selectedMeeting);
      setIsLoading(false);

      // Check if rating exists in the meeting data from backend
      if (selectedMeeting.feedback && selectedMeeting.feedback.rating) {
        // console.log('Found existing rating in selected meeting:', selectedMeeting.feedback.rating);
        setRating(parseInt(selectedMeeting.feedback.rating));
        setFeedback(selectedMeeting.feedback.feedback || '');
        // console.log('Set rating state to:', parseInt(selectedMeeting.feedback.rating));
        // console.log('Set feedback state to:', selectedMeeting.feedback.feedback || '');
      } else {
        // console.log('No feedback found in backend data, checking localStorage...');
        // Fallback to localStorage for ratings
        const savedMeetings = JSON.parse(localStorage.getItem('pastMeetings') || '[]');
        const savedMeeting = savedMeetings.find(m => m.id === id);
        if (savedMeeting) {
          // console.log('Found saved meeting in localStorage:', savedMeeting);
          setRating(savedMeeting.rating || 0);
          setFeedback(savedMeeting.feedback || '');
        } else {
          // console.log('No rating data found in localStorage either');
          setRating(0);
          setFeedback('');
        }
      }
    }
  }, [selectedMeeting, id]);

  // Cleanup selectedMeeting when component unmounts
  useEffect(() => {
    return () => {
      // Clear selectedMeeting from Redux state when leaving the component
      // This prevents stale data from affecting other components
    };
  }, []);

  if (isLoading || loading) {
    // console.log('Showing spinner - isLoading:', isLoading, 'loading:', loading);
    return <Spinner />;
  }

  if (error || meetingError) {
    // console.log('Showing error state - error:', error, 'meetingError:', meetingError);
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Meeting</h2>
          <p className="text-gray-600 mb-4">{error || meetingError}</p>
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
    // console.log('No meeting data available');
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Meeting Not Found</h2>
          <p className="text-gray-600 mb-4">The meeting you're looking for could not be found.</p>
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

  const statusLabel = getMeetingStatusLabel(meeting);
  const statusToneClass = getMeetingStatusPillTone(meeting);

  const handleShowPopup = () => {
    setShowPopup(true);
    setTimeout(() => {
      setShowPopup(false);
    }, 3000);
  };

  // const handleDownloadInvoice = () => {
  //   if (!meeting?._id) {
  //     return;
  //   }

  //   navigate(`/dashboard/user/meetings/receipt/${meeting._id}`, {
  //     state: { meeting },
  //   });
  // };

  const handleSubmitRating = async () => {
    if (!rating) {
      alert("Please provide a rating before submitting.");
      return;
    }

    // Parse user data if it's a string
    const user = typeof userData === "string" ? JSON.parse(userData) : userData;

    if (!user || !user._id) {
      alert("User information not available. Please try logging in again.");
      return;
    }

    try {
      const response = await dispatch(
        givefeedback({
          feedback,
          rating,
          user_id: user._id,
          expert_id: meeting.expertId,
          meeting_id: meeting._id,
          userName: meeting.userName,
          expertName: meeting.expertName,
          serviceName: meeting.serviceName,
        })
      );

      // console.log("Feedback Response:", response);

      if (response?.payload?.success) {
        alert("Feedback submitted successfully!");

        // Update the local meeting state to reflect the submitted rating
        const updatedMeeting = { ...meeting, rating, feedback };
        setMeeting(updatedMeeting);

        // Also save to localStorage for local persistence
        const savedMeetings = JSON.parse(localStorage.getItem('pastMeetings') || '[]');
        const updatedMeetings = savedMeetings.map(m =>
          m.id === meeting._id ? { ...m, rating, feedback } : m
        );
        if (!savedMeetings.some(m => m.id === meeting._id)) {
          updatedMeetings.push({ id: meeting._id, rating, feedback });
        }
        localStorage.setItem('pastMeetings', JSON.stringify(updatedMeetings));

        setIsRatingModalOpen(false);
      } else {
        alert("Failed to submit feedback. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
      alert("Something went wrong. Please try again later.");
    }
  };

  const handleBackToMeetings = () => {
    // Navigate to meetings page with past tab active
    navigate('/dashboard/user/meetings');
  };

  if (!meeting) {
    console.log('Meeting is null or undefined');
    return null;
  }

  // console.log('Rendering with meeting data:', meeting);
  // console.log('Meeting object structure:');
  // console.log('- serviceName:', meeting?.serviceName);
  // console.log('- expertName:', meeting?.expertName);
  // console.log('- userName:', meeting?.userName);
  // console.log('- daySpecific:', meeting?.daySpecific);
  // console.log('- amount:', meeting?.amount);
  // console.log('- message:', meeting?.message);

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
                <h2 className="text-lg md:text-xl text-green-600">{meeting.serviceName || 'Meeting'}</h2>
                <p className="text-gray-600 mt-1 text-sm md:text-base">Session Details</p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-sm whitespace-nowrap font-medium capitalize ${statusToneClass}`}
              >
                {statusLabel}
              </span>
            </div>

            {/* Expert Info */}
            <div className="flex flex-col sm:flex-row items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center shrink-0">
                <AiOutlineUser className="w-6 h-6 text-green-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-center">
                  <h3 className="text-lg font-medium">{meeting.expertName || 'Expert'}</h3>
                </div>
                <p className="text-gray-500 text-sm">Expert</p>
                <div className="flex items-center mt-1">
                  <span className="text-gray-600">Professional Consultant</span>
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
                <p className="text-gray-900 font-medium">
                  {meeting.daySpecific?.date ? new Date(meeting.daySpecific.date).toLocaleDateString() : 'Date not available'}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center text-gray-600 mb-2">
                  <AiOutlineClockCircle className="w-5 h-5 mr-2 text-green-600" />
                  <span className="text-sm">Time Slot</span>
                </div>
                <p className="text-gray-900 font-medium">
                  {meeting.daySpecific?.slot ? `${meeting.daySpecific.slot.startTime} - ${meeting.daySpecific.slot.endTime}` : 'Time not available'}
                </p>
              </div>
            </div>

            {/* Price Section */}
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div>
                  <div className="flex items-center text-gray-600 mb-1">
                    <span className="text-xl">₹</span>
                    <span className="ml-2 text-sm">Price</span>
                  </div>
                  <p className="text-2xl font-medium">₹{meeting.amount || 'N/A'}</p>
                </div>
                {/* <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={handleDownloadInvoice}
                    className="text-green-600 hover:text-green-700 flex items-center justify-center border border-gray-200 px-4 py-2 rounded-lg text-sm"
                  >
                    <BiDownload className="w-5 h-5 mr-1" />
                    Download Invoice
                  </button>
                </div> */}
              </div>
            </div>

            {/* Description Section */}
            <div>
              <div className="flex items-center justify-between cursor-pointer" onClick={() => setShowDetails(!showDetails)}>
                <h3 className="text-lg font-medium">Service Description & Details</h3>
                <button className="text-gray-500 hover:text-gray-700">
                  {showDetails ? <AiOutlineUp className="w-5 h-5" /> : <AiOutlineDown className="w-5 h-5" />}
                </button>
              </div>
              {showDetails && (
                <div className="mt-4">
                  <p className="text-gray-600 text-sm md:text-base mb-4">
                    {meeting.serviceName ? `${meeting.serviceName} session completed successfully.` : 'Session completed successfully.'}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-900">User:</span>
                      <span className="ml-2 text-gray-600">{meeting.userName || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-900">Expert:</span>
                      <span className="ml-2 text-gray-600">{meeting.expertName || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-900">Service:</span>
                      <span className="ml-2 text-gray-600">{meeting.serviceName || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-900">Payment Status:</span>
                      <span className="ml-2 text-gray-600">{meeting.isPayed ? 'Paid' : 'Pending Payment'}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-900">Session Status:</span>
                      <span className="ml-2 text-gray-600">{statusLabel}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-900">Payment ID:</span>
                      <span className="ml-2 text-gray-600">{meeting.razorpay_payment_id || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Rating and Feedback Section */}
            {(rating > 0 || feedback) && (
              <div className="border-t pt-6 mt-6">
                <h3 className="text-lg font-medium mb-4">Your Rating and Feedback</h3>
                {rating > 0 && (
                  <div className="flex items-center mb-3">
                    {[...Array(5)].map((_, index) => (
                      <AiFillStar
                        key={index}
                        className={`w-6 h-6 ${index < rating ? 'text-yellow-400' : 'text-gray-200'
                          }`}
                      />
                    ))}
                    <span className="ml-2 text-gray-600">{rating}/5</span>
                  </div>
                )}
                {feedback && (
                  <p className="text-gray-600 italic">"{feedback}"</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right sidebar */}
        <div className="hidden lg:block lg:w-80 lg:ml-8">
          <div className="space-y-6 sticky top-8">
            {rating === 0 && (
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