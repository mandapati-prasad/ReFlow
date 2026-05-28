import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { FiCheck, FiCheckCircle, FiBell } from "react-icons/fi";
import {
  fetchNotifications,
  markAsRead,
  markAllAsRead,
} from "../../services/notifications";
import { Spinner } from "../../components/Loader/Spinner";
import { toast } from "react-toastify";

import {
  PageHeader,
  Title,
  NotificationCard,
  ContentArea,
  Message,
  Time,
  ReadButton,
  MarkAllButton,
} from "./styledComponents";

export const Notifications = () => {
  const queryClient = useQueryClient();

  // 1. Fetch Notifications
  const { data: notifications, isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: fetchNotifications,
  });

  // 2. Mutation to mark a single notification as read
  const markReadMutation = useMutation({
    mutationFn: markAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
    onError: (error) => {
      console.error(error);
      toast.error("Could not connect to the server to update notification.");
    },
  });

  // 3. Mutation to mark all as read
  const markAllReadMutation = useMutation({
    mutationFn: markAllAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      toast.success("All notifications cleared!");
    },
    onError: (error) => {
      console.error(error);
      toast.error("Failed to clear notifications. Check your backend.");
    },
  });

  if (isLoading) return <Spinner />;

  const unreadCount = notifications?.filter((n) => !n.is_read).length || 0;

  return (
    <div>
      <PageHeader>
        <Title>Notifications</Title>
        {/* Only show "Mark all as read" if there are actually unread messages */}
        {unreadCount > 0 && (
          <MarkAllButton
            onClick={() => markAllReadMutation.mutate()}
            disabled={markAllReadMutation.isLoading}
          >
            <FiCheckCircle /> Mark all as read
          </MarkAllButton>
        )}
      </PageHeader>

      {notifications && notifications.length > 0 ? (
        <div style={{ display: "flex", flexDirection: "column" }}>
          {notifications.map((notification) => (
            <NotificationCard
              key={notification.id}
              $isRead={notification.is_read}
            >
              <ContentArea>
                <Message $isRead={notification.is_read}>
                  {notification.message}
                </Message>
                <Time>
                  {format(
                    new Date(notification.created_at),
                    "MMM d, yyyy 'at' h:mm a"
                  )}
                </Time>
              </ContentArea>

              {/* Only show the checkmark button if it hasn't been read yet */}
              {!notification.is_read && (
                <ReadButton
                  onClick={() => markReadMutation.mutate(notification.id)}
                  disabled={markReadMutation.isLoading}
                >
                  <FiCheck /> Mark as read
                </ReadButton>
              )}
            </NotificationCard>
          ))}
        </div>
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
          <FiBell
            size={40}
            style={{ color: "#D1D5DB", marginBottom: "16px" }}
          />
          <p>You're all caught up! No notifications yet.</p>
        </div>
      )}
    </div>
  );
};
