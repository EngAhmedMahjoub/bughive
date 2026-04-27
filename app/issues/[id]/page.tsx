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

export async function generateMetadata({ params }: Props) {
  const issue = await fetchUser(parseInt((await params).id));

  if (!issue) {
    return {
      title: "Issue Not Found",
    };
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const issueUrl = `${baseUrl}/issues/${issue.id}`;
  const statusColor =
    issue.status === "OPEN" ? "🔴"
    : issue.status === "IN_PROGRESS" ? "🟡"
    : "🟢";
  const description = `${statusColor} ${issue.status} - ${issue.description || "No description provided"}`;

  return {
    title: issue.title,
    description: description.substring(0, 160),
    canonical: issueUrl,
    openGraph: {
      title: `Issue: ${issue.title}`,
      description: description.substring(0, 160),
      type: "article",
      url: issueUrl,
      publishedTime: issue.created?.toISOString(),
      modifiedTime: issue.updatedAt?.toISOString(),
      authors: ["Bug Hive"],
      tags: [issue.status, "issue", "bug-tracking"],
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: `Issue: ${issue.title}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `Issue: ${issue.title}`,
      description: description.substring(0, 160),
      images: ["/og-image.png"],
    },
  };
}

export default IssueDetailPage;
