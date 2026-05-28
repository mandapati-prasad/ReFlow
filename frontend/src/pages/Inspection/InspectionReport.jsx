import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { createInspectionReport } from "../../services/admin";
import { useAuth } from "../../context/AuthContext";

import {
  FormCard,
  FormGroup,
  Select,
  TextArea,
  Button,
} from "./styledComponents";

export const InspectionReport = () => {
  const { register, handleSubmit, reset } = useForm();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const returnId = searchParams.get("returnId");

  useEffect(() => {
    if (!returnId) {
      toast.error("Please select a return request to inspect.");
      navigate("/returns");
    }
  }, [returnId, navigate]);

  const mutation = useMutation({
    mutationFn: createInspectionReport,
    onSuccess: () => {
      toast.success("Inspection report saved successfully!");
      reset();
      navigate(`/returns/${returnId}`);
    },
    onError: () => toast.error("Failed to save inspection report."),
  });

  const onSubmit = (data) => {
    mutation.mutate({
      ...data,
      return_request_id: returnId,
      inspector_name: user.full_name,
    });
  };

  if (!returnId) return null;

  return (
    <div>
      <span
        style={{
          cursor: "pointer",
          color: "#6B7280",
          display: "block",
          marginBottom: "16px",
        }}
        onClick={() => navigate(-1)}
      >
        ← Back
      </span>
      <h2 style={{ marginBottom: "24px" }}>Log Inspection Report</h2>

      <FormCard onSubmit={handleSubmit(onSubmit)}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "20px",
          }}
        >
          <FormGroup>
            <label>Product Condition</label>
            <Select {...register("product_condition")}>
              <option value="New in box">New in box</option>
              <option value="Good">Good</option>
              <option value="Damaged">Damaged</option>
              <option value="Defective">Defective</option>
            </Select>
          </FormGroup>

          <FormGroup>
            <label>Packaging Condition</label>
            <Select {...register("packaging_condition")}>
              <option value="Unopened">Unopened</option>
              <option value="Opened/Good">Opened/Good</option>
              <option value="Damaged">Damaged</option>
            </Select>
          </FormGroup>
        </div>

        <FormGroup>
          <label>Accessories Included?</label>
          <Select {...register("accessories_included")}>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
            <option value="Partial">Partial</option>
          </Select>
        </FormGroup>

        <FormGroup>
          <label>Inspection Notes</label>
          <TextArea
            placeholder="Describe the physical state..."
            {...register("inspection_notes")}
          />
        </FormGroup>

        <FormGroup>
          <label>Recommended Result</label>
          <Select {...register("inspection_result")}>
            <option value="Approve Return">Approve Return</option>
            <option value="Reject Return">Reject Return</option>
            <option value="Partial Refund">Partial Refund</option>
          </Select>
        </FormGroup>

        <Button type="submit" disabled={mutation.isLoading}>
          {mutation.isLoading ? "Saving..." : "Submit Report"}
        </Button>
      </FormCard>
    </div>
  );
};
