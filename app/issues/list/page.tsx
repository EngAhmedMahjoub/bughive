import Pagination from "@/app/components/Pagination";
import prisma from "@/prisma/client";
import { Issue, Status } from "@prisma/client";
import IssueActions from "./IssueActions";
import IssueTable, { columnNames, IssueQuery, SortOrder } from "./IssueTable";
import { DEFAULT_PAGE_SIZE, PAGE_SIZES } from "./pageSizes";
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

  // Assignee filter: undefined => no filter; null => unassigned; string => userId
  let assignedToUserId: string | null | undefined = undefined;
  if (params.assignee === "unassigned") assignedToUserId = null;
  else if (params.assignee && params.assignee !== "all")
    assignedToUserId = params.assignee;

  const where = { status, assignedToUserId };

  const orderByColumn =
    params.orderBy && columnNames.includes(params.orderBy as any) ?
      (params.orderBy as keyof Issue)
    : undefined;
  const order: SortOrder = params.order === "desc" ? "desc" : "asc";
  const orderBy = orderByColumn ? { [orderByColumn]: order } : undefined;

  const page = parseInt(params.page) || 1;
  const requestedSize = parseInt(params.pageSize);
  const pageSize =
    (PAGE_SIZES as readonly number[]).includes(requestedSize) ?
      requestedSize
    : DEFAULT_PAGE_SIZE;

  const getSortHref = (column: keyof Issue) => {
    const next = new URLSearchParams();

    if (status) next.set("status", status);
    if (params.assignee && params.assignee !== "all")
      next.set("assignee", params.assignee);
    if (pageSize !== DEFAULT_PAGE_SIZE)
      next.set("pageSize", pageSize.toString());
    next.set("orderBy", column);
    // Flip order if clicking the active column; otherwise default to asc.
    const nextOrder: SortOrder =
      orderByColumn === column && order === "asc" ? "desc" : "asc";
    if (nextOrder === "desc") next.set("order", "desc");

    return `?${next.toString()}`;
  };

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
        order={order}
      />
      <Pagination
        pageSize={pageSize}
        currentPage={page}
        itemCount={issueCount}
      />
    </Flex>
  );
};;

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
