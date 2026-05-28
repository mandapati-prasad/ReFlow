import api from "./api";

export const fetchOrders = async () => {
  const response = await api.get("/orders");
  return response.data;
};

export const fetchOrderDetails = async (id) => {
  const response = await api.get(`/orders/${id}`);
  return response.data;
};

export const fetchOrderItems = async (orderId) => {
  const response = await api.get(`/orders/${orderId}/items`);
  return response.data;
};
