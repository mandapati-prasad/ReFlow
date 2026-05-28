import styled from "styled-components";

export const CommentsContainer = styled.div`
  margin-top: 24px;
`;

export const CommentList = styled.div`
  max-height: 200px;
  overflow-y: auto;
  margin-bottom: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const CommentItem = styled.div`
  font-size: 13px;
  padding: 10px;
  background-color: ${({ theme }) => theme.colors?.background || "#f9fafb"};
  border-left: 3px solid ${({ theme }) => theme.colors?.primary || "#3b82f6"};
  border-radius: 4px;
`;

export const CommentArea = styled.textarea`
  width: 100%;
  padding: 12px;
  border: 1px solid ${({ theme }) => theme.colors?.border || "#d1d5db"};
  border-radius: ${({ theme }) => theme.borderRadius?.md || "6px"};
  min-height: 80px;
  margin-bottom: 12px;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors?.primary || "#3b82f6"};
  }
`;

export const PostButton = styled.button`
  width: 100%;
  padding: 10px;
  background-color: ${({ theme }) => theme.colors?.primary || "#3b82f6"};
  color: white;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius?.md || "6px"};
  font-weight: 600;
  cursor: pointer;

  &:disabled {
    background-color: #9ca3af;
    cursor: not-allowed;
  }
`;
