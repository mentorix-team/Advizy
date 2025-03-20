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
  const testimonialsPerPage = 5;

  const dispatch = useDispatch();
  const { expertData } = useSelector((state) => state.expert);
  const { feedbackofexpert } = useSelector((state) => state.meeting);

  useEffect(() => {
    if (expertData?._id) {
      dispatch(getfeedbackbyexpertid(expertData._id));
    }
  }, [dispatch, expertData]);

  useEffect(() => {
    if (feedbackofexpert) {
      // Map feedback data to match testimonial structure
      const mappedTestimonials = feedbackofexpert.map((feedback) => ({
        id: feedback._id,
        name: feedback.userName,
        service: feedback.serviceName,
        comment: feedback.feedback,
        rating: Number(feedback.rating),
        date: new Date().toISOString(), // Assuming no date is provided, using current date
      }));

      setTestimonials(mappedTestimonials);
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
    const totalRating = testimonials.reduce((sum, t) => sum + t.rating, 0);
    const averageRating = totalReviews > 0 ? (totalRating / totalReviews).toFixed(1) : '0.0';

    const previousYearReviews = 8;
    const growthPercentage = Math.round(((totalReviews - previousYearReviews) / previousYearReviews) * 100);

    const distribution = Array(5).fill(0);
    testimonials.forEach((t) => {
      if (t.rating && t.rating > 0 && t.rating <= 5) {
        distribution[t.rating - 1]++;
      }
    });

    const ratingDistribution = distribution.reverse().map((count, index) => ({
      stars: 5 - index,
      percentage: count.toString(),
      width: totalReviews > 0 ? `${(count / totalReviews) * 100}%` : '0%',
    }));

    return {
      totalReviews: `${totalReviews}`,
      growthPercentage,
      growthText: 'Growth in reviews on this year',
      averageRating: Number(averageRating),
      ratingPeriod: 'Average rating on this year',
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

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-12">Testimonials</h1>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-8 rounded-xl border">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Total Reviews</h2>
            <div className="flex items-center gap-3">
              <span className="text-4xl font-bold text-gray-900">{analytics.totalReviews}</span>
            </div>
            <p className="text-gray-600 text-xs md:text-sm mt-2">
              {analytics.growthText}
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl border">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Average Rating</h2>
            <div className="flex items-center gap-3">
              <span className="text-4xl font-bold text-gray-900">{analytics.averageRating}</span>
              <StarRating rating={analytics.averageRating} size="lg" />
            </div>
            <p className="text-gray-600 text-xs md:text-sm mt-2">
              {analytics.ratingPeriod}
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
                    <div className="h-full rounded-full" style={{ width: rating.width, backgroundColor: rating.stars > 3 ? '#10B981' : rating.stars > 2 ? '#FBBF24' : '#EF4444' }}></div>
                  </div>
                  <span className="text-xs md:text-sm text-gray-600 w-12">
                    {rating.percentage}
                  </span>
                </div>
              ))}
            </div>
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
          {currentTestimonials.length > 0 ? currentTestimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} onRespond={handleRespond} />
          )) : (
            <div className="p-6 text-center text-gray-500">No testimonials found.</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Testimonials;
