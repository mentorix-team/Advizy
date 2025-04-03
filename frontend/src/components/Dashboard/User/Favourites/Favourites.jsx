import { useState, useEffect } from "react";
// import { getFavorites } from "./userService";
import { useSelector } from "react-redux";

const Favorites = ({ userToken }) => {
  const [favorites, setFavorites] = useState([]);
  const { data, loading, error } = useSelector((state) => state.auth);
  let userData;
  try {
    userData = typeof data === "string" ? JSON.parse(data) : data;
  } catch (error) {
    console.error("Error parsing user data:", error);
    userData = null;
  }

  useEffect(() => {
    if (userData?.favourites) {
      setFavorites(userData?.favourites);
    }
  }, [userData]);

  return (
    <div>
      <h2>My Favorite Experts</h2>
      {favorites.length === 0 ? (
        <p>No favorites yet.</p>
      ) : (
        <ul>
          {favorites.map((expert) => (
            <li key={expert._id}>
              <p>{expert.name}</p>
              <p>{expert.title}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Favorites;
