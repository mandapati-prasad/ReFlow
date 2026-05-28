import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchReturnComments, postReturnComment } from "../../services/returns";

import {
  CommentsContainer,
  CommentList,
  CommentItem,
  CommentArea,
  PostButton,
} from "./styledComponents";

export const Comments = ({ returnId }) => {
  const [text, setText] = useState("");
  const queryClient = useQueryClient();

  const { data: comments } = useQuery({
    queryKey: ["comments", returnId],
    queryFn: () => fetchReturnComments(returnId),
  });

  const mutation = useMutation({
    mutationFn: (commentData) => postReturnComment(returnId, commentData),
    onSuccess: () => {
      queryClient.invalidateQueries(["comments", returnId]);
      setText("");
    },
    onError: (error) => {
      alert("Failed to post comment. Check console.");
      console.error(error);
    },
  });

  const handlePost = () => {
    mutation.mutate({ comment: text });
  };

  return (
    <CommentsContainer>
      <h4>Comments</h4>
      <CommentList>
        {comments?.map((c) => (
          <CommentItem key={c.id}>
            <strong>
              {c.full_name}({c.role}):
            </strong>{" "}
            {c.comment}
          </CommentItem>
        ))}
        {comments?.length === 0 && (
          <div style={{ color: "#6B7280", fontSize: "13px" }}>
            No comments yet.
          </div>
        )}
      </CommentList>

      <CommentArea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Write a comment..."
      />

      <PostButton
        onClick={handlePost}
        disabled={!text.trim() || mutation.isLoading}
      >
        {mutation.isLoading ? "Posting..." : "Post Comment"}
      </PostButton>
    </CommentsContainer>
  );
};
