"use client";
import dynamic from "next/dynamic";
import IssueFormSkeleton from "./loading";

<<<<<<< HEAD
export const metadata: Metadata = {
  title: "Create Issue",
  description: "Create a new issue or bug report in Bug Hive",
  openGraph: {
    title: "Bug Hive - Create Issue",
    description: "Create a new issue or bug report in Bug Hive",
    type: "website",
    url: "/issues/new",
  },
};
=======
const IssueForm = dynamic(() => import("@/app/issues/_components/IssueForm"), {
  ssr: false,
  loading: () => <IssueFormSkeleton />,
});
>>>>>>> parent of a39f8a9 (implement seo and og metadata)

const NewIssuePage = () => {
  return <IssueForm />;
};

export default NewIssuePage;
