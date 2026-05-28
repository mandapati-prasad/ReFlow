import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FiMenu } from "react-icons/fi";
import {
  fetchNotifications,
  markNotificationsRead,
} from "../../services/notifications";
import { useAuth } from "../../context/AuthContext";

import {
  HeaderContainer,
  NotificationWrapper,
  BellIcon,
  Badge,
  Dropdown,
  NotificationItem,
} from "./styledComponents";

export const Header = ({ toggleSidebar }) => {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const { data: notifications } = useQuery({
    queryKey: ["notifications"],
    queryFn: fetchNotifications,
    enabled: !!user,
  });

  const mutation = useMutation({
    mutationFn: markNotificationsRead,
    onSuccess: () => queryClient.invalidateQueries(["notifications"]),
  });

  const unreadCount = notifications?.filter((n) => !n.is_read).length || 0;

  const handleOpen = () => {
    setIsOpen(!isOpen);
    if (!isOpen && unreadCount > 0) {
      mutation.mutate(); // Mark all as read when opening
    }
  };

  return (
    <HeaderContainer>
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <FiMenu
          size={24}
          onClick={toggleSidebar}
          style={{ cursor: "pointer", display: "block" }}
          className="mobile-only"
        />
        <h3 style={{ margin: 0 }}>ReFlow</h3>
      </div>

      <NotificationWrapper>
        <BellIcon onClick={handleOpen} />
        {unreadCount > 0 && <Badge>{unreadCount}</Badge>}

        <Dropdown $isOpen={isOpen}>
          <div
            style={{
              padding: "12px 16px",
              borderBottom: "1px solid #E5E7EB",
              fontWeight: "bold",
            }}
          >
            Notifications
          </div>
          {notifications?.length === 0 ? (
            <div
              style={{ padding: "16px", textAlign: "center", color: "#6B7280" }}
            >
              No new notifications
            </div>
          ) : (
            notifications?.map((note) => (
              <NotificationItem key={note.id} $isRead={note.is_read}>
                <h4>{note.title}</h4>
                <p>{note.message}</p>
              </NotificationItem>
            ))
          )}
        </Dropdown>
      </NotificationWrapper>
    </HeaderContainer>
  );
};
