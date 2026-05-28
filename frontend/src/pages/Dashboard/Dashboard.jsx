import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import {
  FiRefreshCcw,
  FiDollarSign,
  FiClock,
  FiClipboard,
  FiAlertCircle,
  FiCheckCircle,
  FiBell,
  FiTrendingUp,
} from "react-icons/fi";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { useAuth } from "../../context/AuthContext";
import { fetchReturns } from "../../services/returns";
import { fetchRefunds } from "../../services/refunds";
import { fetchNotifications } from "../../services/notifications";
import { Badge } from "../../components/Badge/Badge";
import { Spinner } from "../../components/Loader/Spinner";

import {
  PageHeader,
  Greeting,
  Subtitle,
  StatsGrid,
  StatCard,
  IconWrapper,
  StatInfo,
  StatLabel,
  StatValue,
  ChartsGrid,
  ChartContainer,
  ContentGrid,
  Section,
  SectionHeader,
  SectionTitle,
  ViewAll,
  ListItem,
  NotificationItem,
} from "./styledComponents";

// Pie Chart Colors
const COLORS = {
  Requested: "#F59E0B",
  "Under Review": "#3B82F6",
  Approved: "#10B981",
  Rejected: "#EF4444",
  Refunded: "#8B5CF6",
};

export const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Fetch data
  const { data: returnsData, isLoading: loadingReturns } = useQuery({
    queryKey: ["returns"],
    queryFn: fetchReturns,
  });

  const { data: refundsData, isLoading: loadingRefunds } = useQuery({
    queryKey: ["refunds"],
    queryFn: fetchRefunds,
  });

  const { data: notificationsData, isLoading: loadingNotifications } = useQuery(
    {
      queryKey: ["notifications"],
      queryFn: fetchNotifications,
    }
  );

  if (loadingReturns || loadingRefunds || loadingNotifications)
    return <Spinner />;

  const isCustomer = user?.role === "customer";
  const returns = returnsData || [];
  const refunds = refundsData || [];
  const recentNotifications = notificationsData?.slice(0, 4) || [];

  // --- CALCULATION LOGIC FOR STATS ---

  // Customer Specific Stats
  const myPendingReturns = returns.filter(
    (r) => r.status === "Requested" || r.status === "Under Review"
  ).length;
  const myTotalRefunded = refunds
    .filter((r) => r.refund_status === "Completed")
    .reduce((sum, r) => sum + r.refund_amount, 0);
  const myRecentReturns = [...returns]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 4);

  // Staff (Admin/Support) Specific Stats
  const pendingInspections = returns.filter(
    (r) => r.status === "Requested"
  ).length;
  const pendingRefunds = returns.filter((r) => r.status === "Approved").length;
  const resolvedToday = returns.filter(
    (r) => r.status === "Refunded" || r.status === "Rejected"
  ).length;

  // NEW: Macro System Stats for Staff
  const totalSystemReturns = returns.length;
  const completedRefunds = refunds.filter(
    (r) => r.refund_status === "Completed"
  );
  const totalSystemRefundsCount = completedRefunds.length;
  const totalSystemRefundAmount = completedRefunds.reduce(
    (sum, r) => sum + r.refund_amount,
    0
  );

  const recentActionItems = [...returns]
    .filter((r) => r.status === "Requested" || r.status === "Approved")
    .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
    .slice(0, 4);

  // --- CHART DATA GENERATION (Staff Only) ---
  const statusCounts = returns.reduce((acc, curr) => {
    acc[curr.status] = (acc[curr.status] || 0) + 1;
    return acc;
  }, {});

  const statusPieData = Object.keys(statusCounts).map((key) => ({
    name: key,
    value: statusCounts[key],
  }));

  const trendCounts = returns.reduce((acc, curr) => {
    const dateStr = format(new Date(curr.created_at), "MMM dd");
    acc[dateStr] = (acc[dateStr] || 0) + 1;
    return acc;
  }, {});

  const trendBarData = Object.keys(trendCounts)
    .map((date) => ({ date, count: trendCounts[date] }))
    .slice(-7);

  return (
    <div>
      <PageHeader>
        <Greeting>Welcome back, {user?.full_name || "User"}!</Greeting>
        <Subtitle>
          {isCustomer
            ? "Here is an overview of your recent account activity."
            : "Here is your system overview for today."}
        </Subtitle>
      </PageHeader>

      {/* --- STATS GRID --- */}
      <StatsGrid>
        {isCustomer ? (
          <>
            <StatCard>
              <IconWrapper $bg="#EFF6FF" $color="#3B82F6">
                <FiRefreshCcw />
              </IconWrapper>
              <StatInfo>
                <StatLabel>Total Returns</StatLabel>
                <StatValue>{returns.length}</StatValue>
              </StatInfo>
            </StatCard>
            <StatCard>
              <IconWrapper $bg="#FEF2F2" $color="#EF4444">
                <FiClock />
              </IconWrapper>
              <StatInfo>
                <StatLabel>In Progress</StatLabel>
                <StatValue>{myPendingReturns}</StatValue>
              </StatInfo>
            </StatCard>
            <StatCard>
              <IconWrapper $bg="#ECFDF5" $color="#10B981">
                <FiDollarSign />
              </IconWrapper>
              <StatInfo>
                <StatLabel>Total Refunded</StatLabel>
                <StatValue>₹{myTotalRefunded}</StatValue>
              </StatInfo>
            </StatCard>
          </>
        ) : (
          // NEW: Expanded 6-Card Grid for Staff
          <>
            <StatCard>
              <IconWrapper $bg="#EFF6FF" $color="#3B82F6">
                <FiRefreshCcw />
              </IconWrapper>
              <StatInfo>
                <StatLabel>Total System Returns</StatLabel>
                <StatValue>{totalSystemReturns}</StatValue>
              </StatInfo>
            </StatCard>
            <StatCard>
              <IconWrapper $bg="#ECFDF5" $color="#10B981">
                <FiDollarSign />
              </IconWrapper>
              <StatInfo>
                <StatLabel>Total Refund Amount</StatLabel>
                <StatValue>
                  ₹{totalSystemRefundAmount.toLocaleString()}
                </StatValue>
              </StatInfo>
            </StatCard>
            <StatCard>
              <IconWrapper $bg="#F3F4F6" $color="#4B5563">
                <FiCheckCircle />
              </IconWrapper>
              <StatInfo>
                <StatLabel>Completed Refunds</StatLabel>
                <StatValue>{totalSystemRefundsCount}</StatValue>
              </StatInfo>
            </StatCard>

            <StatCard>
              <IconWrapper $bg="#FFFBEB" $color="#F59E0B">
                <FiClipboard />
              </IconWrapper>
              <StatInfo>
                <StatLabel>Pending Inspections</StatLabel>
                <StatValue>{pendingInspections}</StatValue>
              </StatInfo>
            </StatCard>
            <StatCard>
              <IconWrapper $bg="#FEF2F2" $color="#EF4444">
                <FiAlertCircle />
              </IconWrapper>
              <StatInfo>
                <StatLabel>Pending Refunds</StatLabel>
                <StatValue>{pendingRefunds}</StatValue>
              </StatInfo>
            </StatCard>
            <StatCard>
              <IconWrapper $bg="#F5F3FF" $color="#8B5CF6">
                <FiTrendingUp />
              </IconWrapper>
              <StatInfo>
                <StatLabel>Resolved Today</StatLabel>
                <StatValue>{resolvedToday}</StatValue>
              </StatInfo>
            </StatCard>
          </>
        )}
      </StatsGrid>

      {/* --- CHARTS ROW (Hidden from Customers) --- */}
      {!isCustomer && (
        <ChartsGrid>
          <ChartContainer>
            <SectionTitle style={{ marginBottom: "24px" }}>
              Return Volume (Recent)
            </SectionTitle>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={trendBarData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#E5E7EB"
                />
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#6B7280", fontSize: 12 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#6B7280", fontSize: 12 }}
                />
                <Tooltip
                  cursor={{ fill: "#F3F4F6" }}
                  contentStyle={{
                    borderRadius: "8px",
                    border: "none",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Bar
                  dataKey="count"
                  fill="#3B82F6"
                  radius={[4, 4, 0, 0]}
                  barSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>

          <ChartContainer>
            <SectionTitle style={{ marginBottom: "24px" }}>
              Status Distribution
            </SectionTitle>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusPieData}
                  cx="50%"
                  cy="45%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusPieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[entry.name] || "#9CA3AF"}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: "8px",
                    border: "none",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  iconType="circle"
                  wrapperStyle={{ fontSize: "12px" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </ChartsGrid>
      )}

      {/* --- CONTENT GRID (2fr / 1fr Layout) --- */}
      <ContentGrid>
        {/* LEFT COLUMN: Main Activity List */}
        <Section>
          <SectionHeader>
            <SectionTitle>
              {isCustomer ? "Recent Return Requests" : "Urgent Action Items"}
            </SectionTitle>
            <ViewAll onClick={() => navigate("/returns")}>View All →</ViewAll>
          </SectionHeader>

          <div>
            {isCustomer ? (
              myRecentReturns.length > 0 ? (
                myRecentReturns.map((r) => (
                  <ListItem
                    key={r.id}
                    onClick={() => navigate(`/returns/${r.id}`)}
                  >
                    <div>
                      <div
                        style={{
                          fontWeight: 500,
                          color: "#111827",
                          marginBottom: "4px",
                        }}
                      >
                        {r.product_name}
                      </div>
                      <div style={{ fontSize: "13px", color: "#6B7280" }}>
                        Requested on{" "}
                        {format(new Date(r.created_at), "MMM dd, yyyy")}
                      </div>
                    </div>
                    <Badge status={r.status} />
                  </ListItem>
                ))
              ) : (
                <div
                  style={{
                    padding: "32px",
                    textAlign: "center",
                    color: "#6B7280",
                  }}
                >
                  You have no recent return requests.
                </div>
              )
            ) : recentActionItems.length > 0 ? (
              recentActionItems.map((r) => (
                <ListItem
                  key={r.id}
                  onClick={() => navigate(`/returns/${r.id}`)}
                >
                  <div>
                    <div
                      style={{
                        fontWeight: 500,
                        color: "#111827",
                        marginBottom: "4px",
                      }}
                    >
                      Return #{r.return_number} - {r.product_name}
                    </div>
                    <div
                      style={{
                        fontSize: "13px",
                        color: "#EF4444",
                        fontWeight: 500,
                      }}
                    >
                      {r.status === "Requested"
                        ? "Requires physical inspection"
                        : "Requires refund processing"}
                    </div>
                  </div>
                  <Badge status={r.status} />
                </ListItem>
              ))
            ) : (
              <div
                style={{
                  padding: "32px",
                  textAlign: "center",
                  color: "#6B7280",
                }}
              >
                All caught up! No urgent action items.
              </div>
            )}
          </div>
        </Section>

        {/* RIGHT COLUMN: Notifications Sidebar */}
        <Section>
          <SectionHeader>
            <SectionTitle>Recent Notifications</SectionTitle>
            <ViewAll onClick={() => navigate("/notifications")}>
              Inbox →
            </ViewAll>
          </SectionHeader>

          <div>
            {recentNotifications.length > 0 ? (
              recentNotifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  $unread={!notification.is_read}
                  onClick={() => navigate("/notifications")}
                >
                  <div
                    style={{
                      fontSize: "14px",
                      color: !notification.is_read ? "#111827" : "#4B5563",
                      fontWeight: !notification.is_read ? 500 : 400,
                    }}
                  >
                    {notification.message}
                  </div>
                  <div style={{ fontSize: "12px", color: "#9CA3AF" }}>
                    {format(new Date(notification.created_at), "MMM d, h:mm a")}
                  </div>
                </NotificationItem>
              ))
            ) : (
              <div
                style={{
                  padding: "40px 24px",
                  textAlign: "center",
                  color: "#9CA3AF",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                <FiBell size={32} />
                <span style={{ fontSize: "14px" }}>
                  You have no new notifications.
                </span>
              </div>
            )}
          </div>
        </Section>
      </ContentGrid>
    </div>
  );
};
