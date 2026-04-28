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

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const issue = await prisma?.issue.findUnique({
    where: { id: parseInt(id, 10) },
  });
  return {
    title: issue ? `Bughive - Edit: ${issue.title}` : "Bughive - Edit Issue",
    description: "Edit an existing project issue",
  };
}

export default EditIssuePage;
