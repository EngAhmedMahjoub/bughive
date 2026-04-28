import React from "react";
import { notFound } from "next/navigation";
import prisma from "@/prisma/client";
import IssueFormDynamic from "../IssueFormDynamic";
import { Metadata } from "next";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const issueId = parseInt(id, 10);
  if (Number.isNaN(issueId)) {
    return { title: "Issue Not Found" };
  }

  const issue = await prisma?.issue.findUnique({
    where: { id: issueId },
  });

  if (!issue) {
    return {
      title: "Issue Not Found",
    };
  }

  return {
    title: `Edit: ${issue.title}`,
    description: `Edit issue: ${issue.title}`,
    openGraph: {
      title: `Bug Hive - Edit: ${issue.title}`,
      description: `Edit issue: ${issue.title}`,
      type: "website",
      url: `/issues/edit/${issue.id}`,
    },
  };
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
