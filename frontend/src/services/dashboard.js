import api from "./api";

export const fetchDashboardSummary = async (role) => {
  const response = await api.get(`/dashboard/${role}`);
  return response.data;
};

export const fetchTopReasons = async () => {
  const response = await api.get("/analytics/top-reasons");
  return response.data;
};

export const fetchTimeline = async () => {
  const response = await api.get("/analytics/requests-timeline");
  return response.data;
};

export const fetchAnalyticsOverview = async () => {
  const response = await api.get("/analytics/overview");
  return response.data;
};
