import Pagination from "@/app/components/Pagination";
import prisma from "@/prisma/client";
import { Issue, Status } from "@prisma/client";
import IssueActions from "./IssueActions";
import IssueTable, { columnNames, IssueQuery } from "./IssueTable";
import { Flex, Heading } from "@radix-ui/themes";
import { Metadata } from "next";

interface Props {
  searchParams: Promise<IssueQuery>;
}

const IssuesPage = async ({ searchParams }: Props) => {
  const params = await searchParams;

  const statuses = Object.values(Status);
  const status =
    params.status && statuses.includes(params.status as Status) ?
      (params.status as Status)
    : undefined;
  const where = { status };

  const orderByColumn = (await searchParams).orderBy;
  const orderBy =
    orderByColumn && columnNames.includes(orderByColumn as any) ?
      { [orderByColumn]: "asc" as const }
    : undefined;

  const getSortHref = (orderBy: keyof Issue) => {
    const params = new URLSearchParams();

    if (status) params.set("status", status);
    params.set("orderBy", orderBy);

    return `?${params.toString()}`;
  };

  const page = parseInt((await searchParams).page) || 1;
  const pageSize = 10;

  const issues = await prisma?.issue.findMany({
    where,
    orderBy,
    skip: (page - 1) * pageSize,
    take: pageSize,
  });

  const issueCount = await prisma.issue.count({ where });

  return (
    <Flex direction="column" gap="3">
      <Heading as="h1" size="6">
        Issues
      </Heading>
      <IssueActions />
      <IssueTable
        searchParams={searchParams}
        issues={issues}
        getSortHref={getSortHref}
        orderByColumn={orderByColumn}
      />
      <Pagination
        pageSize={pageSize}
        currentPage={page}
        itemCount={issueCount}
      />
    </Flex>
  );
};

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "All Issues",
  description:
    "Browse all reported bugs and project issues on Bughive. Filter by status (open, in-progress, closed) and sort to find what you need.",
  alternates: { canonical: "/issues/list" },
  openGraph: {
    title: "All Issues | Bughive",
    description:
      "Browse all reported bugs and project issues on Bughive.",
    url: "/issues/list",
    type: "website",
  },
};

export default IssuesPage;
