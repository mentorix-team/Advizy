import { fetchUserProfile } from "@/Redux/Slices/authSlice";
import { useState, useEffect } from "react";
// import { getFavorites } from "./userService";
import { useDispatch, useSelector } from "react-redux";
import ExpertCard from "./ExpertCard";
import Spinner from "@/components/LoadingSkeleton/Spinner";
import { Heart } from "lucide-react";

const Favorites = ({ userToken }) => {
  const dispatch = useDispatch();
  const [favorites, setFavorites] = useState([]);
  const { data: userData, loading, error } = useSelector((state) => state.auth);
  //   let userData;
  //   try {
  //     userData = typeof data === "string" ? JSON.parse(data) : data;
  //   } catch (error) {
  //     console.error("Error parsing user data:", error);
  //     userData = null;
  //   }

  useEffect(() => {
    dispatch(fetchUserProfile()); // Fetch fresh user profile on component mount
  }, [dispatch]);

  useEffect(() => {
    if (userData?.favourites) {
      setFavorites(userData.favourites); // Ensure favorites are updated in state
    }
  }, [userData]);

  if (loading) return <Spinner />;
  if (error) return <p>Error fetching favorites: {error}</p>;

  if (!userData?.favourites || userData.favourites.length === 0)
    return (
      <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto p-6 rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="relative mb-4">
          <Heart className="w-12 h-12 text-[#16A348]" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-1 text-center">
          No Favourite Experts
        </h3>
        <p className="text-gray-500 text-center">
          Add your Favourite expert
        </p>
      </div>
    );

  return (
    <div>
      <h2>My Favorite Experts</h2>
      {favorites.length === 0 ? (
        <p>No favorites yet.</p>
      ) : (
        <ul>
          {favorites.map((expert) => (
            <ExpertCard key={expert._id} expert={expert} />
          ))}
        </ul>
      )}
    </div>
  );
};

export default Favorites;
