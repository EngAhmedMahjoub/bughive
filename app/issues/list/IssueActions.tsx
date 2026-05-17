import { Button, Flex } from "@radix-ui/themes";
import Link from "next/link";
import React from "react";
import IssueStatusFilter from "./IssueStatusFilter";
import PageSizeSelect from "./PageSizeSelect";
import AssigneeFilter from "./AssigneeFilter";

const IssueActions = () => {
  return (
    <Flex justify="between" align="center" gap="3" wrap="wrap">
      <Flex gap="3" align="center" wrap="wrap">
        <IssueStatusFilter />
        <AssigneeFilter />
        <PageSizeSelect />
      </Flex>
      <Button>
        <Link href="/issues/new">New Issue</Link>
      </Button>
    </Flex>
  );
};

export default IssueActions;
