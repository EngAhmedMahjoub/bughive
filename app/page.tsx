import { Flex, Grid } from "@radix-ui/themes";
import IssueChart from "./IssueChart";
import IssueSummary from "./IssueSummary";
import LatestIssues from "./LatestIssues";
import { Metadata } from "next";
import prisma from "@/prisma/client";

export default async function Home() {
  const open = await prisma?.issue.count({ where: { status: "OPEN" } })!;
  const inProgress = await prisma?.issue.count({
    where: { status: "IN_PROGRESS" },
  })!;
  const closed = await prisma?.issue.count({ where: { status: "CLOSED" } })!;
  return (
    <Grid columns={{ initial: "1", md: "2" }} gap="5">
      <Flex direction="column" gap="5">
        <IssueSummary open={open} inProgress={inProgress} closed={closed} />
        <IssueChart open={open} inProgress={inProgress} closed={closed} />
      </Flex>
      <LatestIssues />
    </Grid>
  );
}

export const metadata: Metadata = {
<<<<<<< HEAD
  title: "Dashboard",
  description:
    "Overview and summary of all project issues, including open, in-progress, and closed tickets",
  openGraph: {
    title: "Bug Hive - Dashboard",
    description:
      "Overview and summary of all project issues, including open, in-progress, and closed tickets",
    type: "website",
    url: "/",
  },
  twitter: {
    title: "Bug Hive - Dashboard",
    description:
      "Overview and summary of all project issues, including open, in-progress, and closed tickets",
    card: "summary_large_image",
  },
=======
  title: "Bug Hive - Dashboard",
  description: "View a summary of project issues",
>>>>>>> parent of a39f8a9 (implement seo and og metadata)
};
