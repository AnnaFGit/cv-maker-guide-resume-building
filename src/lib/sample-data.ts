import { CVData } from "./cv-types";

export const SAMPLE_CV_DATA: CVData = {
  contact: {
    name: "Alex Carter",
    title: "Senior Software Engineer",
    email: "alex.carter@domain.com",
    phone: "+1 (555) 019-2834",
    location: "San Francisco, CA",
    linkedin: "linkedin.com/in/alexcarter-example",
    showPhoto: false,
  },
  summary: "Results-driven Software Engineer with 6+ years of experience design and development of distributed systems. Proven history of optimizing database performance, reducing network latency by 30%, and leading high-impact migration projects in Agile team environments.",
  experience: [
    {
      id: "exp-sample-1",
      title: "Senior Software Engineer",
      company: "Innovatech Solutions",
      location: "San Francisco, CA",
      startDate: "2023-04",
      endDate: "",
      current: true,
      description: "Spearheaded the migration of legacy service endpoints to Next.js microservices, cutting client bundle sizes by 40%.\nArchitected a real-time data sync pipeline, improving dashboard responsiveness for 15,000+ daily active users.\nMentored 4 associate developers, reducing engineering team onboarding duration by 3 weeks.",
    },
    {
      id: "exp-sample-2",
      title: "Software Engineer",
      company: "DevSystems Inc.",
      location: "Boston, MA",
      startDate: "2020-09",
      endDate: "2023-03",
      current: false,
      description: "Developed and shipped a cloud-based client account management portal using React and Node.js.\nOptimized core PostgreSQL database queries, reducing average API response times by 25% across all profiles.\nCollaborated closely with product designers to implement custom theme components, ensuring Web Content Accessibility Guidelines (WCAG) AA compliance.",
    },
  ],
  education: [
    {
      id: "edu-sample-1",
      degree: "B.S. in Computer Science",
      school: "Boston University",
      location: "Boston, MA",
      startDate: "2016-09",
      endDate: "2020-05",
      current: false,
      description: "Graduated with honors. Specialization in systems engineering and database systems.",
    },
  ],
  skills: [
    "javascript",
    "typescript",
    "python",
    "react",
    "next.js",
    "node.js",
    "postgresql",
    "docker",
    "aws",
    "git",
    "ci/cd",
    "rest api",
    "graphql",
    "agile",
    "system design",
  ],
  optional: [
    {
      id: "opt-sec-sample-1",
      title: "Certifications",
      items: [
        {
          id: "opt-item-sample-1",
          title: "AWS Certified Solutions Architect — Associate",
          subtitle: "Amazon Web Services (AWS)",
          date: "2024",
        },
        {
          id: "opt-item-sample-2",
          title: "Certified ScrumMaster (CSM)",
          subtitle: "Scrum Alliance",
          date: "2022",
        },
      ],
    },
    {
      id: "opt-sec-sample-2",
      title: "Projects",
      items: [
        {
          id: "opt-item-sample-3",
          title: "Open Source Markdown Engine",
          subtitle: "Creator & Lead Developer",
          date: "2021",
          description: "Built a high-performance javascript parser for custom markdown configurations, garnering 400+ stars on GitHub.",
        },
      ],
    },
  ],
};
