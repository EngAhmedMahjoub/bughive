"use client";

import {
  AlertDialog,
  Avatar,
  Button,
  Card,
  Flex,
  Text,
  TextArea,
} from "@radix-ui/themes";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import ReactMarkdown from "react-markdown";

const MAX = 2000;

interface CommentItemProps {
  issueId: number;
  comment: {
    id: number;
    body: string;
    createdAt: string;
    updatedAt: string;
    user: {
      id: string;
      name: string | null;
      image: string | null;
    };
  };
  canModify: boolean;
}

const CommentItem = ({ issueId, comment, canModify }: CommentItemProps) => {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(comment.body);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const wasEdited =
    new Date(comment.updatedAt).getTime() -
      new Date(comment.createdAt).getTime() >
    1000;

  const cancel = () => {
    setDraft(comment.body);
    setEditing(false);
  };

  const save = async () => {
    const trimmed = draft.trim();
    if (!trimmed || submitting) return;
    if (trimmed === comment.body) {
      setEditing(false);
      return;
    }
    setSubmitting(true);
    try {
      await axios.patch(`/api/issues/${issueId}/comments/${comment.id}`, {
        body: trimmed,
      });
      setEditing(false);
      router.refresh();
    } catch {
      toast.error("Could not update comment.");
    } finally {
      setSubmitting(false);
    }
  };

  const remove = async () => {
    setDeleting(true);
    try {
      await axios.delete(`/api/issues/${issueId}/comments/${comment.id}`);
      router.refresh();
    } catch {
      toast.error("Could not delete comment.");
      setDeleting(false);
    }
  };

  return (
    <Card>
      <Flex gap="3" align="start">
        <Avatar
          size="2"
          radius="full"
          src={comment.user.image ?? undefined}
          fallback={(comment.user.name ?? "?").charAt(0).toUpperCase()}
        />
        <Flex direction="column" gap="1" style={{ flex: 1 }}>
          <Flex gap="2" align="baseline" wrap="wrap">
            <Text size="2" weight="bold">
              {comment.user.name ?? "Unknown"}
            </Text>
            <Text size="1" color="gray">
              {new Date(comment.createdAt).toLocaleString()}
            </Text>
            {wasEdited && (
              <Text size="1" color="gray">
                (edited)
              </Text>
            )}
          </Flex>

          {editing ?
            <Flex direction="column" gap="2">
              <TextArea
                value={draft}
                maxLength={MAX}
                onChange={(e) => setDraft(e.target.value)}
                disabled={submitting}
              />
              <Flex gap="2" justify="end">
                <Button
                  variant="soft"
                  color="gray"
                  type="button"
                  onClick={cancel}
                  disabled={submitting}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={save}
                  disabled={submitting || !draft.trim()}
                >
                  {submitting ? "Saving..." : "Save"}
                </Button>
              </Flex>
            </Flex>
          : <div className="prose prose-sm max-w-full">
              <ReactMarkdown>{comment.body}</ReactMarkdown>
            </div>
          }

          {canModify && !editing && (
            <Flex gap="3" mt="1">
              <Button
                size="1"
                variant="ghost"
                type="button"
                onClick={() => setEditing(true)}
                disabled={deleting}
              >
                Edit
              </Button>
              <AlertDialog.Root>
                <AlertDialog.Trigger>
                  <Button
                    size="1"
                    variant="ghost"
                    color="red"
                    type="button"
                    disabled={deleting}
                  >
                    Delete
                  </Button>
                </AlertDialog.Trigger>
                <AlertDialog.Content maxWidth="450px">
                  <AlertDialog.Title>Delete comment?</AlertDialog.Title>
                  <AlertDialog.Description size="2">
                    This action cannot be undone.
                  </AlertDialog.Description>
                  <Flex gap="3" mt="4" justify="end">
                    <AlertDialog.Cancel>
                      <Button variant="soft" color="gray">
                        Cancel
                      </Button>
                    </AlertDialog.Cancel>
                    <AlertDialog.Action>
                      <Button color="red" onClick={remove}>
                        Delete
                      </Button>
                    </AlertDialog.Action>
                  </Flex>
                </AlertDialog.Content>
              </AlertDialog.Root>
            </Flex>
          )}
        </Flex>
      </Flex>
    </Card>
  );
};

export default CommentItem;
