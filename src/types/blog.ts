export interface IBlogPost {
  id: number;
  title: string;
  slug: string;
  content?: string; // Markdown content (optional for display if content_html is primary)
  content_html: string | null | undefined; // Rendered HTML content
  meta_description: string | null | undefined;
  category: string | null | undefined;
  tags: string[] | null | undefined;
  created_at: string;
  published_at: string | null | undefined;
  // issue_ids: number[]; // Kept for now, might be useful for related posts logic later
  // status: string; // Kept for now, might be useful for related posts logic or other UI indicators
  is_featured?: boolean; // Added as per database schema, optional
}

export interface BlogPostHeroProps {
  title: string;
  category?: string | null;
  publishedDate: string; // Formatted date string
  imageUrl: string;      // URL of the stock image
}

export interface SocialShareButtonsProps {
  url: string;  // The canonical URL of the blog post to share
  title: string; // The title of the blog post (for sharing messages)
}

export interface RelatedArticlesProps {
  currentPostId: number;
  category?: string | null;
  tags?: string[] | null;
} 