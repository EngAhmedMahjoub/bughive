import prisma from "@/prisma/client";
import { Box, Flex, Grid } from "@radix-ui/themes";
import { notFound } from "next/navigation";
import EditIssueButton from "./EditIssueButton";
import IssueDetails from "./IssueDetails";
import DeleteIssueButton from "./DeleteIssueButton";
import { getServerSession } from "next-auth";
import authOptions from "@/app/api/auth/authOptions";
import AssigneeSelect from "./AssigneeSelect";
import { cache } from "react";
import { Metadata } from "next";

interface Props {
  params: Promise<{ id: string }>;
}

 const fetchUser = cache((issueId: number) =>
   prisma.issue.findUnique({ where: { id: issueId } }),
 );
 

const IssueDetailPage = async ({ params }: Props) => {
 const session = await getServerSession(authOptions);

  const { id } = await params;
  const issueId = parseInt(id);
  if (isNaN(issueId)) notFound();

  const issue = await fetchUser(parseInt((await params).id));

  if (!issue) notFound();

  return (
    <Grid columns={{ initial: "1", sm: "5" }} gap="5">
      <Box className="md:col-span-4">
        <IssueDetails issue={issue} />
      </Box>
      {session && (
        <Box>
          <Flex direction="column" gap="4">
            <AssigneeSelect issue={issue} />
            <EditIssueButton issueId={issue.id} />
            <DeleteIssueButton issueId={issue.id} />
          </Flex>
        </Box>
      )}
    </Grid>
  );
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const issueId = parseInt(id, 10);
  if (Number.isNaN(issueId)) {
    return { title: "Issue Not Found" };
  }

  const issue = await fetchUser(issueId);

  if (!issue) {
    return {
      title: "Issue Not Found",
    };
  }

  const issueUrl = `/issues/${issue.id}`;
  const statusColor =
    issue.status === "OPEN" ? "🔴"
    : issue.status === "IN_PROGRESS" ? "🟡"
    : "🟢";
  const description = `${statusColor} ${issue.status} - ${issue.description || "No description provided"}`;

  return {
    title: issue.title,
    description: description.substring(0, 160),
    alternates: { canonical: issueUrl },
    openGraph: {
      title: `Issue: ${issue.title}`,
      description: description.substring(0, 160),
      type: "article",
      url: issueUrl,
      publishedTime: issue.created?.toISOString(),
      modifiedTime: issue.updatedAt?.toISOString(),
      authors: ["Bug Hive"],
      tags: [issue.status, "issue", "bug-tracking"],
    },
    twitter: {
      card: "summary_large_image",
      title: `Issue: ${issue.title}`,
      description: description.substring(0, 160),
    },
  };
}

export default IssueDetailPage;
