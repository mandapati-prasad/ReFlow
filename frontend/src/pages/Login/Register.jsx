import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { registerUser } from "../../services/authService";

import { Container, FormCard, Input, Button } from "./styledComponents";

export const Register = () => {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    role: "customer",
  });
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: registerUser,
    onSuccess: () => {
      toast.success("Registration successful! Please log in.");
      navigate("/login");
    },
    onError: () => toast.error("Registration failed."),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  return (
    <Container>
      <FormCard onSubmit={handleSubmit}>
        <h2 style={{ textAlign: "center", color: "#4F46E5" }}>Join ReFlow</h2>
        <Input
          type="text"
          placeholder="Full Name"
          required
          onChange={(e) =>
            setFormData({ ...formData, full_name: e.target.value })
          }
        />
        <Input
          type="email"
          placeholder="Email Address"
          required
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
        <Input
          type="password"
          placeholder="Password"
          required
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
        />
        <Button type="submit" disabled={mutation.isLoading}>
          {mutation.isLoading ? "Creating Account..." : "Register"}
        </Button>
        <p style={{ textAlign: "center", fontSize: "14px", marginTop: "10px" }}>
          Already have an account?{" "}
          <Link to="/login" style={{ color: "#4F46E5" }}>
            Log in
          </Link>
        </p>
      </FormCard>
    </Container>
  );
};
