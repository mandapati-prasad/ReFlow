import { useState } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { Sidebar } from "../Sidebar/Sidebar";
import { useAuth } from "../../context/AuthContext";
import { FiMenu } from "react-icons/fi";

import { LayoutWrapper, MainContent, MobileHeader } from "./styledComponents";

export const Layout = () => {
  const { user, loading } = useAuth();
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;

  return (
    <LayoutWrapper>
      <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={() => setSidebarOpen(!isSidebarOpen)}
      />
      <MainContent>
        <MobileHeader>
          <FiMenu
            size={24}
            onClick={() => setSidebarOpen(true)}
            style={{ cursor: "pointer" }}
          />
          <h3>ReFlow</h3>
        </MobileHeader>
        <div style={{ padding: "24px", flex: 1 }}>
          <Outlet />{" "}
        </div>
      </MainContent>
    </LayoutWrapper>
  );
};
