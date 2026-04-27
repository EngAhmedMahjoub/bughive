import { Metadata } from "next";

/**
 * Base metadata configuration for the Bug Hive application
 * Used as a foundation for all page metadata
 */
export const baseMetadata: Metadata = {
  title: {
    default: "Bug Hive",
    template: "%s | Bug Hive",
  },
  description: "Bug Hive - Collaborative issue and bug tracking platform for development teams",
  keywords: ["issue tracking", "bug tracking", "project management", "collaboration", "developer tools"],
  authors: [{ name: "Bug Hive" }],
  creator: "Bug Hive",
  publisher: "Bug Hive",
  formatDetection: {
    email: false,
    telephone: false,
  },
};

/**
 * Get the base URL for the application
 * Falls back to localhost:3000 for development
 */
export function getBaseUrl(): string {
  return process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
}

/**
 * Generate standard Open Graph metadata
 */
export function generateOGMetadata(config: {
  title: string;
  description: string;
  type?: "website" | "article";
  url: string;
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
  tags?: string[];
  image?: {
    url: string;
    width?: number;
    height?: number;
    alt?: string;
  };
}) {
  const imageConfig = config.image || {
    url: "/og-image.png",
    width: 1200,
    height: 630,
    alt: "Bug Hive - Issue Tracking",
  };

  return {
    title: config.title,
    description: config.description,
    type: config.type || "website",
    url: config.url,
    siteName: "Bug Hive",
    images: [
      {
        url: imageConfig.url,
        width: imageConfig.width || 1200,
        height: imageConfig.height || 630,
        alt: imageConfig.alt || "Bug Hive",
      },
    ],
    locale: "en_US",
    ...(config.publishedTime && { publishedTime: config.publishedTime }),
    ...(config.modifiedTime && { modifiedTime: config.modifiedTime }),
    ...(config.authors && { authors: config.authors }),
    ...(config.tags && { tags: config.tags }),
  };
}

/**
 * Generate standard Twitter Card metadata
 */
export function generateTwitterMetadata(config: {
  title: string;
  description: string;
  image?: string;
}) {
  return {
    card: "summary_large_image",
    title: config.title,
    description: config.description,
    images: [config.image || "/og-image.png"],
  };
}

/**
 * Truncate description to Twitter/OG recommended length
 */
export function truncateDescription(description: string, length: number = 160): string {
  if (description.length <= length) return description;
  return description.substring(0, length - 3) + "...";
}
