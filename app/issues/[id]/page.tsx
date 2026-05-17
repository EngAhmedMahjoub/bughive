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
  const issueId = parseInt(id);
  if (isNaN(issueId)) return { title: "Issue not found" };

  const issue = await fetchUser(issueId);
  if (!issue) return { title: "Issue not found" };

  const description =
    issue.description.length > 155 ?
      `${issue.description.slice(0, 152).trim()}...`
    : issue.description;

  return {
    title: issue.title,
    description,
    alternates: { canonical: `/issues/${issue.id}` },
    openGraph: {
      type: "article",
      title: `${issue.title} | Bughive`,
      description,
      url: `/issues/${issue.id}`,
      publishedTime: issue.created.toISOString(),
      modifiedTime: issue.updatedAt.toISOString(),
    },
    twitter: {
      card: "summary",
      title: `${issue.title} | Bughive`,
      description,
    },
  };
}

export default IssueDetailPage;
