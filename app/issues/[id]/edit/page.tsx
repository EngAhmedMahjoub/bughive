import React from "react";
import { notFound } from "next/navigation";
import prisma from "@/prisma/client";
import IssueFormDynamic from "./IssueFormDynamic";

interface Props {
  params: Promise<{ id: string }>;
}

const EditIssuePage = async ({ params }: Props) => {
  const { id } = await params;

  const issue = await prisma?.issue.findUnique({
    where: { id: parseInt(id, 10) },
  });

  if (!issue) notFound();

  return <IssueFormDynamic issue={issue} />;
};

export default EditIssuePage;
