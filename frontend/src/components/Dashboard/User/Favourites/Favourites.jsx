import { fetchFavourites } from "@/Redux/Slices/favouritesSlice";
import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import ExpertCard from "./ExpertCard";
import { Heart } from "lucide-react";

const Favourites = () => {
  const dispatch = useDispatch();
  const { ids, entities, loading, error } = useSelector((state) => state.favourites);

  useEffect(() => {
    if (!ids.length) dispatch(fetchFavourites());
  }, [ids.length, dispatch]);

  const uniqueEntities = useMemo(() => {
    const map = new Map();
    entities.forEach((e) => { if (e?._id && !map.has(e._id)) map.set(e._id, e); });
    return Array.from(map.values());
  }, [entities]);

  if (loading) return <p className="p-8 text-center">Loading favourites...</p>;
  if (error) return <p className="p-8 text-center text-red-600">{error}</p>;

  if (!uniqueEntities.length) {
    return (
      <div className="flex justify-center py-12">
        <div className="text-center max-w-sm p-6 border rounded bg-white">
          <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-green-50 mb-4">
            <Heart className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No Favourite Experts</h3>
          <p className="text-sm text-gray-600">
            Add experts to your favourites to see them here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 py-10">
      <h1 className="text-2xl font-semibold mb-6 text-green-700">My Favourite Experts</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {uniqueEntities.map((ex) => (
          <ExpertCard key={ex._id} expert={ex} />
        ))}
      </div>
    </div>
  );
};

export default Favourites;