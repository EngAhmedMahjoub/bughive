import authOptions from "@/app/api/auth/authOptions";
import prisma from "@/prisma/client";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const commentSchema = z.object({
  body: z.string().min(1, "Comment is required.").max(2000),
});

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const issueId = parseInt(id, 10);
  if (isNaN(issueId))
    return NextResponse.json({ error: "Invalid issue id" }, { status: 400 });

  const comments = await prisma.comment.findMany({
    where: { issueId },
    orderBy: { createdAt: "asc" },
    include: { user: { select: { name: true, image: true } } },
  });

  return NextResponse.json(comments);
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({}, { status: 401 });

  const { id } = await context.params;
  const issueId = parseInt(id, 10);
  if (isNaN(issueId))
    return NextResponse.json({ error: "Invalid issue id" }, { status: 400 });

  const body = await request.json();
  const validation = commentSchema.safeParse(body);
  if (!validation.success)
    return NextResponse.json(validation.error.format(), { status: 400 });

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  if (!user) return NextResponse.json({}, { status: 401 });

  const issue = await prisma.issue.findUnique({ where: { id: issueId } });
  if (!issue)
    return NextResponse.json({ error: "Invalid issue" }, { status: 404 });

  const comment = await prisma.comment.create({
    data: {
      body: validation.data.body,
      issueId,
      userId: user.id,
    },
    include: { user: { select: { name: true, image: true } } },
  });

  return NextResponse.json(comment, { status: 201 });
}
