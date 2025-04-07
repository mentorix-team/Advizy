import { fetchUserProfile } from "@/Redux/Slices/authSlice";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ExpertCard from "./ExpertCard";
import Spinner from "@/components/LoadingSkeleton/Spinner";
import { Heart } from "lucide-react";

const Favorites = ({ userToken }) => {
  const dispatch = useDispatch();
  const [favorites, setFavorites] = useState([]);
  const { data: userData, loading, error } = useSelector((state) => state.auth);

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
      <div className="bg-transparent flex flex-row justify-center w-full">
        <div className="w-full max-w-[1440px]">
          <main className="relative min-h-[400px] bg-gray-50 px-8 py-12">
            <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto p-8 rounded-[9.48px] border border-[#1d1f1d33] bg-[#fcfcfc] shadow-sm">
              <div className="relative mb-6">
                <div className="flex items-center justify-center w-16 h-16 bg-[#e6f0eb] rounded-full">
                  <Heart className="w-8 h-8 text-green-700" />
                </div>
              </div>
              <h3 className="text-[20.5px] font-semibold text-[#1d1d1d] mb-2 text-center">
                No Favourite Experts
              </h3>
              <p className="opacity-80 font-normal text-[#1d1f1d] text-[14.9px] text-center">
                Add your Favourite expert to see them here
              </p>
            </div>
          </main>
        </div>
      </div>
    );

  return (
    <div className="bg-transparent flex flex-row justify-center w-full">
      <div className="w-full max-w-[1440px]">
        <main className="relative min-h-[1005px] bg-gray-50 px-8 py-12">
          <h1 className="text-2xl md:text-[28px] font-semibold text-green-700 mb-8 ml-8">
            My Favourite Experts
          </h1>

          <div className="flex flex-col max-w-[1046px] mx-auto gap-[22px]">
            <p className="text-gray-700 text-[15px] leading-[22.5px]">
              Showing {favorites.length} favourite {favorites.length === 1 ? 'mentor' : 'mentors'}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-11 gap-y-11">
              {favorites.map((expert) => (
                <ExpertCard key={expert._id} expert={expert} />
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Favorites;