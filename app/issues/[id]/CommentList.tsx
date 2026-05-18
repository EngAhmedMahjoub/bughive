import authOptions from "@/app/api/auth/authOptions";
import prisma from "@/prisma/client";
import { Flex, Text } from "@radix-ui/themes";
import { getServerSession } from "next-auth";
import CommentItem from "./CommentItem";

const CommentList = async ({ issueId }: { issueId: number }) => {
  const [comments, session] = await Promise.all([
    prisma.comment.findMany({
      where: { issueId },
      orderBy: { createdAt: "asc" },
      include: { user: { select: { id: true, name: true, image: true } } },
    }),
    getServerSession(authOptions),
  ]);

  let currentUserId: string | null = null;
  if (session?.user?.email) {
    const me = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });
    currentUserId = me?.id ?? null;
  }

  if (comments.length === 0)
    return (
      <Text color="gray" size="2">
        No comments yet.
      </Text>
    );

  return (
    <Flex direction="column" gap="3">
      {comments.map((c) => (
        <CommentItem
          key={c.id}
          issueId={issueId}
          comment={{
            id: c.id,
            body: c.body,
            createdAt: c.createdAt.toISOString(),
            updatedAt: c.updatedAt.toISOString(),
            user: {
              id: c.user.id,
              name: c.user.name,
              image: c.user.image,
            },
          }}
          canModify={currentUserId !== null && currentUserId === c.user.id}
        />
      ))}
    </Flex>
  );
};

export default CommentList;
