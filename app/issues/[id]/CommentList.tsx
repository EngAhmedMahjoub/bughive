import prisma from "@/prisma/client";
import { Avatar, Card, Flex, Text } from "@radix-ui/themes";
import ReactMarkdown from "react-markdown";

const CommentList = async ({ issueId }: { issueId: number }) => {
  const comments = await prisma.comment.findMany({
    where: { issueId },
    orderBy: { createdAt: "asc" },
    include: { user: { select: { name: true, image: true } } },
  });

  if (comments.length === 0)
    return (
      <Text color="gray" size="2">
        No comments yet.
      </Text>
    );

  return (
    <Flex direction="column" gap="3">
      {comments.map((c) => (
        <Card key={c.id}>
          <Flex gap="3" align="start">
            <Avatar
              size="2"
              radius="full"
              src={c.user.image ?? undefined}
              fallback={(c.user.name ?? "?").charAt(0).toUpperCase()}
            />
            <Flex direction="column" gap="1" style={{ flex: 1 }}>
              <Flex gap="2" align="baseline">
                <Text size="2" weight="bold">
                  {c.user.name ?? "Unknown"}
                </Text>
                <Text size="1" color="gray">
                  {c.createdAt.toLocaleString()}
                </Text>
              </Flex>
              <div className="prose prose-sm max-w-full">
                <ReactMarkdown>{c.body}</ReactMarkdown>
              </div>
            </Flex>
          </Flex>
        </Card>
      ))}
    </Flex>
  );
};

export default CommentList;
