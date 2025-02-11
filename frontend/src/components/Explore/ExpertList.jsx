import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import ExpertCard from "./ExpertCard";
import { getAllExperts } from "@/Redux/Slices/expert.Slice";

const ITEMS_PER_PAGE = 10;

const ExpertList = ({ filters, sorting }) => {
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);

  const { expertsData, loading, error } = useSelector((state) => ({
    expertsData: state.expert.experts,
    loading: state.expert.loading,
    error: state.expert.error,
  }));

  const experts = expertsData?.experts || [];
  const totalExperts = expertsData?.totalExperts || 0;
  const totalPages = Math.ceil(totalExperts / ITEMS_PER_PAGE);

  useEffect(() => {
    const queryParams = {
      domain: filters.selectedDomain?.value || "",
      niches: filters.selectedNiches || [],
      priceMin: filters.priceRange?.[0] || 200,
      priceMax: filters.priceRange?.[1] || 100000,
      languages: filters.selectedLanguages || [],
      ratings: filters.selectedRatings || [],
      durations: filters.selectedDurations || [],
      sorting: sorting || "",
      page: currentPage,
      limit: ITEMS_PER_PAGE,
    };
  
    dispatch(getAllExperts(queryParams));
  }, [dispatch, filters, sorting, currentPage]);

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="container mx-auto px-6 py-8 max-w-7xl">
      {/* Grid Container */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {loading && (
          <div className="col-span-2 flex justify-center items-center py-12">
            <p className="text-lg">Loading experts...</p>
          </div>
        )}
        
        {error && (
          <div className="col-span-2 flex justify-center items-center py-12">
            <p className="text-lg text-red-500">Error: {error}</p>
          </div>
        )}
        
        {!loading && !error && experts.length === 0 && (
          <div className="col-span-2 flex justify-center items-center py-12">
            <p className="text-lg">No experts found</p>
          </div>
        )}

        {!loading &&
          !error &&
          experts.map((expert) => (
            <div key={expert._id} className="flex justify-center">
              <ExpertCard
                key={expert._id}
                id={expert._id}
                name={`${expert.firstName} ${expert.lastName}`}
                image={expert?.profileImage?.secure_url ||
                  "https://via.placeholder.com/100"}
                title={expert.credentials?.domain || "No Title Provided"}
                rating={expert.reviews?.length > 0
                  ? expert.reviews.reduce((acc, review) => acc + review.rating, 0) /
                    expert.reviews.length
                  : 0}
                totalRatings={expert.reviews?.length || 0}
                experience={`${expert.credentials?.work_experiences?.[0]?.years_of_experience || 0} years`}
                languages={expert.languages || []}
                startingPrice={expert.sessions?.[0]?.price || 0}
                duration={expert.sessions?.[0]?.duration || "N/A"}
                expertise={expert.credentials?.expertise || []}
                nextSlot={expert.sessions?.[0]?.next_available_slot || {
                  day: "N/A",
                  time: "N/A",
                }}
              />
            </div>
          ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className={`relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                currentPage === 1
                  ? "text-gray-300 cursor-not-allowed"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              Previous
            </button>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className={`relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                currentPage === totalPages
                  ? "text-gray-300 cursor-not-allowed"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing{" "}
                <span className="font-medium">
                  {Math.min((currentPage - 1) * ITEMS_PER_PAGE + 1, totalExperts)}
                </span>{" "}
                to{" "}
                <span className="font-medium">
                  {Math.min(currentPage * ITEMS_PER_PAGE, totalExperts)}
                </span>{" "}
                of <span className="font-medium">{totalExperts}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <button
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                  className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                    currentPage === 1
                      ? "text-gray-300 cursor-not-allowed"
                      : "text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                    currentPage === totalPages
                      ? "text-gray-300 cursor-not-allowed"
                      : "text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpertList;