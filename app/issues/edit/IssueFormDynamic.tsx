"use client";

import dynamic from "next/dynamic";
import { Issue } from "@prisma/client";
import IssueFormSkeleton from "./[id]/loading";

const IssueForm = dynamic(() => import("@/app/issues/_components/IssueForm"), {
  ssr: false,
  loading: () => <IssueFormSkeleton />,
});

const IssueFormDynamic = ({ issue }: { issue: Issue }) => {
  return <IssueForm issue={issue} />;
};

export default IssueFormDynamic;
