import styled from "styled-components";


export const LayoutWrapper = styled.div`
  display: flex;
  min-height: 100vh;
`;

export const MainContent = styled.main`
  flex: 1;
  margin-left: 260px;
  background-color: ${({ theme }) => theme.colors.background};
  display: flex;
  flex-direction: column;

  @media (max-width: 768px) {
    margin-left: 0;
  }
`;

export const MobileHeader = styled.header`
  display: none;
  padding: 16px;
  background: ${({ theme }) => theme.colors.surface};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    gap: 16px;
  }
`;