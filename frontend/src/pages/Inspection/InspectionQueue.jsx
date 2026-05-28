import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { fetchReturns } from "../../services/returns";
import { Table } from "../../components/Table/Table";
import { Spinner } from "../../components/Loader/Spinner";

import { PageHeader, Title, InspectButton } from "./styledComponents";

export const InspectionQueue = () => {
  const navigate = useNavigate();

  // Fetch all returns
  const { data: returnsData, isLoading } = useQuery({
    queryKey: ["returns"],
    queryFn: fetchReturns,
  });

  if (isLoading) return <Spinner />;

  const pendingInspections =
    returnsData?.filter((r) => r.status === "Requested") || [];

  const columns = [
    { header: "Request ID", accessor: "return_number" },
    { header: "Product", accessor: "product_name" },
    { header: "Reason", accessor: "reason" },
    {
      header: "Requested On",
      render: (row) => format(new Date(row.created_at), "dd MMM yyyy"),
    },
    {
      header: "Action",
      render: (row) => (
        <InspectButton
          onClick={() => navigate(`/inspection/new?returnId=${row.id}`)}
        >
          Start Inspection
        </InspectButton>
      ),
    },
  ];

  return (
    <div>
      <PageHeader>
        <Title>Inspection Queue</Title>
      </PageHeader>

      <p style={{ color: "#6B7280", marginBottom: "24px" }}>
        The following items have been returned by customers and require a
        physical inspection before they can be approved for a refund.
      </p>

      {pendingInspections.length > 0 ? (
        <Table columns={columns} data={pendingInspections} itemsPerPage={10} />
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
          🎉 Inbox zero! There are no pending returns awaiting inspection right
          now.
        </div>
      )}
    </div>
  );
};
