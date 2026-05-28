import { useQuery } from "@tanstack/react-query";
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  BarChart,
  Bar,
  Legend,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  fetchTopReasons,
  fetchTimeline,
  fetchAnalyticsOverview,
} from "../../services/dashboard";

import { ChartsGrid, ChartCard, ChartTitle } from "./styledComponents";

const COLORS = ["#4F46E5", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"];

export const DashboardCharts = () => {
  const { data: reasonsData, isLoading: loadingReasons } = useQuery({
    queryKey: ["topReasons"],
    queryFn: fetchTopReasons,
  });

  const { data: timelineData, isLoading: loadingTimeline } = useQuery({
    queryKey: ["timeline"],
    queryFn: fetchTimeline,
  });

  const { data: overviewData } = useQuery({
    queryKey: ["overview"],
    queryFn: fetchAnalyticsOverview,
  });

  if (loadingReasons || loadingTimeline) return <div>Loading charts...</div>;

  return (
    <ChartsGrid>
      <ChartCard>
        <ChartTitle>Requests Over Time (Last 7 Days)</ChartTitle>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={timelineData}>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#E5E7EB"
            />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} tickLine={false} />
            <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="count"
              stroke="#4F46E5"
              strokeWidth={3}
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard>
        <ChartTitle>Top Return Reasons</ChartTitle>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={reasonsData}
              dataKey="count"
              nameKey="reason"
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={5}
            >
              {reasonsData?.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard>
        <ChartTitle>Returns vs Refunds</ChartTitle>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={overviewData?.returns}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Legend />
            <Bar
              dataKey="count"
              name="Returns Logged"
              fill="#10B981"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </ChartsGrid>
  );
};
