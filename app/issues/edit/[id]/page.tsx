import React from "react";
import { notFound } from "next/navigation";
import prisma from "@/prisma/client";
import IssueFormDynamic from "../IssueFormDynamic";
import { Metadata } from "next";

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

export const metadata: Metadata = {
  title: "Edit Issue",
  description: "Edit an existing project issue on Bughive.",
  robots: {
    index: false,
    follow: false,
  },
};

export default EditIssuePage;
