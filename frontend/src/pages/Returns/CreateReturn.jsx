import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import styled from "styled-components";
import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createReturnRequest } from "../../services/returns";

const FormContainer = styled.form`
  background-color: ${({ theme }) => theme.colors.surface};
  padding: 32px;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  border: 1px solid ${({ theme }) => theme.colors.border};
  max-width: 600px;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textDark};
`;

const Input = styled.input`
  padding: 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  outline: none;
  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const Select = styled.select`
  padding: 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background-color: white;
  outline: none;
`;

const TextArea = styled.textarea`
  padding: 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  resize: vertical;
  min-height: 100px;
  outline: none;
`;

const SubmitButton = styled.button`
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  padding: 14px;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-weight: bold;
  margin-top: 16px;
  cursor: pointer;
  opacity: ${({ disabled }) => (disabled ? 0.7 : 1)};
`;

export const CreateReturn = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const [errorMsg, setErrorMsg] = useState("");

  const itemId = searchParams.get("itemId");

  useEffect(() => {
    if (!itemId) {
      toast.error("Please select an item from your orders to return.");
      navigate("/orders");
    }
  }, [itemId, navigate]);

  const mutation = useMutation({
    mutationFn: createReturnRequest,
    onSuccess: () => {
      queryClient.invalidateQueries(["returns"]);
      toast.success("Return request submitted successfully!");
      navigate("/returns");
    },
    onError: () => {
      toast.error("Failed to submit request. Please try again.");
    },
  });

  const onSubmit = (data) => {
    const formData = new FormData();

    formData.append("order_item_id", itemId);
    formData.append("reason", data.reason);
    formData.append("description", data.description);

    if (data.returnImage[0]) {
      formData.append("returnImage", data.returnImage[0]);
    }

    mutation.mutate(formData);
  };

  if (!itemId) return null;

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
      <h2 style={{ marginBottom: "24px" }}>Create Return Request</h2>
      {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}

      <FormContainer onSubmit={handleSubmit(onSubmit)}>
        <FormGroup>
          <Label>Reason for Return</Label>
          <Select {...register("reason", { required: true })}>
            <option value="">Select a reason...</option>
            <option value="Damaged Product">Damaged Product</option>
            <option value="Wrong Item">Wrong Item</option>
            <option value="Size Issue">Size Issue</option>
            <option value="Not Working">Not Working</option>
          </Select>
          {errors.reason && (
            <span style={{ color: "red", fontSize: "12px" }}>Required</span>
          )}
        </FormGroup>

        <FormGroup>
          <Label>Detailed Description</Label>
          <TextArea
            placeholder="Please provide details about the issue..."
            {...register("description", { required: true })}
          />
          {errors.description && (
            <span style={{ color: "red", fontSize: "12px" }}>Required</span>
          )}
        </FormGroup>

        <FormGroup>
          <Label>Upload Image (Optional)</Label>
          <Input type="file" accept="image/*" {...register("returnImage")} />
        </FormGroup>

        <SubmitButton type="submit" disabled={mutation.isLoading}>
          {mutation.isLoading ? "Submitting..." : "Submit Request"}
        </SubmitButton>
      </FormContainer>
    </div>
  );
};
