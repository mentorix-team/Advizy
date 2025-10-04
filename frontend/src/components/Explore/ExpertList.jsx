import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import ExpertCard from "./ExpertCard";
import ExpertCardSkeleton from "../LoadingSkeleton/ExpertCardSkeleton";
import NoExpertsFound from "./NoExpertsFound";
import { getAllExperts } from "@/Redux/Slices/expert.Slice";
import { SearchX, ChevronLeft, ChevronRight } from "lucide-react";

const ITEMS_PER_PAGE = 8; // 4 rows × 2 columns

const ExpertList = ({ filters, sorting }) => {
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const prevFiltersRef = useRef();

  const { expertsData, loading, error } = useSelector((state) => ({
    expertsData: state.expert.experts,
    loading: state.expert.loading,
    error: state.expert.error,
  }));

  const experts = expertsData || [];
  const totalExperts = experts.length;
  const totalPages = Math.ceil(totalExperts / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedExperts = experts.slice(startIndex, endIndex);

  useEffect(() => {
    if (!filters.selectedDomain) return; //don't dispatch if domain isn't ready
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
    const cleanedQueryParams = Object.fromEntries(
      Object.entries(queryParams).filter(([key, value]) => {
        if (Array.isArray(value)) {
          return value.length > 0;
        }
        return value !== "";
      })
    );
    dispatch(getAllExperts(cleanedQueryParams));
    prevFiltersRef.current = filters;
    setCurrentPage(1);
  }, [dispatch, filters, sorting]);

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const calculateTotalExperience = (workExperiences) => {
    if (!Array.isArray(workExperiences) || workExperiences.length === 0)
      return "0 years";
    let totalMonths = 0;
    workExperiences.forEach((job) => {
      if (!job.startDate || !job.endDate) return;
      const start = new Date(job.startDate);
      const end = new Date(job.endDate);
      const yearsDiff = end.getFullYear() - start.getFullYear();
      const monthsDiff = end.getMonth() - start.getMonth();
      totalMonths += yearsDiff * 12 + monthsDiff;
    });
    const years = Math.floor(totalMonths / 12);
    const months = totalMonths % 12;
    return years > 0 ? `${years} years ${months} months` : `${months} months`;
  };

  return (
    <div className="w-full max-w-[1440px] mx-auto py-4 px-4 sm:px-6 sm:py-4">
      {/* Available Experts Header */}
      <div className="mb-4">
        <h2 className="text-lg sm:text-xl md:text-2xl font-medium italic tracking-tighter">
          Available Experts -{" "}
          <span className="text-green-600 underline">{totalExperts}</span>
        </h2>
      </div>

      {/* Expert Cards Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 mb-6">
        {loading && (
          <>
            {[...Array(ITEMS_PER_PAGE)].map((_, index) => (
              <div key={index} className="w-full h-full">
                <ExpertCardSkeleton className="h-full" />
              </div>
            ))}
          </>
        )}

        {error && (
          <div className="col-span-1 md:col-span-2 2xl:col-span-2 flex flex-col items-center justify-center py-8 px-4 text-center">
            <p className="text-base sm:text-lg text-red-500 mt-2">
              Error: {error}
            </p>
          </div>
        )}

        {!loading && !error && paginatedExperts.length === 0 && (
          <div className=" col-span-2 max-h-full flex items-center justify-center">
            <NoExpertsFound />
          </div>
        )}

        {!loading && !error && paginatedExperts.map((expert) => {
          const mentoringService = expert.credentials?.services?.find(
            (service) => service.title === "One-on-One Mentoring"
          );
          const firstEnabledSlot = mentoringService?.one_on_one?.find(
            (slot) => slot.enabled
          );
          const startingPrice = firstEnabledSlot?.price || 0;
          const duration = firstEnabledSlot?.duration || "N/A";
          const totalExperience = calculateTotalExperience(
            expert.credentials?.work_experiences
          );

          return (
            <div key={expert._id} className="w-full h-full">
              <ExpertCard
                className="h-full"
                id={expert._id}
                redirect_url={expert.redirect_url}
                name={`${expert.firstName} ${expert.lastName}`}
                verified={expert.admin_approved_expert}
                image={
                  expert?.profileImage?.secure_url ||
                  "https://via.placeholder.com/100"
                }
                title={
                  expert.credentials?.professionalTitle?.[0] ||
                  "No Title Provided"
                }
                rating={
                  expert.reviews?.length > 0
                    ? Math.round(
                      expert.reviews.reduce(
                        (acc, review) => acc + review.rating,
                        0
                      ) / expert.reviews.length
                    )
                    : 0
                }
                totalRatings={expert.sessions?.length || 0}
                experience={expert?.credentials?.experienceYears}
                languages={expert.languages || []}
                startingPrice={startingPrice}
                duration={duration}
                expertise={expert.credentials?.skills || []}
              />
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      {totalPages > 0 && (
        <div className="mt-6 sm:mt-8 pt-4 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="w-full sm:w-auto order-2 sm:order-1">
              <p className="text-sm text-gray-700 text-center sm:text-left">
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
            <div className="flex items-center justify-center gap-2 order-1 sm:order-2">
              <button
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                className={`inline-flex items-center justify-center p-2 rounded-md border ${currentPage === 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white text-gray-700 hover:bg-gray-50 active:bg-gray-100"
                  } transition-colors duration-200`}
                aria-label="Previous page"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {/* Page Numbers */}
              <div className="flex items-center space-x-1">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-8 h-8 flex items-center justify-center rounded-md text-sm font-medium ${currentPage === i + 1
                      ? "bg-primary text-white"
                      : "bg-white text-gray-700 hover:bg-gray-50"
                      }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className={`inline-flex items-center justify-center p-2 rounded-md border ${currentPage === totalPages
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white text-gray-700 hover:bg-gray-50 active:bg-gray-100"
                  } transition-colors duration-200`}
                aria-label="Next page"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpertList;