import { Metadata } from "next";
import IssueFormDynamic from "./IssueFormDynamic";

const NewIssuePage = () => {
  return <IssueFormDynamic />;
};

export default NewIssuePage;

export const metadata: Metadata = {
  title: "Bughive - New Issue",
  description: "Create a new project issue",
};
