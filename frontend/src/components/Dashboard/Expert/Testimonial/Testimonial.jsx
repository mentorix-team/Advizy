import React, { useState, useMemo } from 'react';
import { testimonialStats, testimonialsList as initialTestimonials } from './data/testimonials';
import TestimonialCard from './components/TestimonialCard';
import StarRating from './components/StarRating';

function Testimonials() {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('Most Recent');
  const [testimonials, setTestimonials] = useState(initialTestimonials);
  const [currentPage, setCurrentPage] = useState(1);
  const testimonialsPerPage = 5;

  // Filter and sort testimonials
  const filteredAndSortedTestimonials = useMemo(() => {
    let filtered = [...testimonials];
    
    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(testimonial => 
        testimonial.name.toLowerCase().includes(query) ||
        testimonial.service.toLowerCase().includes(query) ||
        testimonial.comment.toLowerCase().includes(query)
      );
    }

    // Apply sorting
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

  // Calculate analytics data
  const analytics = useMemo(() => {
    const totalReviews = testimonials.length;
    const totalRating = testimonials.reduce((sum, t) => sum + t.rating, 0);
    const averageRating = totalReviews > 0 ? (totalRating / totalReviews).toFixed(1) : '0.0';

    // Calculate growth percentage
    const previousYearReviews = 8;
    const growthPercentage = Math.round(((totalReviews - previousYearReviews) / previousYearReviews) * 100);

    // Calculate rating distribution
    const distribution = Array(5).fill(0);
    testimonials.forEach(t => {
      if (t.rating && t.rating > 0 && t.rating <= 5) {
        distribution[t.rating - 1]++;
      }
    });
    
    const ratingDistribution = distribution.reverse().map((count, index) => ({
      stars: 5 - index,
      percentage: count.toString(),
      width: totalReviews > 0 ? `${(count / totalReviews) * 100}%` : '0%'
    }));

    return {
      totalReviews: `${totalReviews}.0k`,
      growthPercentage,
      growthText: "Growth in reviews on this year",
      averageRating: Number(averageRating),
      ratingPeriod: "Average rating on this year",
      ratingDistribution
    };
  }, [testimonials]);

  const handleRespond = (id, response) => {
    setTestimonials(testimonials.map(testimonial => 
      testimonial.id === id
        ? { ...testimonial, response, hasResponse: true }
        : testimonial
    ));
  };

  // Get current testimonials for pagination
  const indexOfLastTestimonial = currentPage * testimonialsPerPage;
  const indexOfFirstTestimonial = indexOfLastTestimonial - testimonialsPerPage;
  const currentTestimonials = filteredAndSortedTestimonials.slice(indexOfFirstTestimonial, indexOfLastTestimonial);

  // Reset to first page when search or sort changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, sortBy]);

  // Update pagination when filtered results change
  const totalPages = Math.ceil(filteredAndSortedTestimonials.length / testimonialsPerPage);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-12">Testimonials</h1>
        
        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Total Reviews */}
          <div className="bg-white p-8 rounded-xl border">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Total Reviews</h2>
            <div className="flex items-center gap-3">
              <span className="text-4xl font-bold text-gray-900">{analytics.totalReviews}</span>
              <span className="px-2 py-1 text-sm font-medium text-green-700 bg-green-100 rounded">
                {analytics.growthPercentage}% ↑
              </span>
            </div>
            <p className="text-gray-600 text-sm mt-2">{analytics.growthText}</p>
          </div>
          
          {/* Average Rating */}
          <div className="bg-white p-8 rounded-xl border">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Average Rating</h2>
            <div className="flex items-center gap-3">
              <span className="text-4xl font-bold text-gray-900">{analytics.averageRating}</span>
              <StarRating rating={analytics.averageRating} size="lg" />
            </div>
            <p className="text-gray-600 text-sm mt-2">{analytics.ratingPeriod}</p>
          </div>
          
          {/* Rating Distribution */}
          <div className="bg-white p-8 rounded-xl border">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Rating Distribution</h2>
            <div className="space-y-2">
              {analytics.ratingDistribution.map((rating) => (
                <div key={rating.stars} className="flex items-center gap-2">
                  <span className="text-sm text-gray-600 w-3">{rating.stars}</span>
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: rating.width,
                        backgroundColor: rating.stars > 3 ? '#10B981' : rating.stars > 2 ? '#FBBF24' : '#EF4444'
                      }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600 w-12">{rating.percentage}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Search and Sort */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search testimonials..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <select
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option>Most Recent</option>
            <option>Highest Rated</option>
            <option>Lowest Rated</option>
          </select>
        </div>

        {/* Testimonials List */}
        <div className="bg-white rounded-xl shadow-sm divide-y divide-gray-200">
          {currentTestimonials.length > 0 ? (
            currentTestimonials.map((testimonial) => (
              <TestimonialCard
                key={testimonial.id}
                testimonial={testimonial}
                onRespond={handleRespond}
              />
            ))
          ) : (
            <div className="p-6 text-center text-gray-500">
              No testimonials found matching your search criteria.
            </div>
          )}
        </div>

        {/* Pagination */}
        {filteredAndSortedTestimonials.length > testimonialsPerPage && (
          <div className="mt-8 flex justify-center">
            <nav className="flex items-center gap-2">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }).map((_, index) => (
                <button
                  key={index + 1}
                  onClick={() => paginate(index + 1)}
                  className={`px-3 py-1 rounded-lg border ${
                    currentPage === index + 1
                      ? 'bg-green-500 text-white border-green-500'
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
}

export default Testimonials;