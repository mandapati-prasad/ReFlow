import api from "./api";

export const fetchProfile = async () => {
  const response = await api.get("/users/profile");
  return response.data;
};

export const updateProfileImage = async (formData) => {
  const response = await api.put("/users/profile-image", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};
