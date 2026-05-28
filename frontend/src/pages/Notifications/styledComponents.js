import styled from "styled-components";

export const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

export const Title = styled.h1`
  font-size: 24px;
  color: ${({ theme }) => theme.colors?.textDark || "#111827"};
`;

export const NotificationCard = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 16px;
  background-color: ${({ $isRead }) => ($isRead ? "#ffffff" : "#EFF6FF")};
  border: 1px solid ${({ $isRead }) => ($isRead ? "#E5E7EB" : "#BFDBFE")};
  border-radius: 8px;
  margin-bottom: 12px;
  transition: all 0.2s;

  &:hover {
    border-color: #93c5fd;
  }
`;

export const ContentArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const Message = styled.p`
  margin: 0;
  font-size: 15px;
  color: ${({ $isRead }) => ($isRead ? "#4B5563" : "#111827")};
  font-weight: ${({ $isRead }) => ($isRead ? "400" : "500")};
`;

export const Time = styled.span`
  font-size: 12px;
  color: #6b7280;
`;

export const ReadButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  background: none;
  border: none;
  color: #3b82f6;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;

  &:hover {
    background-color: #dbeafe;
  }

  &:disabled {
    color: #9ca3af;
    cursor: not-allowed;
  }
`;

export const MarkAllButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background-color: white;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  color: #374151;
  font-weight: 500;
  cursor: pointer;

  &:hover {
    background-color: #f3f4f6;
  }
`;
