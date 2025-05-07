import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../../types/supabase'; // Corrected path
import { IBlogPost } from '../../types/blog'; // Corrected path

/**
 * Fetches a single blog post by its slug from the Supabase database.
 *
 * @param supabase - The Supabase client instance.
 * @param slug - The slug of the blog post to fetch.
 * @returns A promise that resolves to the IBlogPost object or null if not found.
 */
export async function getPostBySlug(
  supabase: SupabaseClient<Database>,
  slug: string
): Promise<IBlogPost | null> {
  const { data, error } = await supabase
    .from('blog_posts')
    .select(
      'id, title, slug, content, content_html, meta_description, category, tags, created_at, published_at, is_featured'
    )
    .eq('slug', slug)
    .single(); // .single() fetches one row and returns null if not found, or errors if multiple found

  if (error) {
    console.error(`Error fetching post by slug "${slug}":`, error.message);
    // Optionally, you might want to throw the error or handle it differently
    // For now, returning null on error (which .single() does for not found, but this catches other errors too)
    return null;
  }

  // Ensure the data conforms to IBlogPost, especially for nullable fields
  // The select statement should align with IBlogPost fields.
  // Supabase's .single() will return null if no row matches, which is the desired behavior.
  return data as IBlogPost | null;
}

/**
 * Fetches related blog posts.
 *
 * @param supabase - The Supabase client instance.
 * @param currentPostId - The ID of the current post to exclude.
 * @param category - The category of the current post to find similar posts.
 * @param limit - The maximum number of related posts to return.
 * @returns A promise that resolves to an array of IBlogPost objects.
 */
export async function getRelatedPosts(
  supabase: SupabaseClient<Database>,
  currentPostId: number,
  category: string | null | undefined,
  limit: number = 3
): Promise<IBlogPost[]> {
  let posts: IBlogPost[] = [];

  // 1. Try to fetch by category first
  if (category) {
    const { data: categoryPosts, error: categoryError } = await supabase
      .from('blog_posts')
      .select('id, title, slug, meta_description, category, created_at, published_at, is_featured, tags') // Select fields needed for BlogCard3
      .eq('category', category)
      .neq('id', currentPostId)
      // .eq('status', 'published') // Assuming only published posts should be related
      .order('published_at', { ascending: false })
      .limit(limit);

    if (categoryError) {
      console.error(`Error fetching related posts by category "${category}":`, categoryError.message);
    } else if (categoryPosts) {
      posts = categoryPosts as IBlogPost[];
    }
  }

  // 2. If not enough posts from category, fetch recent posts to fill up
  if (posts.length < limit) {
    const remainingLimit = limit - posts.length;
    const existingIds = posts.map(p => p.id);
    if (currentPostId) existingIds.push(currentPostId); // Ensure current post is always excluded

    const { data: recentPosts, error: recentError } = await supabase
      .from('blog_posts')
      .select('id, title, slug, meta_description, category, created_at, published_at, is_featured, tags')
      .not('id', 'in', `(${existingIds.join(',')})`) // Exclude already fetched posts and current post
      // .eq('status', 'published')
      .order('published_at', { ascending: false })
      .limit(remainingLimit);

    if (recentError) {
      console.error('Error fetching recent posts for related section:', recentError.message);
    } else if (recentPosts) {
      posts = [...posts, ...(recentPosts as IBlogPost[])];
    }
  }
  
  // Ensure we don't exceed the limit due to combining queries, though the logic above should handle it.
  return posts.slice(0, limit);
}

/**
 * Fetches all unique tags used across all blog posts.
 *
 * @param supabase - The Supabase client instance.
 * @returns A promise that resolves to an array of unique tag strings.
 */
export async function getAllTags(
  supabase: SupabaseClient<Database>
): Promise<string[]> {
  // Fetch the 'tags' column from all posts
  // Consider adding .eq('status', 'published') if only tags from published posts are desired
  const { data, error } = await supabase
    .from('blog_posts')
    .select('tags');
    // .eq('status', 'published');

  if (error) {
    console.error('Error fetching all tags:', error.message);
    return [];
  }

  if (!data) {
    return [];
  }

  // Flatten the array of arrays and filter out null/empty tags
  const allTags = data.flatMap(post => post.tags || []).filter(tag => tag);

  // Get unique tags using a Set
  const uniqueTags = [...new Set(allTags)];

  // Sort tags alphabetically (optional)
  uniqueTags.sort((a, b) => a.localeCompare(b));

  return uniqueTags;
} 