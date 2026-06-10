import type { Metadata } from "next";
import { absoluteUrl, displayImageUrl } from "@/lib/utils";
import type { Profile, Project, Skill } from "@/lib/types";

export const siteName = "Rohit Chauhan Portfolio";
export const defaultDescription =
  "Rohit Chauhan is a React Native and Full Stack Developer building production mobile apps, backend APIs, database-backed workflows, and portfolio-grade case studies.";

export const defaultKeywords = [
  "Rohit Chauhan",
  "Rohit Chauhan Portfolio",
  "React Native Developer",
  "Full Stack Developer",
  "Node.js Developer",
  "TypeScript Developer",
  "Mobile App Developer",
  "Next.js Developer",
  "REST API Developer",
  "MySQL Developer",
  "Supabase Developer",
  "Firebase Developer",
  "Sangli Developer",
  "Maharashtra Developer",
  "Mai Hyundai",
  "Ticket Khidakee",
  "Medimate",
  "Portfolio"
];

export function pageMetadata({
  title,
  description = defaultDescription,
  path = "/",
  image,
  type = "website"
}: {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  type?: "website" | "article";
}): Metadata {
  const url = absoluteUrl(path);
  const imageUrl = image ? toAbsoluteImageUrl(image) : absoluteUrl("/favicon.svg");

  return {
    title,
    description,
    keywords: defaultKeywords,
    alternates: {
      canonical: url
    },
    authors: [{ name: "Rohit Chauhan", url: absoluteUrl("/") }],
    creator: "Rohit Chauhan",
    publisher: "Rohit Chauhan",
    category: "software development portfolio",
    openGraph: {
      title: title ? `${title} | Rohit Chauhan` : "Rohit Chauhan | React Native and Full Stack Developer",
      description,
      url,
      siteName,
      type,
      locale: "en_US",
      images: [{ url: imageUrl }]
    },
    twitter: {
      card: "summary_large_image",
      title: title ? `${title} | Rohit Chauhan` : "Rohit Chauhan | React Native and Full Stack Developer",
      description,
      images: [imageUrl]
    }
  };
}

export function profileJsonLd(profile: Profile, skills: Skill[], projects: Project[]) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    alternateName: profile.publicName,
    jobTitle: profile.headline,
    description: profile.summary,
    email: profile.email,
    telephone: profile.phone,
    address: {
      "@type": "PostalAddress",
      addressLocality: profile.location
    },
    url: absoluteUrl("/"),
    sameAs: [profile.githubUrl, profile.linkedinUrl, profile.instagramUrl].filter(Boolean),
    knowsAbout: skills.map((skill) => skill.name),
    hasOccupation: {
      "@type": "Occupation",
      name: profile.headline,
      skills: skills.map((skill) => skill.name).join(", ")
    },
    workExample: projects.slice(0, 6).map((project) => ({
      "@type": "CreativeWork",
      name: project.title,
      url: absoluteUrl(`/projects/${project.slug}`),
      description: project.shortDescription
    }))
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteName,
    url: absoluteUrl("/"),
    inLanguage: "en"
  };
}

export function projectJsonLd(project: Project, profile: Profile) {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    headline: project.title,
    description: project.shortDescription,
    url: absoluteUrl(`/projects/${project.slug}`),
    image: project.imageUrl ? toAbsoluteImageUrl(project.imageUrl) : undefined,
    creator: {
      "@type": "Person",
      name: profile.publicName,
      url: absoluteUrl("/")
    },
    about: project.createdFor || project.status,
    keywords: project.techStack.join(", ")
  };
}

export function breadcrumbJsonLd(items: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path)
    }))
  };
}

function toAbsoluteImageUrl(image: string) {
  const src = displayImageUrl(image);
  if (!src) return absoluteUrl("/favicon.svg");
  if (/^https?:\/\//i.test(src)) return src;
  return absoluteUrl(src.startsWith("/") ? src : `/${src}`);
}
