import type { Achievement, Education, Experience, Profile, Project, Skill } from "@/lib/types";

export const profile: Profile = {
  name: "Rohit Kamlesh Chauhan",
  publicName: "Rohit Chauhan",
  headline: "React Native and Full Stack Developer",
  summary:
    "I build production mobile apps, backend APIs, and business workflow tools with React Native, TypeScript, Node.js, MySQL, Firebase, and Supabase.",
  email: "rohitchauhan6232@gmail.com",
  phone: "+91 7024756186",
  location: "Sangli, Maharashtra, India",
  githubUrl: "https://github.com/RohitChauhan13",
  linkedinUrl: "",
  instagramUrl: "",
  resumeUrl: "/resume.pdf",
  avatarUrl: "",
  openTo: "Remote, hybrid, and onsite roles"
};

export const skills: Skill[] = [
  { id: "react-native", name: "React Native", category: "Mobile", proficiency: 92, isFeatured: true, isVisible: true, sortOrder: 1 },
  { id: "typescript", name: "TypeScript", category: "Languages", proficiency: 88, isFeatured: true, isVisible: true, sortOrder: 2 },
  { id: "node", name: "Node.js", category: "Backend", proficiency: 86, isFeatured: true, isVisible: true, sortOrder: 3 },
  { id: "rest", name: "REST APIs", category: "Backend", proficiency: 88, isFeatured: true, isVisible: true, sortOrder: 4 },
  { id: "mysql", name: "MySQL", category: "Database", proficiency: 84, isFeatured: true, isVisible: true, sortOrder: 5 },
  { id: "firebase", name: "Firebase", category: "Database", proficiency: 78, isFeatured: true, isVisible: true, sortOrder: 6 },
  { id: "supabase", name: "Supabase", category: "Database", proficiency: 76, isFeatured: true, isVisible: true, sortOrder: 7 },
  { id: "redux", name: "Redux", category: "Frontend", proficiency: 82, isFeatured: false, isVisible: true, sortOrder: 8 },
  { id: "java", name: "Java", category: "Languages", proficiency: 72, isFeatured: false, isVisible: true, sortOrder: 9 },
  { id: "jmeter", name: "JMeter", category: "Tools", proficiency: 70, isFeatured: false, isVisible: true, sortOrder: 10 }
];

