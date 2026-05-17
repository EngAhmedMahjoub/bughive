"use client";

import { Button, Flex, TextArea } from "@radix-ui/themes";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

const MAX = 2000;

const CommentForm = ({ issueId }: { issueId: number }) => {
  const router = useRouter();
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!body.trim() || submitting) return;
    setSubmitting(true);
    try {
      await axios.post(`/api/issues/${issueId}/comments`, { body });
      setBody("");
      router.refresh();
    } catch {
      toast.error("Could not post comment.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <form onSubmit={submit}>
        <Flex direction="column" gap="2">
          <TextArea
            placeholder="Write a comment..."
            value={body}
            maxLength={MAX}
            onChange={(e) => setBody(e.target.value)}
            disabled={submitting}
          />
          <Flex justify="end" align="center" gap="3">
            <Button type="submit" disabled={submitting || !body.trim()}>
              {submitting ? "Posting..." : "Post comment"}
            </Button>
          </Flex>
        </Flex>
      </form>
      <Toaster />
    </>
  );
};

export default CommentForm;
