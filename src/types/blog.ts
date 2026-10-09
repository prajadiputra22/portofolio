export type PostStatus = "draft" | "published";

export type BlogCategory = {
  id: string;
  name: string;
  slug: string;
};

export type BlogPostRow = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image_url: string | null;
  category_id: string;
  category: BlogCategory | null; // hasil join blog_categories
  tags: string[];
  featured: boolean;
  status: PostStatus;
  views: number;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export type BlogListItem = Omit<BlogPostRow, "content">;
