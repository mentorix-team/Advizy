import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import ExpertCard from "./ExpertCard";
import { getAllExperts } from "@/Redux/Slices/expert.Slice";
// import Spinner from "../LoadingSkeleton/Spinner";
import Spinner from "../LoadingSkeleton/Spinner";
const ExpertList = () => {

  const dispatch = useDispatch();

  // Access experts and loading state from the Redux store
  const { expertsData, loading, error } = useSelector((state) => ({
    expertsData: state.expert.experts, // Adjust based on your slice structure
    loading: state.expert.loading,
    error: state.expert.error,
  }));

  // Extract experts array from the returned data
  const experts = expertsData?.experts || []; // Safely access experts array

  console.log("experts", experts);

  useEffect(() => {
    dispatch(getAllExperts());
  }, [dispatch]);



  return (
    <div
      className="grid gap-4 p-4"
      style={{
        gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
        justifyContent: "center",
        maxWidth: "1200px",
        margin: "0 auto",
      }}
    >
      {loading && <Spinner />}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}
      {!loading && !error && experts.length === 0 && <p>No experts found</p>}
      {!loading &&
        !error &&
        experts.map((expert) => (
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
                ? expert.reviews.reduce(
                    (acc, review) => acc + review.rating,
                    0
                  ) / expert.reviews.length
                : 0
            }
            totalRatings={expert.reviews?.length || 0}
            experience={`${
              expert.credentials?.work_experiences?.[0]?.years_of_experience ||
              0
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
  );
};

export default ExpertList;
