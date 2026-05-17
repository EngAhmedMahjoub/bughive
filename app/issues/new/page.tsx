import { Metadata } from "next";
import IssueFormDynamic from "./IssueFormDynamic";

const NewIssuePage = () => {
  return <IssueFormDynamic />;
};

export default NewIssuePage;

export const metadata: Metadata = {
  title: "New Issue",
  description: "Create a new bug report or project issue on Bughive.",
  alternates: { canonical: "/issues/new" },
  robots: {
    index: false,
    follow: true,
  },
};
