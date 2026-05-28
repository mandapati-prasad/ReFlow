import api from "./api";

export const createInspectionReport = async (data) => {
  const response = await api.post("/inspection", data);
  return response.data;
};

export const fetchInspectionReport = async (returnId) => {
  const response = await api.get(`/inspection/${returnId}`);
  return response.data;
};

export const fetchUsers = async () => {
  const response = await api.get("/users");
  return response.data;
};

export const updateUserStatus = async (id, status) => {
  const response = await api.put(`/users/${id}/status`, { status });
  return response.data;
};

export const deleteUser = async (id) => {
  const response = await api.delete(`/users/${id}`);
  return response.data;
};

export const fetchSettings = async () => {
  const response = await api.get("/settings");
  return response.data;
};

export const updateSettings = async (settingsData) => {
  const response = await api.put("/settings", settingsData);
  return response.data;
};
