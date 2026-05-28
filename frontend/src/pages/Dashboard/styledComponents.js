import styled from "styled-components";

// --- Styled Components ---
export const PageHeader = styled.div`
  margin-bottom: 32px;
`;

export const Greeting = styled.h1`
  font-size: 28px;
  color: #111827;
  margin: 0 0 8px 0;
`;

export const Subtitle = styled.p`
  color: #6b7280;
  margin: 0;
  font-size: 16px;
`;

export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
`;

export const StatCard = styled.div`
  background: white;
  padding: 24px;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  gap: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
`;

export const IconWrapper = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  background-color: ${({ $bg }) => $bg || "#F3F4F6"};
  color: ${({ $color }) => $color || "#374151"};
`;

export const StatInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

export const StatLabel = styled.span`
  font-size: 14px;
  color: #6b7280;
  font-weight: 500;
`;

export const StatValue = styled.span`
  font-size: 24px;
  font-weight: bold;
  color: #111827;
`;

export const ChartsGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
  margin-bottom: 32px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

export const ChartContainer = styled.div`
  background: white;
  padding: 24px;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  height: 350px;
  display: flex;
  flex-direction: column;
`;

export const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

export const Section = styled.div`
  background: white;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  overflow: hidden;
  height: max-content;
`;

export const SectionHeader = styled.div`
  padding: 20px 24px;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const SectionTitle = styled.h2`
  margin: 0;
  font-size: 18px;
  color: #111827;
`;

export const ViewAll = styled.button`
  background: none;
  border: none;
  color: #3b82f6;
  font-weight: 500;
  cursor: pointer;
  font-size: 14px;

  &:hover {
    text-decoration: underline;
  }
`;

export const ListItem = styled.div`
  padding: 16px 24px;
  border-bottom: 1px solid #f3f4f6;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: background-color 0.2s;
  cursor: pointer;

  &:last-child {
    border-bottom: none;
  }
  &:hover {
    background-color: #f9fafb;
  }
`;

export const NotificationItem = styled.div`
  padding: 16px 24px;
  border-bottom: 1px solid #f3f4f6;
  display: flex;
  flex-direction: column;
  gap: 4px;
  background-color: ${({ $unread }) => ($unread ? "#EFF6FF" : "white")};
  border-left: ${({ $unread }) =>
    $unread ? "4px solid #3B82F6" : "4px solid transparent"};
  cursor: pointer;

  &:last-child {
    border-bottom: none;
  }
  &:hover {
    background-color: #f9fafb;
  }
`;
