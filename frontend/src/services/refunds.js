import api from "./api";

export const fetchRefunds = async () => {
  const response = await api.get("/refunds");
  return response.data;
};

export const createRefund = async (refundData) => {
  const res = await api.post("/refunds", refundData);
  return res.data;
};

export const updateRefundStatus = async (id, refund_status) => {
  const response = await api.put(`/refunds/${id}/status`, { refund_status });
  return response.data;
};
