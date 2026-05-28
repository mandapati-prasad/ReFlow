import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../context/AuthContext";
import { fetchNotifications } from "../../services/notifications";
import {
  FiHome,
  FiBox,
  FiRefreshCcw,
  FiLogOut,
  FiX,
  FiDollarSign,
  FiClipboard,
  FiUsers,
  FiSettings,
  FiUser,
  FiBell,
} from "react-icons/fi";

import {
  SidebarContainer,
  MenuIcon,
  Overlay,
  LogoArea,
  NavList,
  StyledLink,
  NotificationBadge,
  LogoutButton,
} from "./styledComponents";

export const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { user, logout } = useAuth();

  // NEW: Fetch notifications in the background to power the red badge
  const { data: notifications } = useQuery({
    queryKey: ["notifications"],
    queryFn: fetchNotifications,
    // Only run this query if a user is actually logged in
    enabled: !!user,
    // Refetch every 30 seconds so the badge updates automatically while they work
    refetchInterval: 30000,
  });

  // Calculate how many notifications are unread (assuming your DB has an is_read boolean)
  const unreadCount = notifications?.filter((n) => !n.is_read).length || 0;

  return (
    <>
      <Overlay $isOpen={isOpen} onClick={toggleSidebar} />
      <SidebarContainer $isOpen={isOpen}>
        <LogoArea>
          ReFlow{" "}
          <MenuIcon>
            <FiX size={24} onClick={toggleSidebar} />
          </MenuIcon>
        </LogoArea>

        <NavList>
          <StyledLink to="/dashboard" onClick={toggleSidebar}>
            <FiHome /> Dashboard
          </StyledLink>

          <StyledLink to="/returns" onClick={toggleSidebar}>
            <FiRefreshCcw />{" "}
            {user?.role === "customer" ? "My Returns" : "Returns Management"}
          </StyledLink>

          <StyledLink to="/refunds" onClick={toggleSidebar}>
            <FiDollarSign />{" "}
            {user?.role === "customer" ? "Refund History" : "Refunds"}
          </StyledLink>

          <StyledLink to="/orders" onClick={toggleSidebar}>
            <FiBox /> Orders
          </StyledLink>

          {/* UPDATED: Injected the NotificationBadge */}
          <StyledLink to="/notifications" onClick={toggleSidebar}>
            <FiBell /> Notifications
            {unreadCount > 0 && (
              <NotificationBadge>{unreadCount}</NotificationBadge>
            )}
          </StyledLink>

          {user?.role !== "customer" && (
            <StyledLink to="/inspection" onClick={toggleSidebar}>
              <FiClipboard /> Inspection
            </StyledLink>
          )}

          {user?.role === "admin" && (
            <>
              <StyledLink to="/users" onClick={toggleSidebar}>
                <FiUsers /> Users
              </StyledLink>
              <StyledLink to="/settings" onClick={toggleSidebar}>
                <FiSettings /> Settings
              </StyledLink>
            </>
          )}

          <StyledLink to="/profile" onClick={toggleSidebar}>
            <FiUser /> Profile
          </StyledLink>
        </NavList>

        <LogoutButton onClick={logout}>
          <FiLogOut /> Logout
        </LogoutButton>
      </SidebarContainer>
    </>
  );
};
