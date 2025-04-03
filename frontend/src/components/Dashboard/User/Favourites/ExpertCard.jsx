import { useState, useEffect } from "react";
import { addFavorite, removeFavorite, getFavorites } from "./userService";
import ExpertCard from "@/components/Explore/ExpertCard";

const ExpertCard = ({ expert, userToken }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const res = await getFavorites(userToken);
        setIsFavorite(res.data.some((fav) => fav._id === expert._id));
      } catch (error) {
        console.error("Error fetching favorites", error);
      }
    };

    fetchFavorites();
  }, [expert._id, userToken]);

  return (
    <div className="expert-card">
      <ExpertCard />
    </div>
  );
};

export default ExpertCard;
