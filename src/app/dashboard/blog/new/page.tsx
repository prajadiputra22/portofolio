"use client";

import DashboardShell from "@/components/dashboard/DashboardShell";
import BlogForm from "@/components/blog/BlogForm";

export default function NewBlogPostPage() {
  return (
    <DashboardShell title="Manage Blog">
      <BlogForm />
    </DashboardShell>
  );
}
