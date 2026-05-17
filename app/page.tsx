import { Flex, Grid, Heading } from "@radix-ui/themes";
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
    <Flex direction="column" gap="5">
      <Heading as="h1" size="6">
        Dashboard
      </Heading>
      <Grid columns={{ initial: "1", md: "2" }} gap="5">
        <Flex direction="column" gap="5">
          <IssueSummary open={open} inProgress={inProgress} closed={closed} />
          <IssueChart open={open} inProgress={inProgress} closed={closed} />
        </Flex>
        <LatestIssues />
      </Grid>
    </Flex>
  );
}

export const metadata: Metadata = {
  title: { absolute: "Dashboard | Bughive" },
  description:
    "Bughive dashboard – view a summary of open, in-progress, and closed project issues at a glance.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Dashboard | Bughive",
    description:
      "View a summary of open, in-progress, and closed project issues at a glance.",
    url: "/",
    type: "website",
  },
};

export const dynamic = "force-dynamic";
