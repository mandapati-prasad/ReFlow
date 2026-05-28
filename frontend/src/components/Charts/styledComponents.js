import styled from "styled-components";

export const ChartsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
  margin-top: 24px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

export const ChartCard = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  padding: 24px;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  border: 1px solid ${({ theme }) => theme.colors.border};
  height: 350px;
  display: flex;
  flex-direction: column;
`;

export const ChartTitle = styled.h3`
  font-size: 16px;
  margin-bottom: 20px;
  color: ${({ theme }) => theme.colors.textDark};
`;
