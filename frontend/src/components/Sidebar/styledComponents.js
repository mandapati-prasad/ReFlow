import styled from "styled-components";
import { NavLink } from "react-router-dom";

export const SidebarContainer = styled.aside`
  width: 260px;
  background-color: ${({ theme }) => theme.colors.surface};
  border-right: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  flex-direction: column;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
  transition: transform 0.3s ease;

  @media (max-width: 768px) {
    transform: ${({ $isOpen }) =>
      $isOpen ? "translateX(0)" : "translateX(-100%)"};
  }
`;

export const MenuIcon = styled.div`
  @media (min-width: 998px) {
    display: none;
  }
`;

export const Overlay = styled.div`
  display: none;
  @media (max-width: 768px) {
    display: ${({ $isOpen }) => ($isOpen ? "block" : "none")};
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 90;
  }
`;

export const LogoArea = styled.div`
  padding: 24px;
  font-size: 24px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.primary};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const NavList = styled.nav`
  display: flex;
  flex-direction: column;
  padding: 0 16px;
  gap: 8px;
  flex: 1;
`;

export const StyledLink = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.colors.textMuted};
  font-weight: 500;
  transition: all 0.2s;

  &:hover {
    background-color: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.primary};
  }

  &.active {
    background-color: ${({ theme }) =>
      theme.colors.primary}15; /* 15% opacity */
    color: ${({ theme }) => theme.colors.primary};
  }
`;

// NEW: Styled component for the red notification dot
export const NotificationBadge = styled.span`
  background-color: #ef4444; /* Tailwind red-500 */
  color: white;
  font-size: 11px;
  font-weight: bold;
  padding: 2px 8px;
  border-radius: 12px;
  margin-left: auto; /* Pushes the badge to the far right of the link */
`;

export const LogoutButton = styled.button`
  margin: 24px 16px;
  padding: 12px;
  display: flex;
  align-items: center;
  gap: 12px;
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.danger};
  font-weight: bold;
  border-radius: ${({ theme }) => theme.borderRadius.md};

  &:hover {
    background-color: ${({ theme }) => theme.colors.dangerBg};
  }
`;
