import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import ExpertCard from "./ExpertCard";
import ExpertCardSkeleton from "../LoadingSkeleton/ExpertCardSkeleton";
import { getAllExperts } from "@/Redux/Slices/expert.Slice";
import { SearchX } from 'lucide-react';

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
  // console.log('This is experts',experts);
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
  const calculateTotalExperience = (workExperiences) => {
    if (!Array.isArray(workExperiences) || workExperiences.length === 0) return "0 years";
  
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
    <div className="mx-auto p-6">
      {/* Available Experts Header */}
      <div className="my-2">
        <h2 className="text-xl font-semibold">
          Available Experts -{" "}
          <span className="text-green-600 underline">{totalExperts}</span>
        </h2>
      </div>

      {/* Expert Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
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
            <SearchX className='w-8 h-8' />
            <p className="text-lg">No experts found</p>
          </div>
        )}

        {!loading &&
          !error &&
          paginatedExperts.map((expert) => {
            const firstService = expert.credentials?.services?.[0];
            const startingPrice = firstService?.price || 0;
            const duration = firstService?.duration || "N/A";

            const totalExperience = calculateTotalExperience(expert.credentials?.work_experiences);
            return (
              <div key={expert._id} className="flex justify-center">
                <ExpertCard
                  id={expert._id}
                  redirect_url={expert.redirect_url}
                  name={`${expert.firstName} ${expert.lastName}`}
                  image={
                    expert?.profileImage?.secure_url ||
                    "https://via.placeholder.com/100"
                  }
                  title={
                    expert.credentials?.professionalTitle?.[0] || "No Title Provided"
                  }
                  rating={
                    expert.reviews?.length > 0
                      ? Math.round(
                          expert.reviews.reduce((acc, review) => acc + review.rating, 0) /
                            expert.reviews.length
                        )
                      : 0
                  }
                  totalRatings={expert.sessions?.length || 0}
                  experience={totalExperience} 
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


// import { useState } from "react";
// import ExpertCard from "./ExpertCard";
// import ExpertCardSkeleton from "../LoadingSkeleton/ExpertCardSkeleton";
// import { SearchX } from "lucide-react";

// const ITEMS_PER_PAGE = 14;

// // Mock data for 8 experts
// const mockExperts = [
//   {
//     _id: "4",
//     firstName: "Anchul",
//     lastName: "Chauhan",
//     profileImage: { secure_url: "https://media.licdn.com/dms/image/v2/D5603AQEx4I-jmEKVmg/profile-displayphoto-shrink_100_100/profile-displayphoto-shrink_100_100/0/1728396717111?e=1744848000&v=beta&t=SgDyZUqxnrqVqvAdRGLBhtSqZz0ud0muh5smTLHNaMQ" },
//     credentials: {
//       domain: "DevOps",
//       expertise: ["Docker", "Kubernetes", "AWS"],
//       work_experiences: [{ years_of_experience: 6 }],
//     },
//     reviews: [
//       { rating: 4 },
//       { rating: 4 },
//       { rating: 4 },
//     ],
//     languages: ["English", "Marathi"],
//     sessions: [
//       { price: 200, duration: "1 hour", next_available_slot: { day: "Thursday", time: "3:00 PM" } },
//     ],
//   },
//   {
//     _id: "3",
//     firstName: "siddhu",
//     lastName: "Achary",
//     profileImage: { secure_url: "https://media.licdn.com/dms/image/v2/D4E03AQH3w-I69HFxMw/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1728409104680?e=1744848000&v=beta&t=cPadY0to755uVLFhKd8RV4RCuvzijKHU38uuE1jG1ME" },
//     credentials: {
//       domain: "software",
//       expertise: ["React", "Mern", "Web developer"],
//       work_experiences: [{ years_of_experience: 3 }],
//     },
//     reviews: [
//       { rating: 5 },
//       { rating: 5 },
//       { rating: 5 },
//     ],
//     languages: ["English", "Hindi"],
//     sessions: [
//       { price: 120, duration: "30 mins", next_available_slot: { day: "Wednesday", time: "11:00 AM" } },
//     ],
//   },
//   {
//     _id: "5",
//     firstName: "Ritesh",
//     lastName: "kolte",
//     profileImage: { secure_url: "https://media.licdn.com/dms/image/v2/D4D03AQErmTlGBHRggw/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1697918726193?e=1744848000&v=beta&t=KiOTHjTdCaXYWR3zvkty3_2jIsjnvwM2znE-hPIubpc" },
//     credentials: {
//       domain: "Mobile Development",
//       expertise: ["Flutter", "React Native", "Swift"],
//       work_experiences: [{ years_of_experience: 4 }],
//     },
//     reviews: [
//       { rating: 5 },
//       { rating: 5 },
//       { rating: 5 },
//     ],
//     languages: ["English", "Marathi"],
//     sessions: [
//       { price: 180, duration: "1 hour", next_available_slot: { day: "Friday", time: "9:00 AM" } },
//     ],
//   },
//   {
//     _id: "6",
//     firstName: "Anand",
//     lastName: "Kumar",
//     profileImage: { secure_url: "https://media.licdn.com/dms/image/v2/D4D35AQEmEXg_kooCJg/profile-framedphoto-shrink_400_400/profile-framedphoto-shrink_400_400/0/1738930810891?e=1740207600&v=beta&t=Sukx4991iS8k4bhX7jZSnPHgNPiRhSsEjSolPJR6u6U" },
//     credentials: {
//       domain: "UI/UX",
//       expertise: ["Figma", "Canva", "Graphic Desinger"],
//       work_experiences: [{ years_of_experience: 8 }],
//     },
//     reviews: [
//       { rating: 5 },
//       { rating: 5 },
//       { rating: 5 },
//     ],
//     languages: ["English", "Hindi"],
//     sessions: [
//       { price: 250, duration: "1 hour", next_available_slot: { day: "Saturday", time: "1:00 PM" } },
//     ],
//   },
//   {
//     _id: "7",
//     firstName: "Raju",
//     lastName: "Mulik",
//     profileImage: { secure_url: "https://via.placeholder.com/100" },
//     credentials: {
//       domain: "Cloud Computing",
//       expertise: ["AWS", "Azure", "Google Cloud"],
//       work_experiences: [{ years_of_experience: 5 }],
//     },
//     reviews: [
//       { rating: 4 },
//       { rating: 4 },
//       { rating: 4 },
//     ],
//     languages: ["English", "Marati"],
//     sessions: [
//       { price: 220, duration: "45 mins", next_available_slot: { day: "Sunday", time: "4:00 PM" } },
//     ],
//   },
//   {
//     _id: "8",
//     firstName: "Grace",
//     lastName: "Harris",
//     profileImage: { secure_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&auto=format&fit=crop&q=80" },
//     credentials: {
//       domain: "Product Management",
//       expertise: ["Agile", "Scrum", "Product Roadmaps"],
//       work_experiences: [{ years_of_experience: 6 }],
//     },
//     reviews: [
//       { rating: 5 },
//       { rating: 5 },
//       { rating: 5 },
//     ],
//     languages: ["English", "French"],
//     sessions: [
//       { price: 170, duration: "30 mins", next_available_slot: { day: "Monday", time: "12:00 PM" } },
//     ],
//   },
//   {
//     _id: "1",
//     firstName: "John",
//     lastName: "Doe",
//     profileImage: { secure_url: "https://via.placeholder.com/100" },
//     credentials: {
//       domain: "Software Engineering",
//       expertise: ["React", "Node.js", "JavaScript"],
//       work_experiences: [{ years_of_experience: 5 }],
//     },
//     reviews: [
//       { rating: 5 },
//       { rating: 5 },
//       { rating: 5 },
//     ],
//     languages: ["English", "Spanish"],
//     sessions: [
//       { price: 100, duration: "1 hour", next_available_slot: { day: "Monday", time: "10:00 AM" } },
//     ],
//   },
//   {
//     _id: "2",
//     firstName: "Jane",
//     lastName: "Smith",
//     profileImage: { secure_url: "https://via.placeholder.com/100" },
//     credentials: {
//       domain: "Data Science",
//       expertise: ["Python", "Machine Learning", "Data Analysis"],
//       work_experiences: [{ years_of_experience: 7 }],
//     },
//     reviews: [
//       { rating: 4 },
//       { rating: 4 },
//       { rating: 4 },
//     ],
//     languages: ["English", "French"],
//     sessions: [
//       { price: 150, duration: "45 mins", next_available_slot: { day: "Tuesday", time: "2:00 PM" } },
//     ],
//   },
// ];

// const ExpertList = () => {
//   const [currentPage, setCurrentPage] = useState(1);

//   // Use mock data directly
//   const experts = mockExperts;
//   const totalExperts = experts.length;
//   const totalPages = Math.ceil(totalExperts / ITEMS_PER_PAGE);

//   // Calculate the slice of experts to display for the current page
//   const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
//   const endIndex = startIndex + ITEMS_PER_PAGE;
//   const paginatedExperts = experts.slice(startIndex, endIndex);

//   const handlePreviousPage = () => {
//     setCurrentPage((prev) => Math.max(prev - 1, 1));
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   };

//   const handleNextPage = () => {
//     setCurrentPage((prev) => Math.min(prev + 1, totalPages));
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   };

//   return (
//     <div className="mx-auto p-6">
//       {/* Available Experts Header */}
//       <div className="my-5">
//         <h2 className="text-xl font-semibold">
//           Available Experts -{" "}
//           <span className="text-green-600 underline">{totalExperts}</span>
//         </h2>
//       </div>

//       {/* Expert Cards Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
//         {paginatedExperts.map((expert) => (
//           <div key={expert._id} className="flex justify-center">
//             <ExpertCard
//               id={expert._id}
//               name={`${expert.firstName} ${expert.lastName}`}
//               image={
//                 expert?.profileImage?.secure_url ||
//                 "https://via.placeholder.com/100"
//               }
//               title={expert.credentials?.domain || "No Title Provided"}
//               rating={
//                 expert.reviews?.length > 0
//                   ? expert.reviews.reduce(
//                       (acc, review) => acc + review.rating,
//                       0
//                     ) / expert.reviews.length
//                   : 0
//               }
//               totalRatings={expert.reviews?.length || 0}
//               experience={`${
//                 expert.credentials?.work_experiences?.[0]
//                   ?.years_of_experience || 0
//               } years`}
//               languages={expert.languages || []}
//               startingPrice={expert.sessions?.[0]?.price || 0}
//               duration={expert.sessions?.[0]?.duration || "N/A"}
//               expertise={expert.credentials?.expertise || []}
//               nextSlot={
//                 expert.sessions?.[0]?.next_available_slot || {
//                   day: "N/A",
//                   time: "N/A",
//                 }
//               }
//             />
//           </div>
//         ))}
//       </div>

//       {/* Pagination */}
//       <div className="mt-8 pt-4 flex items-center justify-between border-t border-gray-200">
//         <div className="flex-1 flex justify-between sm:hidden">
//           <button
//             onClick={handlePreviousPage}
//             disabled={currentPage === 1}
//             className={`relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md ${
//               currentPage === 1
//                 ? "text-gray-300 cursor-not-allowed"
//                 : "text-gray-700 hover:bg-gray-50"
//             }`}
//           >
//             Previous
//           </button>
//           <button
//             onClick={handleNextPage}
//             disabled={currentPage === totalPages}
//             className={`relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md ${
//               currentPage === totalPages
//                 ? "text-gray-300 cursor-not-allowed"
//                 : "text-gray-700 hover:bg-gray-50"
//             }`}
//           >
//             Next
//           </button>
//         </div>
//         <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
//           <div>
//             <p className="text-sm text-gray-700">
//               Showing{" "}
//               <span className="font-medium">
//                 {Math.min(startIndex + 1, totalExperts)}
//               </span>{" "}
//               to{" "}
//               <span className="font-medium">
//                 {Math.min(endIndex, totalExperts)}
//               </span>{" "}
//               of <span className="font-medium">{totalExperts}</span> results
//             </p>
//           </div>
//           <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
//             <button
//               onClick={handlePreviousPage}
//               disabled={currentPage === 1}
//               className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
//                 currentPage === 1
//                   ? "text-gray-300 cursor-not-allowed"
//                   : "text-gray-500 hover:bg-gray-50"
//               }`}
//             >
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 className="h-5 w-5"
//                 viewBox="0 0 20 20"
//                 fill="currentColor"
//               >
//                 <path
//                   fillRule="evenodd"
//                   d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
//                   clipRule="evenodd"
//                 />
//               </svg>
//             </button>
//             <button
//               onClick={handleNextPage}
//               disabled={currentPage === totalPages}
//               className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
//                 currentPage === totalPages
//                   ? "text-gray-300 cursor-not-allowed"
//                   : "text-gray-500 hover:bg-gray-50"
//               }`}
//             >
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 className="h-5 w-5"
//                 viewBox="0 0 20 20"
//                 fill="currentColor"
//               >
//                 <path
//                   fillRule="evenodd"
//                   d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
//                   clipRule="evenodd"
//                 />
//               </svg>
//             </button>
//           </nav>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ExpertList;