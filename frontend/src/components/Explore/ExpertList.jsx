import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import ExpertCard from "./ExpertCard";
import ExpertCardSkeleton from "../LoadingSkeleton/ExpertCardSkeleton";
import { getAllExperts } from "@/Redux/Slices/expert.Slice";

const ITEMS_PER_PAGE = 14;

const ExpertList = ({ filters, sorting }) => {
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);

  const { expertsData, loading, error } = useSelector((state) => ({
    expertsData: state.expert.experts,
    loading: state.expert.loading,
    error: state.expert.error,
  }));

  const experts = expertsData?.experts || [];
  const totalExperts = experts.length;
  const totalPages = Math.ceil(totalExperts / ITEMS_PER_PAGE);

  // Calculate the slice of experts to display for the current page
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedExperts = experts.slice(startIndex, endIndex);

  useEffect(() => {
    // Construct query parameters
    const queryParams = {
      domain: filters.selectedDomain?.value || "",
      niches: filters.selectedNiches || [],
      priceMin: filters.priceRange?.[0] || 200,
      priceMax: filters.priceRange?.[1] || 100000,
      languages: filters.selectedLanguages || [],
      ratings: filters.selectedRatings || [],
      durations: filters.selectedDurations || [],
      sorting: sorting || "",
    };

    // Clean up query parameters: remove empty arrays and empty strings
    const cleanedQueryParams = Object.fromEntries(
      Object.entries(queryParams).filter(([key, value]) => {
        if (Array.isArray(value)) {
          return value.length > 0;
        }
        return value !== "";
      })
    );

    dispatch(getAllExperts(cleanedQueryParams));
  }, [dispatch, filters, sorting]);

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="container mx-auto p-6">
      {/* Available Experts Header */}
      <div className="flex justify-center items-center py-4">
        <h2 className="text-xl font-semibold">
          Available Experts -{" "}
          <span className="text-green-600 underline">{totalExperts}</span>
        </h2>
      </div>

      {/* Expert Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading && (
          <>
            {[...Array(10)].map((_, index) => (
              <div key={index} className="flex justify-center">
                <ExpertCardSkeleton />
              </div>
            ))}
          </>
        )}

        {error && (
          <div className="col-span-2 flex justify-center items-center py-8">
            <p className="text-lg text-red-500">Error: {error}</p>
          </div>
        )}

        {!loading && !error && paginatedExperts.length === 0 && (
          <div className="col-span-2 flex justify-center items-center py-8">
            <p className="text-lg">No experts found</p>
          </div>
        )}

        {!loading &&
          !error &&
          paginatedExperts.map((expert) => (
            <div key={expert._id} className="flex justify-center">
              <ExpertCard
                id={expert._id}
                name={`${expert.firstName} ${expert.lastName}`}
                image={
                  expert?.profileImage?.secure_url ||
                  "https://via.placeholder.com/100"
                }
                title={expert.credentials?.domain || "No Title Provided"}
                rating={
                  expert.reviews?.length > 0
                    ? expert.reviews.reduce(
                        (acc, review) => acc + review.rating,
                        0
                      ) / expert.reviews.length
                    : 0
                }
                totalRatings={expert.reviews?.length || 0}
                experience={`${
                  expert.credentials?.work_experiences?.[0]
                    ?.years_of_experience || 0
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
            </div>
          ))}
      </div>

      {/* Pagination - Always Visible */}
      <div className="mt-8 pt-4 flex items-center justify-between border-t border-gray-200">
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
                {Math.min(startIndex + 1, totalExperts)}
              </span>{" "}
              to{" "}
              <span className="font-medium">
                {Math.min(endIndex, totalExperts)}
              </span>{" "}
              of <span className="font-medium">{totalExperts}</span> results
            </p>
          </div>
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
  );
};

export default ExpertList;