import type { MetadataRoute } from "next";
import prisma from "@/prisma/client";

const SITE_URL = "https://bughive-seven.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}/`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${SITE_URL}/issues/list`,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/issues/new`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
  ];

  const issues = await prisma.issue.findMany({
    select: { id: true, updatedAt: true },
    orderBy: { updatedAt: "desc" },
  });

  const issueRoutes: MetadataRoute.Sitemap = issues.map((issue) => ({
    url: `${SITE_URL}/issues/${issue.id}`,
    lastModified: issue.updatedAt,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...issueRoutes];
}
