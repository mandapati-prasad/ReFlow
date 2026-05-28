import styled from "styled-components";


export const BadgeContainer = styled.span`
  padding: 4px 12px;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: 12px;
  font-weight: 600;
  display: inline-block;
  background-color: ${({ $status, theme }) => {
    switch ($status?.toLowerCase()) {
      case "approved":
      case "completed":
        return theme.colors.successBg;
      case "under review":
      case "processing":
        return theme.colors.warningBg;
      case "rejected":
      case "failed":
        return theme.colors.dangerBg;
      default:
        return theme.colors.infoBg; // Requested, Refunded
    }
  }};

  color: ${({ $status, theme }) => {
    switch ($status?.toLowerCase()) {
      case "approved":
      case "completed":
        return theme.colors.success;
      case "under review":
      case "processing":
        return theme.colors.warning;
      case "rejected":
      case "failed":
        return theme.colors.danger;
      default:
        return theme.colors.info;
    }
  }};
`;