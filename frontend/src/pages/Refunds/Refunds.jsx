import { useState, useEffect } from "react";
import styled from "styled-components";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { fetchReturns } from "../../services/returns";
import { fetchRefunds, updateRefundStatus } from "../../services/refunds";
import { useAuth } from "../../context/AuthContext";
import { Table } from "../../components/Table/Table";
import { Badge } from "../../components/Badge/Badge";
import { Spinner } from "../../components/Loader/Spinner";

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const Title = styled.h1`
  font-size: 24px;
  color: ${({ theme }) => theme.colors?.textDark || "#111827"};
`;

const TabContainer = styled.div`
  display: flex;
  gap: 16px;
  border-bottom: 1px solid #e5e7eb;
  margin-bottom: 24px;
`;

const Tab = styled.button`
  padding: 12px 16px;
  background: none;
  border: none;
  border-bottom: 2px solid
    ${({ $active, theme }) =>
      $active ? theme.colors?.primary || "#3b82f6" : "transparent"};
  color: ${({ $active }) => ($active ? "#111827" : "#6B7280")};
  font-weight: ${({ $active }) => ($active ? "600" : "400")};
  cursor: pointer;
  font-size: 15px;

  &:hover {
    color: #111827;
  }
`;

const ProcessButton = styled.button`
  padding: 6px 12px;
  background-color: #10b981;
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  font-size: 13px;

  &:hover {
    background-color: #059669;
  }
`;

export const Refunds = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();

 
  const [activeTab, setActiveTab] = useState(
    user?.role === "customer" ? "history" : "pending"
  );

 
  useEffect(() => {
    if (user?.role === "customer") {
      setActiveTab("history");
    }
  }, [user]);

  
  const { data: returnsData, isLoading: loadingReturns } = useQuery({
    queryKey: ["returns"],
    queryFn: fetchReturns,
    enabled: user?.role !== "customer",
  });

  
  const { data: refundsData, isLoading: loadingRefunds } = useQuery({
    queryKey: ["refunds"],
    queryFn: fetchRefunds,
  });

 
  const statusMutation = useMutation({
    mutationFn: ({ id, refund_status }) =>
      updateRefundStatus(id, refund_status),
    onSuccess: () => {
      queryClient.invalidateQueries(["refunds"]);
      toast.success("Refund status updated!");
    },
    onError: () => toast.error("Failed to update status."),
  });

  if ((loadingReturns && user?.role !== "customer") || loadingRefunds)
    return <Spinner />;

  const pendingRefunds =
    returnsData?.filter((r) => r.status === "Approved") || [];

  const pendingColumns = [
    { header: "Return ID", accessor: "return_number" },
    { header: "Customer ID", accessor: "customer_id" },
    { header: "Product", accessor: "product_name" },
    { header: "Refund Value", render: (row) => `₹${row.price}` },
    {
      header: "Approved On",
      render: (row) => format(new Date(row.created_at), "dd MMM yyyy"),
    },
    {
      header: "Action",
      render: (row) => (
        <ProcessButton onClick={() => navigate(`/refunds/${row.id}`)}>
          Process Refund
        </ProcessButton>
      ),
    },
  ];

  const historyColumns = [
    { header: "Refund ID", accessor: "refund_number" },
    { header: "Return Request ID", accessor: "return_request_id" },
    { header: "Amount", render: (row) => `₹${row.refund_amount}` },
    { header: "Method", accessor: "payment_method" },
    {
      header: "Status",
      render: (row) => {
 
        if (user?.role === "admin") {
          return (
            <select
              value={row.refund_status}
              onChange={(e) =>
                statusMutation.mutate({
                  id: row.id,
                  refund_status: e.target.value,
                })
              }
              disabled={statusMutation.isLoading}
              style={{
                padding: "6px 12px",
                borderRadius: "4px",
                border: "1px solid #d1d5db",
                backgroundColor:
                  row.refund_status === "Completed"
                    ? "#D1FAE5"
                    : row.refund_status === "Failed"
                    ? "#FEE2E2"
                    : "#FEF3C7",
                color:
                  row.refund_status === "Completed"
                    ? "#065F46"
                    : row.refund_status === "Failed"
                    ? "#991B1B"
                    : "#92400E",
                fontWeight: "500",
                outline: "none",
                cursor: "pointer",
              }}
            >
              <option value="Processing">Processing</option>
              <option value="Completed">Completed</option>
              <option value="Failed">Failed</option>
            </select>
          );
        }

        return <Badge status={row.refund_status} />;
      },
    },
  ];

  return (
    <div>
      <PageHeader>
        <Title>Refund History</Title>
      </PageHeader>

      {user?.role !== "customer" && (
        <TabContainer>
          <Tab
            $active={activeTab === "pending"}
            onClick={() => setActiveTab("pending")}
          >
            Pending Processing ({pendingRefunds.length})
          </Tab>
          <Tab
            $active={activeTab === "history"}
            onClick={() => setActiveTab("history")}
          >
            Refund History
          </Tab>
        </TabContainer>
      )}

      {activeTab === "pending" && user?.role !== "customer" ? (
        pendingRefunds.length > 0 ? (
          <Table
            columns={pendingColumns}
            data={pendingRefunds}
            itemsPerPage={10}
          />
        ) : (
          <div
            style={{
              padding: "40px",
              textAlign: "center",
              color: "#6B7280",
              background: "white",
              borderRadius: "8px",
              border: "1px solid #e5e7eb",
            }}
          >
            All caught up! There are no approved returns waiting for a
            refund.
          </div>
        )
      ) : (
        <Table columns={historyColumns} data={refundsData} itemsPerPage={10} />
      )}
    </div>
  );
};
