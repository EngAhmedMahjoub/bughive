import prisma from "@/prisma/client";
import { Table } from "@radix-ui/themes";
import { IssueStatusBadge, Link } from "@/app/components";
import NextLink from "next/link";
import IssueActions from "./IssueActions";
import { Issue, Status } from "@prisma/client";
import { ArrowUpIcon } from "@radix-ui/react-icons";

interface Props {
  searchParams: Promise<{ status?: string; orderBy?: string }>;
}

const IssuesPage = async ({ searchParams }: Props) => {
  const params = await searchParams;

  const columns: { label: string; value: keyof Issue; className?: string }[] = [
    { label: "Issue", value: "title" },
    { label: "Status", value: "status", className: "hidden md:table-cell" },
    { label: "Created", value: "created", className: "hidden md:table-cell" },
  ];
  
  const statuses = Object.values(Status);
  const status =
    params.status && statuses.includes(params.status as Status) ?
      (params.status as Status)
    : undefined;

  const orderByColumn = columns.find(
    (column) => column.value === params.orderBy,
  )?.value;

  const orderBy =
    orderByColumn ? { [orderByColumn]: "asc" as const } : undefined;

  const getSortHref = (orderBy: keyof Issue) => {
    const params = new URLSearchParams();

    if (status) params.set("status", status);
    params.set("orderBy", orderBy);

    return `?${params.toString()}`;
  };

  const issues = await prisma?.issue.findMany({
    where: status ? { status } : {},
    orderBy,
  });

  return (
    <div>
      <IssueActions />
      <Table.Root variant="surface">
        <Table.Header>
          <Table.Row>
            {columns.map((column) => (
              <Table.ColumnHeaderCell key={column.value}>
                <NextLink href={getSortHref(column.value)}>
                  {column.label}
                </NextLink>
                {column.value === orderByColumn && (
                  <ArrowUpIcon className="inline" />
                )}
              </Table.ColumnHeaderCell>
            ))}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {issues?.map((issue) => (
            <Table.Row key={issue.id}>
              <Table.Cell>
                <Link href={`/issues/${issue.id}`}>{issue.title}</Link>
                <div className="block md:hidden">
                  <IssueStatusBadge status={issue.status} />
                </div>
              </Table.Cell>
              <Table.Cell className="hidden md:table-cell">
                <IssueStatusBadge status={issue.status} />
              </Table.Cell>
              <Table.Cell className="hidden md:table-cell">
                {issue.created.toDateString()}
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </div>
  );
};

export const dynamic = "force-dynamic";

export default IssuesPage;
