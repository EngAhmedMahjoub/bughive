import { Metadata } from "next";
import NewIssueClient from "./NewIssueClient";

export const metadata: Metadata = {
  title: "Create Issue",
  description: "Create a new issue or bug report in Bug Hive",
  openGraph: {
    title: "Bug Hive - Create Issue",
    description: "Create a new issue or bug report in Bug Hive",
    type: "website",
    url: "/issues/new",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Create Issue",
      },
    ],
  },
};

const NewIssuePage = () => {
  return <NewIssueClient />;
};

export default NewIssuePage;
