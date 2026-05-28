import styled from "styled-components";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { fetchOrderDetails, fetchOrderItems } from "../../services/orders";
import { Badge } from "../../components/Badge/Badge";
import { Spinner } from "../../components/Loader/Spinner";
import { useAuth } from "../../context/AuthContext";

const Card = styled.div`
  background: white;
  padding: 24px;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  margin-bottom: 24px;
`;

const ItemRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  border-bottom: 1px solid #e5e7eb;
  &:last-child {
    border-bottom: none;
  }
`;

const ReturnButton = styled.button`
  padding: 6px 12px;
  background-color: white;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  color: #374151;
  transition: all 0.2s;
  margin-top: 8px;

  &:hover {
    background-color: #f3f4f6;
    border-color: #9ca3af;
  }
`;

export const OrderDetails = () => {
  const { user } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: order, isLoading: loadingOrder } = useQuery({
    queryKey: ["order", id],
    queryFn: () => fetchOrderDetails(id),
  });

  const { data: items, isLoading: loadingItems } = useQuery({
    queryKey: ["orderItems", id],
    queryFn: () => fetchOrderItems(id),
  });

  if (loadingOrder || loadingItems) return <Spinner />;
  if (!order) return <div>Order not found.</div>;

  return (
    <div>
      <span
        style={{
          cursor: "pointer",
          color: "#6B7280",
          display: "block",
          marginBottom: "16px",
        }}
        onClick={() => navigate("/orders")}
      >
        ← Back to Orders
      </span>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
        }}
      >
        <h2>Order #{order.order_number}</h2>
        <Badge status={order.status} />
      </div>

      <Card>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "16px",
            color: "#6B7280",
          }}
        >
          <span>
            Placed on: {format(new Date(order.created_at), "dd MMM yyyy, p")}
          </span>
          <span style={{ fontWeight: "bold", color: "#111827" }}>
            Total: ₹{order.total_amount.toLocaleString("en-IN")}
          </span>
        </div>
      </Card>

      <h3>Items in this Order</h3>
      <Card style={{ marginTop: "16px" }}>
        {items?.map((item) => (
          <ItemRow key={item.id}>
            <div style={{ display: "flex", gap: "16px" }}>
              <img
                src={`${item.image_url}`}
                alt={item.product_name}
                style={{
                  width: "60px",
                  height: "60px",
                  borderRadius: "4px",
                  objectFit: "cover",
                }}
              />
              <div>
                <div style={{ fontWeight: "bold" }}>{item.product_name}</div>
                <div style={{ color: "#6B7280", fontSize: "14px" }}>
                  Quantity: {item.quantity}
                </div>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
              }}
            >
              <div style={{ fontWeight: "bold" }}>
                ₹{item.price.toLocaleString("en-IN")}
              </div>
              {/* CHANGED: Added Return Button that passes the itemId in the URL */}
              {user?.role === "customer" && (
                <ReturnButton
                  onClick={() => navigate(`/returns/new?itemId=${item.id}`)}
                >
                  Return this Item
                </ReturnButton>
              )}
            </div>
          </ItemRow>
        ))}
      </Card>

      <h3>Product Preview</h3>
      <div style={{ display: "flex", gap: "24px", marginTop: "16px" }}>
        <Card
          style={{ flex: "1", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)" }}
        >
          <img
            src={`${items[0]?.image_url}`}
            alt="Large product view"
            style={{ width: "100%", height: "auto", borderRadius: "4px" }}
          />
        </Card>
        <Card
          style={{ flex: "1", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)" }}
        >
          <h4>{items[0]?.product_name}</h4>
          <p style={{ color: "#6B7280" }}>
            <strong>Category:</strong> {items[0]?.category || "General"}
          </p>
          <p style={{ color: "#6B7280" }}>
            <strong>Price:</strong> ₹{items[0]?.price.toLocaleString("en-IN")}
          </p>
          <p style={{ color: "#6B7280" }}>
            <strong>Quantity:</strong> {items[0]?.quantity}
          </p>
          <hr
            style={{
              margin: "16px 0",
              border: "0",
              borderTop: "1px solid #e5e7eb",
            }}
          />
          <p style={{ fontSize: "14px", color: "#4B5563" }}>
            This high-quality product is part of your order #
            {order.order_number}.
          </p>
        </Card>
      </div>
    </div>
  );
};
