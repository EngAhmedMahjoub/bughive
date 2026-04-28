import Pagination from "@/app/components/Pagination";
import prisma from "@/prisma/client";
import { Issue, Status } from "@prisma/client";
import IssueActions from "./IssueActions";
import IssueTable, { columnNames, IssueQuery } from "./IssueTable";
import { Flex } from "@radix-ui/themes";
import { Metadata } from "next";

interface Props {
  searchParams: Promise<IssueQuery>;
}

<<<<<<< HEAD
export const metadata: Metadata = {
  title: "Issues",
  description:
    "Browse and manage all project issues with advanced filtering and sorting capabilities",
  openGraph: {
    title: "Bug Hive - Issues",
    description:
      "Browse and manage all project issues with advanced filtering and sorting capabilities",
    type: "website",
    url: "/issues/list",
  },
  twitter: {
    title: "Bug Hive - Issues",
    description:
      "Browse and manage all project issues with advanced filtering and sorting capabilities",
    card: "summary_large_image",
  },
};

=======
>>>>>>> parent of a39f8a9 (implement seo and og metadata)
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
  title: "Bug Hive - Issue List",
  description: "View all project issues",
};

export default IssuesPage;
