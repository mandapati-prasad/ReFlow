import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { fetchProfile, updateProfileImage } from "../../services/profile";
import { Spinner } from "../../components/Loader/Spinner";

import { Card, Avatar } from "./styledComponents";

const imgUrl = import.meta.env.VITE_BACKEND_IMG_URL

export const Profile = () => {

  const queryClient = useQueryClient();
  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: fetchProfile,
  });

  const mutation = useMutation({
    mutationFn: updateProfileImage,
    onSuccess: () => {
      queryClient.invalidateQueries(["profile"]);
      toast.success("Profile image updated!");
    },
  });

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("profileImage", file);
      mutation.mutate(formData);
    }
  };

  if (isLoading) return <Spinner />;

  return (
    <div>
      <h2 style={{ marginBottom: "24px" }}>My Profile</h2>
      <Card>
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <Avatar
            src={
              profile?.profile_image
                ? `${imgUrl}${profile.profile_image}`
                : "https://plus.unsplash.com/premium_vector-1682269287900-d96e9a6c188b?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            }
            alt="Avatar"
          />
          <div>
            <label
              style={{
                cursor: "pointer",
                color: "#4F46E5",
                fontSize: "14px",
                fontWeight: "bold",
              }}
            >
              Change Picture
              <input
                type="file"
                style={{ display: "none" }}
                accept="image/*"
                onChange={handleImageUpload}
              />
            </label>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <div>
            <strong>Name:</strong> {profile?.full_name}
          </div>
          <div>
            <strong>Email:</strong> {profile?.email}
          </div>
          <div>
            <strong>Role:</strong>{" "}
            <span style={{ textTransform: "capitalize" }}>
              {profile?.role.replace("_", " ")}
            </span>
          </div>
          <div>
            <strong>Status:</strong> {profile?.status}
          </div>
        </div>
      </Card>
    </div>
  );
};
