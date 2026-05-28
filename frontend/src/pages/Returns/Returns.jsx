import { useState } from "react";
import styled from "styled-components";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { fetchReturns } from "../../services/returns";
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
  color: ${({ theme }) => theme.colors.textDark};
`;
const ActionButton = styled.button`
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  padding: 10px 16px;
  border: none;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
`;

const FilterBar = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
  align-items: center;
`;
const Select = styled.select`
  padding: 8px 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 4px;
  outline: none;
`;

export const Returns = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState("All");

  const {
    data: returnsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["returns"],
    queryFn: fetchReturns,
  });

  const columns = [
    { header: "Request ID", accessor: "return_number" },
    {
      header: "Item",
      render: (row) => (
        <div>
          <div style={{ fontWeight: 500 }}>{row.product_name}</div>
          <div style={{ fontSize: "12px", color: "#6B7280" }}>₹{row.price}</div>
        </div>
      ),
    },
    { header: "Reason", accessor: "reason" },
    { header: "Status", render: (row) => <Badge status={row.status} /> },
    {
      header: "Date",
      render: (row) => format(new Date(row.created_at), "dd MMM yyyy"),
    },
    {
      header: "Action",
      render: (row) => (
        <span
          onClick={() => navigate(`/returns/${row.id}`)}
          style={{ color: "#4F46E5", cursor: "pointer", fontWeight: 500 }}
        >
          View Details
        </span>
      ),
    },
  ];

  if (user?.role !== "customer") {
    columns.splice(1, 0, { header: "Customer ID", accessor: "customer_id" });
  }

  if (isLoading) return <Spinner />;
  if (error) return <div>Error loading returns data.</div>;

  const filteredData = returnsData?.filter((item) => {
    if (statusFilter === "All") return true;
    return item.status === statusFilter;
  });

  return (
    <div>
      <PageHeader>
        <Title>
          {user?.role === "customer" ? "My Returns" : "All Return Requests"}
        </Title>
        {user?.role === "customer" && (
          <ActionButton onClick={() => navigate("/orders")}>
            + Create Return Request
          </ActionButton>
        )}
      </PageHeader>

      <FilterBar>
        <span style={{ fontWeight: 500, color: "#4B5563" }}>
          Filter by Status:
        </span>
        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All">All Statuses</option>
          <option value="Requested">Requested</option>
          <option value="Under Review">Under Review</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
          <option value="Refunded">Refunded</option>
        </Select>
      </FilterBar>

      <Table columns={columns} data={filteredData} itemsPerPage={5} />
    </div>
  );
};
