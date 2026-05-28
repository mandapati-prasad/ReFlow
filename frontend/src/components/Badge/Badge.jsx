import { BadgeContainer } from "./styledComponents";

export const Badge = ({ status }) => {
  return <BadgeContainer $status={status}>{status}</BadgeContainer>;
};
