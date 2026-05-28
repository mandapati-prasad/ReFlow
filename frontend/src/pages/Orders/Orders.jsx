import styled from "styled-components";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { fetchOrders } from "../../services/orders";
import { Table } from "../../components/Table/Table";
import { Badge } from "../../components/Badge/Badge";
import { useAuth } from "../../context/AuthContext";
import { Spinner } from "../../components/Loader/Spinner";

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

export const Orders = () => {
  const { user } = useAuth();

  const {
    data: ordersData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["orders"],
    queryFn: fetchOrders,
  });

  const columns = [
    { header: "Order ID", accessor: "order_number" },
    {
      header: "Date",
      render: (row) => format(new Date(row.created_at), "dd MMM yyyy"),
    },
    {
      header: "Amount",
      render: (row) => `₹${row.total_amount.toLocaleString("en-IN")}`,
    },
    {
      header: "Status",
      render: (row) => <Badge status={row.status} />,
    },
    {
      header: "Action",
      render: (row) => (
        <Link
          to={`/orders/${row.id}`}
          style={{
            color: "#4F46E5",
            cursor: "pointer",
            fontWeight: 500,
            textDecoration: "none",
          }}
        >
          View Details
        </Link>
      ),
    },
  ];

  if (user?.role !== "customer") {
    columns.splice(1, 0, { header: "Customer ID", accessor: "customer_id" });
  }

  if (isLoading) return <Spinner />;
  if (error) return <div>Error loading orders data.</div>;

  return (
    <div>
      <PageHeader>
        <h2>{user?.role === "customer" ? "My Orders" : "All Orders"}</h2>
      </PageHeader>
      <Table columns={columns} data={ordersData} />
    </div>
  );
};
