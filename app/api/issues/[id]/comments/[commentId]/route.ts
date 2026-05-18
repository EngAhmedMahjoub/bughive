import authOptions from "@/app/api/auth/authOptions";
import prisma from "@/prisma/client";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const commentSchema = z.object({
  body: z.string().min(1, "Comment is required.").max(2000),
});

async function getOwnedComment(commentId: number) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email)
    return { error: NextResponse.json({}, { status: 401 }) } as const;

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  });
  if (!user) return { error: NextResponse.json({}, { status: 401 }) } as const;

  const comment = await prisma.comment.findUnique({
    where: { id: commentId },
    select: { id: true, userId: true },
  });
  if (!comment)
    return {
      error: NextResponse.json({ error: "Not found" }, { status: 404 }),
    } as const;

  if (comment.userId !== user.id)
    return {
      error: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
    } as const;

  return { user, comment } as const;
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string; commentId: string }> },
) {
  const { commentId: commentIdRaw } = await context.params;
  const commentId = parseInt(commentIdRaw, 10);
  if (isNaN(commentId))
    return NextResponse.json({ error: "Invalid comment id" }, { status: 400 });

  const auth = await getOwnedComment(commentId);
  if ("error" in auth) return auth.error;

  const body = await request.json();
  const validation = commentSchema.safeParse(body);
  if (!validation.success)
    return NextResponse.json(validation.error.format(), { status: 400 });

  // Defense-in-depth: scope the update by both id and userId.
  const updated = await prisma.comment.update({
    where: { id: commentId, userId: auth.user.id },
    data: { body: validation.data.body },
    include: { user: { select: { id: true, name: true, image: true } } },
  });

  return NextResponse.json(updated);
}

export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ id: string; commentId: string }> },
) {
  const { commentId: commentIdRaw } = await context.params;
  const commentId = parseInt(commentIdRaw, 10);
  if (isNaN(commentId))
    return NextResponse.json({ error: "Invalid comment id" }, { status: 400 });

  const auth = await getOwnedComment(commentId);
  if ("error" in auth) return auth.error;

  await prisma.comment.delete({
    where: { id: commentId, userId: auth.user.id },
  });

  return new NextResponse(null, { status: 204 });
}
