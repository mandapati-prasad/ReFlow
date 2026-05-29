import styled from "styled-components";
import { toast } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import {
  fetchReturnDetails,
  updateReturnStatus,
  deleteReturnRequest,
} from "../../services/returns";
import { fetchInspectionReport } from "../../services/admin";
import { useAuth } from "../../context/AuthContext";
import { Badge } from "../../components/Badge/Badge";
import { Comments } from "../../components/Returns/Comments";

const LayoutGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.div`
  background-color: ${({ theme }) => theme.colors?.surface || "#ffffff"};
  padding: 24px;
  border-radius: ${({ theme }) => theme.borderRadius?.lg || "8px"};
  border: 1px solid ${({ theme }) => theme.colors?.border || "#e5e7eb"};
`;

const DetailRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors?.border || "#e5e7eb"};
  &:last-child {
    border-bottom: none;
  }
`;

const Select = styled.select`
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #ccc;
  margin-right: 12px;
  flex-grow: 1;
`;

const Button = styled.button`
  padding: 8px 16px;
  background-color: ${({ theme }) => theme.colors?.primary || "#3b82f6"};
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:disabled {
    background-color: #9ca3af;
    cursor: not-allowed;
  }
`;

const imgUrl = import.meta.env.VITE_BACKEND_IMG_URL;

export const ReturnDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: details, isLoading } = useQuery({
    queryKey: ["returnDetails", id],
    queryFn: () => fetchReturnDetails(id),
  });

  const { data: inspection, isLoading: loadingInspection } = useQuery({
    queryKey: ["inspection", id],
    queryFn: () => fetchInspectionReport(id),
  });

  const statusMutation = useMutation({
    mutationFn: (newStatus) => updateReturnStatus(id, newStatus),
    onSuccess: () => {
      queryClient.invalidateQueries(["returnDetails", id]);
      toast.success("Status updated successfully!");
    },
    onError: () => toast.error("Failed to update status."),
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteReturnRequest(id),
    onSuccess: () => {
      toast.success("Return request deleted.");
      navigate("/returns");
    },
  });

  if (isLoading) return <div>Loading details...</div>;
  if (!details) return <div>Return request not found.</div>;

  return (
    <div>
      <div
        style={{
          marginBottom: "24px",
          display: "flex",
          gap: "16px",
          alignItems: "center",
        }}
      >
        <span
          style={{ cursor: "pointer", color: "#6B7280" }}
          onClick={() => navigate("/returns")}
        >
          ← Back to List
        </span>
        <h2>Return #{details.return_number}</h2>
        <Badge status={details.status} />
      </div>

      <LayoutGrid>
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <Card>
            <h3 style={{ marginBottom: "16px" }}>Request Information</h3>
            <DetailRow>
              <span style={{ color: "#6B7280" }}>Date</span>
              <span>
                {format(new Date(details.created_at), "dd MMM yyyy, p")}
              </span>
            </DetailRow>
            <DetailRow>
              <span style={{ color: "#6B7280" }}>Reason</span>
              <span>{details.reason}</span>
            </DetailRow>
            <DetailRow
              style={{ flexDirection: "column", gap: "8px", border: "none" }}
            >
              <span style={{ color: "#6B7280" }}>Description</span>
              <p style={{ lineHeight: 1.5, margin: 0 }}>
                {details.description}
              </p>
            </DetailRow>

            {details.image_url && (
              <div style={{ marginTop: "24px" }}>
                <span
                  style={{
                    color: "#6B7280",
                    display: "block",
                    marginBottom: "8px",
                  }}
                >
                  Uploaded Image
                </span>
                <img
                  src={`${imgUrl}${details.image_url}`}
                  alt="Return evidence"
                  style={{ maxWidth: "200px", borderRadius: "8px" }}
                />
              </div>
            )}
          </Card>

          {user?.role === "admin" && details.status === "Approved" && (
            <Card
              style={{
                borderLeft: "4px solid #10B981",
                backgroundColor: "#ECFDF5",
              }}
            >
              <h3 style={{ marginBottom: "8px", color: "#065F46" }}>
                Ready for Refund
              </h3>
              <p
                style={{
                  color: "#047857",
                  fontSize: "14px",
                  marginBottom: "16px",
                  marginTop: 0,
                }}
              >
                This return has been approved. You can now issue the refund to
                the customer.
              </p>
              <Button
                style={{ width: "100%", backgroundColor: "#10B981" }}
                onClick={() => navigate(`/refunds/${id}`)}
              >
                Process Refund Now
              </Button>
            </Card>
          )}

          {user?.role !== "customer" && (
            <Card>
              <h3 style={{ marginBottom: "16px" }}>Inspection Report</h3>

              {loadingInspection ? (
                <p style={{ color: "#6B7280", fontSize: "14px" }}>
                  Loading report...
                </p>
              ) : inspection ? (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                  }}
                >
                  <DetailRow style={{ padding: "8px 0" }}>
                    <span style={{ color: "#6B7280", fontSize: "14px" }}>
                      Inspector
                    </span>
                    <span style={{ fontWeight: 500, fontSize: "14px" }}>
                      {inspection.inspector_name}
                    </span>
                  </DetailRow>
                  <DetailRow style={{ padding: "8px 0" }}>
                    <span style={{ color: "#6B7280", fontSize: "14px" }}>
                      Product
                    </span>
                    <span style={{ fontSize: "14px" }}>
                      {inspection.product_condition}
                    </span>
                  </DetailRow>
                  <DetailRow style={{ padding: "8px 0" }}>
                    <span style={{ color: "#6B7280", fontSize: "14px" }}>
                      Packaging
                    </span>
                    <span style={{ fontSize: "14px" }}>
                      {inspection.packaging_condition}
                    </span>
                  </DetailRow>
                  <DetailRow style={{ padding: "8px 0" }}>
                    <span style={{ color: "#6B7280", fontSize: "14px" }}>
                      Accessories
                    </span>
                    <span style={{ fontSize: "14px" }}>
                      {inspection.accessories_included}
                    </span>
                  </DetailRow>

                  <div
                    style={{
                      marginTop: "8px",
                      padding: "12px",
                      backgroundColor: "#F3F4F6",
                      borderRadius: "6px",
                    }}
                  >
                    <span
                      style={{
                        color: "#4B5563",
                        fontSize: "12px",
                        fontWeight: "bold",
                        display: "block",
                        marginBottom: "4px",
                      }}
                    >
                      Notes
                    </span>
                    <p
                      style={{
                        margin: 0,
                        fontSize: "13px",
                        color: "#374151",
                        lineHeight: 1.5,
                      }}
                    >
                      {inspection.inspection_notes ||
                        "No additional notes provided."}
                    </p>
                  </div>

                  <div
                    style={{
                      marginTop: "8px",
                      padding: "12px",
                      backgroundColor: "#EFF6FF",
                      borderLeft: "4px solid #3B82F6",
                      borderRadius: "4px",
                    }}
                  >
                    <span
                      style={{
                        color: "#1D4ED8",
                        fontSize: "12px",
                        fontWeight: "bold",
                        display: "block",
                        marginBottom: "4px",
                      }}
                    >
                      Recommended Action
                    </span>
                    <span
                      style={{
                        color: "#1E3A8A",
                        fontSize: "14px",
                        fontWeight: 500,
                      }}
                    >
                      {inspection.inspection_result}
                    </span>
                  </div>
                </div>
              ) : (
                <>
                  <p
                    style={{
                      color: "#6B7280",
                      fontSize: "14px",
                      marginBottom: "16px",
                      marginTop: 0,
                    }}
                  >
                    No physical inspection report has been logged for this item
                    yet.
                  </p>
                  <Button
                    style={{ width: "max-content" }}
                    onClick={() => navigate(`/inspection/new?returnId=${id}`)}
                  >
                    + Create Report
                  </Button>
                </>
              )}
            </Card>
          )}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <Card>
            <h3 style={{ marginBottom: "16px" }}>Item Details</h3>
            <div style={{ fontWeight: 500 }}>{details.product_name}</div>
            <div style={{ color: "#6B7280", marginTop: "4px" }}>
              Price: ₹{details.price}
            </div>
          </Card>

          {user?.role !== "customer" && (
            <Card>
              <h3 style={{ marginBottom: "16px" }}>Update Status</h3>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  statusMutation.mutate(e.target.statusSelect.value);
                }}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                <Select
                  name="statusSelect"
                  defaultValue={details.status}
                  style={{ marginRight: 0 }}
                >
                  <option value="Requested">Requested</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                  <option value="Refunded">Refunded</option>
                </Select>
                <Button
                  type="submit"
                  disabled={statusMutation.isLoading}
                  style={{ width: "100%" }}
                >
                  Update
                </Button>
              </form>
            </Card>
          )}

          <Card>
            <Comments returnId={id} />
          </Card>

          {user?.role === "admin" && (
            <button
              onClick={() =>
                window.confirm("Delete request?") && deleteMutation.mutate()
              }
              style={{
                padding: "12px",
                background: "#EF4444",
                color: "white",
                border: "none",
                borderRadius: "4px",
                width: "100%",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              Danger: Delete Return Request
            </button>
          )}
        </div>
      </LayoutGrid>
    </div>
  );
};
