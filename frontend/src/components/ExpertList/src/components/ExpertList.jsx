import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getAllExperts } from "@/Redux/Slices/expert.Slice";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ExpertCard from "@/components/Expert/ExpertCard";
import Spinner from "@/components/LoadingSkeleton/Spinner";
const ExpertList = () => {
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const cardsPerPage = 21; // 3 cards per row * 7 rows

  // Access experts and loading state from the Redux store
  const { expertsData, loading, error } = useSelector((state) => ({
    expertsData: state.expert.experts,
    loading: state.expert.loading,
    error: state.expert.error,
  }));

  // Extract experts array from the returned data
  const experts = expertsData?.experts || [];

  // Calculate pagination
  const totalPages = Math.ceil(experts.length / cardsPerPage);
  const indexOfLastCard = currentPage * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  const currentExperts = experts.slice(indexOfFirstCard, indexOfLastCard);

  useEffect(() => {
    dispatch(getAllExperts());
  }, [dispatch]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Generate page numbers array
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      }
    }
    return pageNumbers;
  };

  return (
    <div className="max-w-[1200px] mx-auto px-4">
      {/* Grid Container */}
      <div
        className="grid gap-4 mb-8"
        style={{
          gridTemplateColumns: "repeat(3, 1fr)", // Exactly 3 cards per row
          justifyContent: "center",
        }}
      >
        {loading && <Spinner />}
        {error && <p className="col-span-3 text-center text-red-500">Error: {error}</p>}
        {!loading && !error && experts.length === 0 && (
          <p className="col-span-3 text-center">No experts found</p>
        )}
        {!loading &&
          !error &&
          currentExperts.map((expert) => (
            <ExpertCard
              key={expert._id}
              id={expert._id}
              name={`${expert.firstName} ${expert.lastName}`}
              image={
                expert.credentials?.portfolio?.[0]?.photo?.secure_url ||
                "https://via.placeholder.com/100"
              }
              title={expert.credentials?.domain || "No Title Provided"}
              rating={
                expert.reviews?.length > 0
                  ? expert.reviews.reduce((acc, review) => acc + review.rating, 0) /
                    expert.reviews.length
                  : 0
              }
              totalRatings={expert.reviews?.length || 0}
              experience={`${
                expert.credentials?.work_experiences?.[0]?.years_of_experience || 0
              } years`}
              languages={expert.languages || []}
              startingPrice={expert.sessions?.[0]?.price || 0}
              duration={expert.sessions?.[0]?.duration || "N/A"}
              expertise={expert.credentials?.expertise || []}
              nextSlot={
                expert.sessions?.[0]?.next_available_slot || {
                  day: "N/A",
                  time: "N/A",
                }
              }
            />
          ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 pb-8">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`p-2 rounded-lg ${
              currentPage === 1
                ? "text-gray-400 cursor-not-allowed"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {getPageNumbers().map((number, index) => (
            <button
              key={index}
              onClick={() => number !== '...' && handlePageChange(number)}
              className={`px-4 py-2 rounded-lg ${
                number === currentPage
                  ? "bg-[#16A348] text-white"
                  : number === '...'
                  ? "cursor-default"
                  : "hover:bg-gray-100"
              }`}
              disabled={number === '...'}
            >
              {number}
            </button>
          ))}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`p-2 rounded-lg ${
              currentPage === totalPages
                ? "text-gray-400 cursor-not-allowed"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
};

export default ExpertList;