export const projects: Project[] = [
  {
    id: "mai-hyundai",
    title: "Mai Hyundai",
    slug: "mai-hyundai",
    shortDescription: "Production mobile app work for a dealership workflow and customer experience platform.",
    caseStudy:
      "Contributed to production React Native app delivery, API integration, state management, testing, and performance improvements for a real business audience.",
    createdFor: "Dealership workflow and customer experience platform",
    techStack: ["React Native", "TypeScript", "Node.js", "REST APIs", "MySQL", "Firebase"],
    role: "Hybrid App Developer",
    demoUrl: "",
    impact: ["Part of production app delivery", "Supported real users at scale", "Improved app stability and workflow speed"],
    imageUrl: "",
    githubUrl: "",
    liveUrl: "",
    storeUrl: "",
    status: "Production",
    isFeatured: true,
    isVisible: true,
    sortOrder: 1
  },
  {
    id: "ticket-khidakee",
    title: "Ticket Khidakee",
    slug: "ticket-khidakee",
    shortDescription: "Production ticketing mobile app work across frontend flows, API integration, and stability.",
    caseStudy:
      "Worked on production-grade mobile experiences with React Native, backend API coordination, Redux state flows, and debugging for smoother releases.",
    createdFor: "A ticketing mobile app for customers and event organizers",
    techStack: ["React Native", "Redux", "TypeScript", "Node.js", "MySQL"],
    role: "Hybrid App Developer / Full Stack Developer",
    demoUrl: "",
    impact: ["Production app experience", "Contributed to reliable user flows", "Worked inside Agile delivery cycles"],
    imageUrl: "",
    githubUrl: "",
    liveUrl: "",
    storeUrl: "",
    status: "Production",
    isFeatured: true,
    isVisible: true,
    sortOrder: 2
  },
  {
    id: "medimate",
    title: "Medimate",
    slug: "medimate",
    shortDescription: "Medical store management app for inventory, credit records, and daily operations.",
    caseStudy:
      "Replaced diary-based store workflows with a mobile application that tracks medicines, customers, credit balances, and inventory updates for medical stores.",
    createdFor: "Medical store inventory and credit management",
    techStack: ["React Native", "Node.js", "MySQL"],
    role: "Full Stack Developer",
    demoUrl: "",
    impact: ["Reduced record-keeping time by 70%", "Tracked 1,000+ medicines", "Managed 500+ customer accounts", "Saved 15+ hours weekly"],
    imageUrl: "",
    githubUrl: "",
    liveUrl: "",
    storeUrl: "",
    status: "Case study",
    isFeatured: true,
    isVisible: true,
    sortOrder: 3
  },
  {
    id: "payroll-management",
    title: "Payroll Management System",
    slug: "payroll-management-system",
    shortDescription: "Java Swing desktop app for employee records and salary processing.",
    caseStudy:
      "Created a desktop application to manage employee records and automate salary calculations, reducing manual work and payroll errors.",
    createdFor: "Internal payroll and employee record management",
    techStack: ["Java Swing", "MySQL"],
    role: "Developer",
    demoUrl: "",
    impact: ["Managed 100+ employee records", "Reduced payroll time by 60%", "Reduced manual calculation errors"],
    imageUrl: "",
    githubUrl: "",
    liveUrl: "",
    storeUrl: "",
    status: "Completed",
    isFeatured: false,
    isVisible: true,
    sortOrder: 4
  },
  {
    id: "ai-code-reviewer",
    title: "AI-Powered Code Reviewer",
    slug: "ai-powered-code-reviewer",
    shortDescription: "Developer tool that analyzes code and suggests quality improvements.",
    caseStudy:
      "Built a code analysis workflow that detects patterns and returns optimization suggestions for common JavaScript and TypeScript cases.",
    createdFor: "Developer productivity and code quality review",
    techStack: ["JavaScript", "Node.js", "TypeScript"],
    role: "Full Stack Developer",
    demoUrl: "",
    impact: ["Covered 50+ code patterns", "Improved review speed", "Promoted best-practice recommendations"],
    imageUrl: "/projects/default.svg",
    githubUrl: "",
    liveUrl: "",
    storeUrl: "",
    status: "Completed",
    isFeatured: false,
    isVisible: true,
    sortOrder: 5
  },
  {
    id: "draft-career",
    title: "DraftCareer",
    slug: "draft-career",
    shortDescription: "A career-planning and job-application helper web app.",
    caseStudy:
      "Built a lightweight web application to help users draft resumes, track job applications, and prepare interview notes. Implemented editable templates, export to PDF, and integrations with GitHub for profile linking.",
    createdFor: "Job seekers wanting structured career planning and resume management",
    techStack: ["React", "TypeScript", "Node.js"],
    role: "Full Stack Developer",
    demoUrl: "",
    impact: ["Provides reusable resume templates", "Streamlines application tracking", "Exports professional PDFs"],
    imageUrl: "/projects/draft-career.svg",
    githubUrl: "https://github.com/RohitChauhan13/DraftCareer",
    liveUrl: "",
    storeUrl: "",
    status: "Project",
    isFeatured: false,
    isVisible: true,
    sortOrder: 6
  }
];

export const experience: Experience[] = [
  {
    id: "gtt-data-solutions",
    company: "GTT Data Solutions",
    role: "Hybrid App Developer / Full Stack Developer",
    location: "Sangli, Maharashtra, India",
    startDate: "2025-05-12",
    endDate: null,
    isCurrent: true,
    summary: "Building and maintaining production mobile applications, APIs, integrations, and database-backed workflows.",
    highlights: [
      "Engineered React Native production app features across mobile and backend layers",
      "Built and integrated REST APIs with Node.js, TypeScript, and MySQL",
      "Improved state management with Redux and reduced debugging time",
      "Optimized MySQL queries and tested performance with JMeter",
      "Worked in Agile sprints with GitHub-based reviews and releases"
    ],
    techStack: ["React Native", "TypeScript", "Node.js", "Redux", "MySQL", "Firebase", "JMeter"],
    sortOrder: 1
  }
];

export const education: Education[] = [
  {
    id: "bca-imrda",
    institution: "Institute of Management & Rural Development Administration",
    degree: "Bachelor of Computer Applications",
    location: "Sangli, Maharashtra",
    startYear: "2022",
    endYear: "2025",
    grade: "A+ Grade",
    highlights: ["Bharati Vidyapeeth", "Top 5% of Computer Applications students"],
    sortOrder: 1
  }
];

export const achievements: Achievement[] = [
  {
    id: "one-year-production",
    title: "1 year of professional product work",
    description: "Completed a year of hands-on React Native and full-stack development from May 12, 2025.",
    date: "2026",
    isFeatured: true,
    sortOrder: 1
  },
  {
    id: "production-apps",
    title: "Production mobile app delivery",
    description: "Worked on production apps with thousands of users/downloads and reliability-focused releases.",
    date: "2025-2026",
    isFeatured: true,
    sortOrder: 2
  },
  {
    id: "academic-grade",
    title: "A+ grade in BCA",
    description: "Earned A+ grade from Bharati Vidyapeeth and ranked in the top 5% of Computer Applications students.",
    date: "2025",
    isFeatured: true,
    sortOrder: 3
  }
];
