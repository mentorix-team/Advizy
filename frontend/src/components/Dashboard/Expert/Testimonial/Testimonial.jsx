import React, { useState, useMemo, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getfeedbackbyexpertid } from '@/Redux/Slices/meetingSlice';
import TestimonialCard from './components/TestimonialCard';
import StarRating from './components/StarRating';

function Testimonials() {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('Most Recent');
  const [testimonials, setTestimonials] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const testimonialsPerPage = 5;

  const dispatch = useDispatch();
  const { expertData } = useSelector((state) => state.expert);
  const { feedbackofexpert, loading: feedbackLoading } = useSelector((state) => state.meeting);

  console.log('Expert data:', expertData);
  console.log('Feedback of expert:', feedbackofexpert);
  console.log('Loading state:', loading, feedbackLoading);

  useEffect(() => {
    if (expertData?._id) {
      console.log('Fetching feedback for expert ID:', expertData._id);
      setLoading(true);
      setError(null);
      dispatch(getfeedbackbyexpertid({ id: expertData._id }))
        .unwrap()
        .then(() => {
          setLoading(false);
        })
        .catch((err) => {
          console.error('Error fetching feedback:', err);
          setError('Failed to load testimonials. Please try again.');
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [dispatch, expertData]);

  useEffect(() => {
    if (feedbackofexpert) {
      console.log('Raw feedback data from backend:', feedbackofexpert);
      console.log('Feedback data type:', typeof feedbackofexpert);
      console.log('Feedback data length:', Array.isArray(feedbackofexpert) ? feedbackofexpert.length : 'Not an array');
      
      // Ensure feedbackofexpert is an array
      const feedbackArray = Array.isArray(feedbackofexpert) ? feedbackofexpert : [];
      
      // Map feedback data to match testimonial structure
      const mappedTestimonials = feedbackArray.map((feedback) => ({
        id: feedback._id,
        name: feedback.userName || 'Anonymous User',
        service: feedback.serviceName || 'General Service',
        comment: feedback.feedback || 'No comment provided',
        rating: Number(feedback.rating) || 0,
        date: feedback.createdAt || new Date().toISOString(),
        meetingId: feedback.meeting_id,
        userId: feedback.user_id,
      }));

      console.log('Mapped testimonials:', mappedTestimonials);
      setTestimonials(mappedTestimonials);
      setLoading(false);
    } else {
      console.log('No feedback data received');
      setTestimonials([]);
      setLoading(false);
    }
  }, [feedbackofexpert]);

  // Filter and sort testimonials
  const filteredAndSortedTestimonials = useMemo(() => {
    let filtered = [...testimonials];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((testimonial) =>
        testimonial.name.toLowerCase().includes(query) ||
        testimonial.service.toLowerCase().includes(query) ||
        testimonial.comment.toLowerCase().includes(query)
      );
    }

    switch (sortBy) {
      case 'Most Recent':
        filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
        break;
      case 'Highest Rated':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'Lowest Rated':
        filtered.sort((a, b) => a.rating - b.rating);
        break;
      default:
        break;
    }

    return filtered;
  }, [testimonials, searchQuery, sortBy]);

  // Analytics Data
  const analytics = useMemo(() => {
    const totalReviews = testimonials.length;
    const validRatings = testimonials.filter(t => t.rating > 0);
    const totalRating = validRatings.reduce((sum, t) => sum + t.rating, 0);
    const averageRating = validRatings.length > 0 ? (totalRating / validRatings.length).toFixed(1) : '0.0';

    // Calculate rating distribution (1-5 stars)
    const distribution = Array(5).fill(0);
    validRatings.forEach((t) => {
      if (t.rating >= 1 && t.rating <= 5) {
        distribution[t.rating - 1]++;
      }
    });

    // Create rating distribution for display (5 stars to 1 star)
    const ratingDistribution = distribution.reverse().map((count, index) => ({
      stars: 5 - index,
      count: count,
      percentage: validRatings.length > 0 ? Math.round((count / validRatings.length) * 100) : 0,
      width: validRatings.length > 0 ? `${(count / validRatings.length) * 100}%` : '0%',
    }));

    console.log('Analytics calculated:', {
      totalReviews,
      validRatings: validRatings.length,
      averageRating,
      distribution,
      ratingDistribution
    });

    return {
      totalReviews: `${totalReviews}`,
      validReviews: validRatings.length,
      averageRating: Number(averageRating),
      ratingDistribution,
    };
  }, [testimonials]);

  const handleRespond = (id, response) => {
    setTestimonials(testimonials.map((testimonial) =>
      testimonial.id === id ? { ...testimonial, response, hasResponse: true } : testimonial
    ));
  };

  // Pagination
  const indexOfLastTestimonial = currentPage * testimonialsPerPage;
  const indexOfFirstTestimonial = indexOfLastTestimonial - testimonialsPerPage;
  const currentTestimonials = filteredAndSortedTestimonials.slice(indexOfFirstTestimonial, indexOfLastTestimonial);
  const totalPages = Math.ceil(filteredAndSortedTestimonials.length / testimonialsPerPage);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Loading state
  if (loading || feedbackLoading) {
    console.log('Component is in loading state:', { loading, feedbackLoading });
    return (
      <div className="min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-gray-900 mb-12">Testimonials</h1>
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading testimonials...</p>
              <p className="text-sm text-gray-500 mt-2">
                Local loading: {loading ? 'true' : 'false'}, Redux loading: {feedbackLoading ? 'true' : 'false'}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    console.log('Component is in error state:', error);
    return (
      <div className="min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-gray-900 mb-12">Testimonials</h1>
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="text-red-500 text-xl mb-4">⚠️</div>
              <p className="text-gray-600 mb-4">{error}</p>
              <button
                onClick={() => {
                  setError(null);
                  setLoading(true);
                  if (expertData?._id) {
                    dispatch(getfeedbackbyexpertid({ id: expertData._id }));
                  }
                }}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900">Testimonials</h1>
          <button
            onClick={() => {
              if (expertData?._id) {
                setLoading(true);
                dispatch(getfeedbackbyexpertid({ id: expertData._id }));
              }
            }}
            className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Refresh</span>
          </button>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-8 rounded-xl border">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Total Reviews</h2>
            <div className="flex items-center gap-3">
              <span className="text-4xl font-bold text-gray-900">{analytics.totalReviews}</span>
            </div>
            <p className="text-gray-600 text-xs md:text-sm mt-2">
              {analytics.validReviews} reviews with ratings
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl border">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Average Rating</h2>
            <div className="flex items-center gap-3">
              <span className="text-4xl font-bold text-gray-900">{analytics.averageRating}</span>
              <StarRating rating={analytics.averageRating} size="lg" />
            </div>
            <p className="text-gray-600 text-xs md:text-sm mt-2">
              Based on {analytics.validReviews} rated reviews
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl border">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Rating Distribution</h2>
            <div className="space-y-2">
              {analytics.ratingDistribution.map((rating) => (
                <div key={rating.stars} className="flex items-center gap-2">
                  <span className="text-xs md:text-sm text-gray-600 w-3">
                    {rating.stars}
                  </span>
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-300" 
                      style={{ 
                        width: rating.width, 
                        backgroundColor: rating.stars > 3 ? '#10B981' : rating.stars > 2 ? '#FBBF24' : '#EF4444' 
                      }}
                    ></div>
                  </div>
                  <span className="text-xs md:text-sm text-gray-600 w-12">
                    {rating.count} ({rating.percentage}%)
                  </span>
                </div>
              ))}
            </div>
            {analytics.validReviews === 0 && (
              <p className="text-gray-500 text-sm mt-2">No ratings available yet</p>
            )}
          </div>
        </div>
        
        {/* Search and Sort */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <input
            type="text"
            placeholder="Search testimonials..."
            className="w-full px-4 py-2 border rounded-lg"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <select className="px-4 py-2 border rounded-lg" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option>Most Recent</option>
            <option>Highest Rated</option>
            <option>Lowest Rated</option>
          </select>
        </div>

        {/* Testimonials List */}
        <div className="bg-white rounded-xl shadow-sm divide-y divide-gray-200">
          {console.log('Rendering testimonials. Current testimonials:', currentTestimonials.length, 'Total filtered:', filteredAndSortedTestimonials.length, 'All testimonials:', testimonials.length)}
          {currentTestimonials.length > 0 ? currentTestimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} onRespond={handleRespond} />
          )) : (
            <div className="p-6 text-center text-gray-500">
              {filteredAndSortedTestimonials.length === 0 ? 
                'No testimonials available yet. Your ratings will appear here once customers provide feedback.' :
                'No testimonials match your search criteria.'
              }
              <div className="mt-4 text-sm text-gray-400">
                Debug: testimonials={testimonials.length}, filtered={filteredAndSortedTestimonials.length}, current={currentTestimonials.length}
              </div>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-8">
            <div className="flex space-x-2">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => paginate(i + 1)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    currentPage === i + 1
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Testimonials;
