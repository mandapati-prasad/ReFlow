import { useState } from "react";
import styled from "styled-components";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { fetchReturnDetails, updateReturnStatus } from "../../services/returns";
import { createRefund } from "../../services/refunds";

const PageLayout = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 24px 0;
`;

const Card = styled.div`
  background: white;
  padding: 24px;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Input = styled.input`
  padding: 12px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 16px;
`;

const Select = styled.select`
  padding: 12px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 16px;
  background-color: white;
`;

const Button = styled.button`
  padding: 14px;
  background-color: #10b981;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: bold;
  font-size: 16px;
  cursor: pointer;
  margin-top: 12px;

  &:disabled {
    background-color: #9ca3af;
    cursor: not-allowed;
  }
`;

export const RefundProcessing = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [paymentMethod, setPaymentMethod] = useState("Original Payment Method");
  const [customAmount, setCustomAmount] = useState("");

  const { data: returnDetails, isLoading } = useQuery({
    queryKey: ["returnDetails", id],
    queryFn: () => fetchReturnDetails(id),
  });

  const refundMutation = useMutation({
    mutationFn: createRefund,
    onSuccess: () => {
      statusMutation.mutate("Refunded");
    },
    onError: () => {
      toast.error("Failed to process refund.");
    },
  });

  const statusMutation = useMutation({
    mutationFn: (status) => updateReturnStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries(["returns"]);
      queryClient.invalidateQueries(["refunds"]);
      queryClient.invalidateQueries(["returnDetails", id]);
      toast.success("Refund processed successfully!");
      navigate("/refunds");
    },
  });

  const handleProcessRefund = () => {
    if (!returnDetails) return;

    if (returnDetails.status === "Refunded") {
      toast.error("Error: This return has already been refunded.");
      return;
    }

    const amountToRefund = customAmount
      ? parseFloat(customAmount)
      : returnDetails.price;

    refundMutation.mutate({
      return_request_id: id,
      refund_amount: amountToRefund,
      payment_method: paymentMethod,
    });
  };

  if (isLoading) return <div>Loading refund details...</div>;
  if (!returnDetails) return <div>Return request not found.</div>;

  if (returnDetails.status === "Refunded") {
    return (
      <PageLayout>
        <span
          style={{
            cursor: "pointer",
            color: "#6B7280",
            display: "block",
            marginBottom: "16px",
          }}
          onClick={() => navigate("/refunds")}
        >
          ← Back to Refunds
        </span>
        <h2 style={{ marginBottom: "24px" }}>Issue Refund</h2>
        <Card
          style={{
            borderLeft: "4px solid #EF4444",
            backgroundColor: "#FEF2F2",
          }}
        >
          <h3 style={{ color: "#991B1B", margin: "0 0 8px 0" }}>
            Refund Already Processed
          </h3>
          <p
            style={{
              color: "#7F1D1D",
              fontSize: "14px",
              margin: 0,
              lineHeight: 1.5,
            }}
          >
            A refund transaction has already been completed for{" "}
            <strong>Return #{returnDetails.return_number}</strong>. The system
            blocks duplicate payouts to protect financial records.
          </p>
        </Card>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <span
        style={{
          cursor: "pointer",
          color: "#6B7280",
          display: "block",
          marginBottom: "16px",
        }}
        onClick={() => navigate("/refunds")}
      >
        ← Back to Pending Refunds
      </span>

      <h2 style={{ marginBottom: "24px" }}>Issue Refund</h2>

      <Card>
        <div
          style={{
            padding: "16px",
            backgroundColor: "#F3F4F6",
            borderRadius: "6px",
          }}
        >
          <h4 style={{ margin: "0 0 8px 0", color: "#374151" }}>
            Customer Details
          </h4>
          <p style={{ margin: 0, fontSize: "14px", color: "#6B7280" }}>
            <strong>Return ID:</strong> {returnDetails.return_number}
            <br />
            <strong>Item:</strong> {returnDetails.product_name}
            <br />
            <strong>Original Price:</strong> ₹{returnDetails.price}
          </p>
        </div>

        <FormGroup>
          <label style={{ fontWeight: 500 }}>Refund Amount (₹)</label>
          <Input
            type="number"
            placeholder={returnDetails.price}
            value={customAmount}
            onChange={(e) => setCustomAmount(e.target.value)}
            disabled={refundMutation.isLoading || statusMutation.isLoading}
          />
          <span style={{ fontSize: "12px", color: "#6B7280" }}>
            Leave blank to refund the full amount (₹{returnDetails.price}).
          </span>
        </FormGroup>

        <FormGroup>
          <label style={{ fontWeight: 500 }}>Payment Method</label>
          <Select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            disabled={refundMutation.isLoading || statusMutation.isLoading}
          >
            <option value="Original Payment Method">
              Original Payment Method (Credit/Debit Card)
            </option>
            <option value="Store Credit">Store Credit / Wallet</option>
            <option value="Bank Transfer">Direct Bank Transfer</option>
          </Select>
        </FormGroup>

        {/* Button automatically disables itself immediately during submission to stop double-clicking */}
        <Button
          onClick={handleProcessRefund}
          disabled={refundMutation.isLoading || statusMutation.isLoading}
        >
          {refundMutation.isLoading || statusMutation.isLoading
            ? "Processing..."
            : `Issue Refund of ₹${customAmount || returnDetails.price}`}
        </Button>
      </Card>
    </PageLayout>
  );
};
