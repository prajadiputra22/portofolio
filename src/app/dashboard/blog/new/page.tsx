"use client";

import DashboardShell from "@/components/Dashboardshell";
import BlogForm from "@/components/BlogForm";

export default function NewBlogPostPage() {
  return (
    <DashboardShell title="Manage Blog">
      <BlogForm />
    </DashboardShell>
  );
}
