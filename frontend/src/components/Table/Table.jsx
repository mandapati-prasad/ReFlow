import { useState } from "react";

import {
  TableWrapper,
  StyledTable,
  Th,
  Td,
  Tr,
  PageButton,
  PaginationContainer,
} from "./styledComponents";

export const Table = ({ columns, data, itemsPerPage = 5 }) => {
  const [currentPage, setCurrentPage] = useState(1);

  if (!data || data.length === 0) {
    return (
      <TableWrapper
        style={{ padding: "24px", textAlign: "center", color: "#6B7280" }}
      >
        No records found.
      </TableWrapper>
    );
  }

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = data.slice(startIndex, startIndex + itemsPerPage);

  return (
    <TableWrapper>
      <StyledTable>
        <thead>
          <tr>
            {columns.map((col, i) => (
              <Th key={i}>{col.header}</Th>
            ))}
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((row, rowIndex) => (
            <Tr key={rowIndex}>
              {columns.map((col, colIndex) => (
                <Td key={colIndex}>
                  {col.render ? col.render(row) : row[col.accessor]}
                </Td>
              ))}
            </Tr>
          ))}
        </tbody>
      </StyledTable>

      {totalPages > 1 && (
        <PaginationContainer>
          <span style={{ fontSize: "14px", color: "#6B7280" }}>
            Showing {startIndex + 1} to{" "}
            {Math.min(startIndex + itemsPerPage, data.length)} of {data.length}{" "}
            entries
          </span>
          <div style={{ display: "flex", gap: "8px" }}>
            <PageButton
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              Previous
            </PageButton>
            <PageButton
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              Next
            </PageButton>
          </div>
        </PaginationContainer>
      )}
    </TableWrapper>
  );
};
