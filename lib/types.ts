export type Profile = {
  name: string;
  publicName: string;
  headline: string;
  summary: string;
  email: string;
  phone: string;
  location: string;
  githubUrl: string;
  linkedinUrl: string;
  instagramUrl: string;
  resumeUrl: string;
  avatarUrl: string;
  openTo: string;
};

export type Skill = {
  id: string;
  name: string;
  category: string;
  proficiency: number;
  isFeatured: boolean;
  isVisible: boolean;
  sortOrder: number;
};

export type Project = {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  caseStudy: string;
  createdFor: string;
  techStack: string[];
  role: string;
  impact: string[];
  imageUrl: string;
  demoUrl: string;
  githubUrl: string;
  liveUrl: string;
  storeUrl: string;
  status: string;
  isFeatured: boolean;
  isVisible: boolean;
  sortOrder: number;
};

export type Experience = {
  id: string;
  company: string;
  role: string;
  location: string;
  startDate: string;
  endDate: string | null;
  isCurrent: boolean;
  summary: string;
  highlights: string[];
  techStack: string[];
  sortOrder: number;
};

export type Education = {
  id: string;
  institution: string;
  degree: string;
  location: string;
  startYear: string;
  endYear: string;
  grade: string;
  highlights: string[];
  sortOrder: number;
};

export type Achievement = {
  id: string;
  title: string;
  description: string;
  date: string;
  isFeatured: boolean;
  sortOrder: number;
};

export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  readAt: string | null;
  createdAt: string;
};

export type SiteSettings = {
  inspectProtectionEnabled: boolean;
};
