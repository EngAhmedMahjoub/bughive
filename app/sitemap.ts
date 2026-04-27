import { MetadataRoute } from "next";
import prisma from "@/prisma/client";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  // Static pages
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 1,
    },
    {
      url: `${baseUrl}/issues/list`,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/issues/new`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  // Dynamic issue routes
  let issueRoutes: MetadataRoute.Sitemap = [];
  try {
    const issues = await prisma.issue.findMany({
      select: {
        id: true,
        updatedAt: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
      take: 1000, // Limit to avoid huge sitemaps
    });

    issueRoutes = issues.map((issue) => ({
      url: `${baseUrl}/issues/${issue.id}`,
      lastModified: issue.updatedAt,
      changeFrequency: "daily" as const,
      priority: 0.7,
    }));
  } catch (error) {
    console.error("Error fetching issues for sitemap:", error);
  }

  return [...staticRoutes, ...issueRoutes];
}
