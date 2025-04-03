import axios from "axios";

const API_URL = "https://advizy.onrender.com/api/users";

export const addFavorite = async (expertId, token) => {
  return await axios.post(
    `${API_URL}/favorites/${expertId}`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};

export const removeFavorite = async (expertId, token) => {
  return await axios.delete(`${API_URL}/favorites/${expertId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const getFavorites = async (token) => {
  return await axios.get(`${API_URL}/favorites`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
