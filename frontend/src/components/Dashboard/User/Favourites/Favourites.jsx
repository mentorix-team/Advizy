import { fetchUserProfile } from "@/Redux/Slices/authSlice";
import { useState, useEffect } from "react";
// import { getFavorites } from "./userService";
import { useDispatch, useSelector } from "react-redux";

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

  if (loading) return <p>Loading favorites...</p>;
  if (error) return <p>Error fetching favorites: {error}</p>;
  if (!userData?.favourites || userData.favourites.length === 0) return <p>No favorites yet.</p>;

  return (
    <div>
      <h2>My Favorite Experts</h2>
      {favorites.length === 0 ? (
        <p>No favorites yet.</p>
      ) : (
        <ul>
          {favorites.map((expert) => (
            <li key={expert._id}>{expert.name}</li> // Ensure name is displayed
          ))}
        </ul>
      )}
    </div>
  );
};

export default Favorites;
