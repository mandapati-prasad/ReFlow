import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { fetchUsers, updateUserStatus } from "../../services/admin";
import { Table } from "../../components/Table/Table";
import { Badge } from "../../components/Badge/Badge";
import { Spinner } from "../../components/Loader/Spinner";
import { deleteUser } from "../../services/admin";

export const UserManagement = () => {
  const queryClient = useQueryClient();

  const { data: users, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
      toast.success("User permanently deleted.");
    },
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }) => updateUserStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
      toast.success("User status updated.");
    },
  });

  const handleDelete = (id) => {
    if (window.confirm("Are you sure? This action cannot be undone.")) {
      deleteMutation.mutate(id);
    }
  };

  const columns = [
    { header: "Name", accessor: "full_name" },
    { header: "Email", accessor: "email" },
    {
      header: "Role",
      render: (row) => (
        <span style={{ textTransform: "capitalize" }}>
          {row.role.replace("_", " ")}
        </span>
      ),
    },
    { header: "Status", render: (row) => <Badge status={row.status} /> },
    {
      header: "Action",
      render: (row) => (
        <select
          value={row.status}
          onChange={(e) =>
            statusMutation.mutate({ id: row.id, status: e.target.value })
          }
          style={{ padding: "6px", borderRadius: "4px" }}
        >
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      ),
    },

    {
      header: "Manage",
      render: (row) => (
        <button
          onClick={() => handleDelete(row.id)}
          style={{
            color: "white",
            background: "#EF4444",
            border: "none",
            padding: "6px 12px",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Delete
        </button>
      ),
    },
  ];

  if (isLoading) return <Spinner />;

  return (
    <div>
      <h2 style={{ marginBottom: "24px" }}>User Management</h2>
      <Table columns={columns} data={users} />
    </div>
  );
};
