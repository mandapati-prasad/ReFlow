import styled from "styled-components";
import { FiBell } from "react-icons/fi";

export const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background-color: ${({ theme }) => theme.colors.surface};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  position: sticky;
  top: 0;
  z-index: 50;
`;

export const NotificationWrapper = styled.div`
  position: relative;
`;

export const BellIcon = styled(FiBell)`
  font-size: 20px;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.textMuted};
  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

export const Badge = styled.span`
  position: absolute;
  top: -5px;
  right: -5px;
  background-color: ${({ theme }) => theme.colors.danger};
  color: white;
  font-size: 10px;
  font-weight: bold;
  padding: 2px 6px;
  border-radius: 10px;
`;

export const Dropdown = styled.div`
  position: absolute;
  top: 30px;
  right: 0;
  width: 320px;
  background-color: white;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  box-shadow: ${({ theme }) => theme.shadows.md};
  max-height: 400px;
  overflow-y: auto;
  display: ${({ $isOpen }) => ($isOpen ? "block" : "none")};
`;

export const NotificationItem = styled.div`
  padding: 16px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  background-color: ${({ $isRead }) => ($isRead ? "white" : "#F3F4F6")};

  h4 {
    font-size: 14px;
    margin-bottom: 4px;
    color: #111827;
  }
  p {
    font-size: 12px;
    color: #6b7280;
  }
`;
