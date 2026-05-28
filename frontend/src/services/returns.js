import api from "./api";

export const fetchReturns = async () => {
  const response = await api.get("/returns");
  return response.data;
};

export const fetchReturnDetails = async (id) => {
  const response = await api.get(`/returns/${id}`);
  return response.data;
};

export const fetchReturnComments = async (returnId) => {
  const res = await api.get(`/returns/${returnId}/comments`);
  return res.data;
};

export const createReturnRequest = async (formData) => {
  const response = await api.post("/returns", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const updateReturnStatus = async (id, status) => {
  const response = await api.put(`/returns/${id}/status`, { status });
  return response.data;
};

export const postReturnComment = async (returnId, commentData) => {
  const res = await api.post(`/returns/${returnId}/comments`, commentData);
  return res.data;
};

export const deleteReturnRequest = async (id) => {
  const response = await api.delete(`/returns/${id}`);
  return response.data;
};
