"use client";

import { use } from "react";
import DashboardShell from "@/components/Dashboardshell";
import BlogForm from "@/components/dashboard/BlogForm";

export default function EditBlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return (
    <DashboardShell title="Manage Blog">
      <BlogForm postId={id} />
    </DashboardShell>
  );
}
