export interface Project {
  name: string;
  description: string;
  fullDescription: string;
  icon: string;
  screenshots: string[];
  tech: string[];
  features: string[];
  link: string;
  year: string;
  role: string;
}

export const projects: Project[] = [
  {
    name: "Class Mind",
    description:
      "Academic administration platform featuring multiple apps, all backed by a single Supabase database.",
    fullDescription:
      "Class Mind is a comprehensive academic administration platform designed to streamline educational institution operations. It features multiple integrated applications including student management, attendance tracking, gradebook, timetable management, and fee collection - all powered by a unified Supabase backend with real-time capabilities.",
    icon: "/app_icons/class_mind_icon.png",
    screenshots: [
      "/app_icons/class_mind_icon.png",
      "/app_icons/class_mind_icon.png",
      "/app_icons/class_mind_icon.png",
    ],
    tech: ["Supabase", "Firebase", "Flutter", "TypeScript", "PostgreSQL"],
    features: [
      "Real-time database synchronization",
      "Multi-role authentication (Admin, Teacher, Student)",
      "Automated attendance tracking",
      "Integrated gradebook system",
      "Fee management with payment gateway",
      "Parent portal for progress monitoring",
    ],
    link: "#",
    year: "2025",
    role: "Full Stack Developer",
  },
  {
    name: "Alnoor Cloth House",
    description:
      "Mini ERP for a cloth business in South Punjab, streamlining inventory and sales.",
    fullDescription:
      "A customized mini-ERP system built for Alnoor Cloth House to manage their entire business operations. From inventory management to sales tracking, this solution provides a complete dashboard for monitoring daily transactions, managing stock levels, and generating insightful reports for business growth.",
    icon: "/app_icons/alnoor_cloth_house_icon.png",
    screenshots: [
      "/app_icons/alnoor_cloth_house_icon.png",
      "/app_icons/alnoor_cloth_house_icon.png",
      "/app_icons/alnoor_cloth_house_icon.png",
    ],
    tech: ["Django", "Flutter", "Digital Ocean", "PostgreSQL", "REST API"],
    features: [
      "Inventory management system",
      "POS (Point of Sale) integration",
      "Sales analytics dashboard",
      "Supplier management",
      "Customer relationship tracking",
      "Barcode scanning support",
    ],
    link: "#",
    year: "2024",
    role: "Lead Developer",
  },
  {
    name: "Blog App",
    description:
      "Modern blog platform with sleek UI for uploading and reading blogs. Fully responsive.",
    fullDescription:
      "A modern, responsive blogging platform built with cutting-edge technologies. Features a beautiful minimalist design, rich text editor for content creation, social sharing capabilities, and a reading experience optimized for all devices. Supports markdown, code syntax highlighting, andSEO optimization.",
    icon: "/app_icons/welogs_icon.png",
    screenshots: [
      "/app_icons/welogs_icon.png",
      "/app_icons/welogs_icon.png",
      "/app_icons/welogs_icon.png",
    ],
    tech: ["Flutter", "Supabase", "Dart", "Firebase Auth", "Cloud Storage"],
    features: [
      "Rich text editor with markdown support",
      "Image upload and management",
      "Category and tag system",
      "Comment system with threading",
      "Social media sharing",
      "Dark mode support",
      "Offline reading capability",
    ],
    link: "#",
    year: "2024",
    role: "Full Stack Developer",
  },
];