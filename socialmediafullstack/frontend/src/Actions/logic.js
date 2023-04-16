import axios from "axios";
export const getUserProfile = async (userId) => {
  const { data } = await axios.get(`/api/v1/user/${userId}`);
  return data.user;
};
