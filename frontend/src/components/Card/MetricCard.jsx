import { CardContainer, Title, Value } from "./styledComponents";

export const MetricCard = ({ title, value }) => {
  return (
    <CardContainer>
      <Title>{title}</Title>
      <Value>{value !== undefined ? value : "-"}</Value>
    </CardContainer>
  );
};
