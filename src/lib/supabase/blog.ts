import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../../types/supabase'; // Corrected path
import { IBlogPost } from '../../types/blog'; // Corrected path
import { slugify, generateDeterministicPostDate } from '../utils'; // Import generateDeterministicPostDate

/**
 * Helper function to process posts and ensure they have a date.
 */
function processPostDates(post: IBlogPost): IBlogPost {
  if (!post.published_at) {
    const deterministicDate = generateDeterministicPostDate(post.id).toISOString();
    post.published_at = deterministicDate;
    // If created_at was also missing, set it to the same deterministic date for completeness.
    // Otherwise, its original value (if any) is preserved.
    if (!post.created_at) {
      post.created_at = deterministicDate; 
    }
  }
  return post;
}

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
    .select('*') // Select all columns, IBlogPost type should match
    .eq('slug', slug)
    // .eq('status', 'published') // DEBUG: Temporarily commented out for debugging - TO BE RE-ENABLED
    .single();

  if (error) {
    console.error(`Error fetching post by slug ${slug}:`, error.message); // Keep essential error logs
    return null;
  }
  if (data) {
    return processPostDates(data as IBlogPost);
  }
  return null;
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
      // .eq('status', 'published') // DEBUG: Temporarily commented out - TO BE RE-ENABLED
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
      // .eq('status', 'published') // DEBUG: Temporarily commented out - TO BE RE-ENABLED
      .order('published_at', { ascending: false })
      .limit(remainingLimit);

    if (recentError) {
      console.error('Error fetching recent posts for related section:', recentError.message);
    } else if (recentPosts) {
      posts = [...posts, ...(recentPosts as IBlogPost[])];
    }
  }
  
  // Process dates for all fetched posts
  const processedPosts = posts.map(processPostDates);
  return processedPosts.slice(0, limit);
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

// --- NEW FUNCTIONS ---

export async function getAllUniqueCategories(supabase: SupabaseClient<Database>): Promise<string[]> {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('category') 
    .not('category', 'is', null)
    // .eq('status', 'published'); // DEBUG: Temporarily commented out for debugging - TO BE RE-ENABLED

  if (error) {
    console.error('Error fetching unique categories:', error);
    return [];
  }
  // Extraer, filtrar nulos/vacíos y obtener valores únicos
  const categories = data?.map(item => item.category).filter(Boolean) as string[];
  return [...new Set(categories)];
}

export async function getAllUniqueTags(supabase: SupabaseClient<Database>): Promise<string[]> {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('tags')
    .not('tags', 'is', null)
    // .eq('status', 'published'); // DEBUG: Temporarily commented out for debugging - TO BE RE-ENABLED

  if (error) {
    console.error('Error fetching unique tags:', error);
    return [];
  }
  const allTags = data?.flatMap(item => item.tags || []).filter(Boolean) as string[];
  return [...new Set(allTags)];
}

const POST_COLUMNS_SELECT = 'id, title, slug, meta_description, created_at, published_at, issue_ids, status, category, tags, is_featured, content_html';

export async function getPostsByCategoryOrTag(
  supabase: SupabaseClient<Database>,
  filterType: 'category' | 'tag',
  slug: string, 
  currentPage: number,
  pageSize: number,
  sortOption: 'newest' | 'oldest'
): Promise<{ posts: IBlogPost[]; totalPages: number; currentPage: number; name: string | null }> {
  
  let originalName: string | null = null;
  let queryCount = supabase.from('blog_posts').select('id', { count: 'exact', head: true });
  let queryData = supabase.from('blog_posts').select(POST_COLUMNS_SELECT);
  
  if (filterType === 'category') {
    const { data: categoriesData, error: catError } = await supabase
        .from('blog_posts')
        .select('category')
        .not('category', 'is', null);
        // .eq('status', 'published'); // DEBUG: Temporarily commented out - TO BE RE-ENABLED
    
    if (catError || !categoriesData) {
        console.error(`Error fetching categories to match slug ${slug}:`, catError); 
        return { posts: [], totalPages: 0, currentPage: 1, name: null };
    }
    const uniqueRawCategories = [...new Set(categoriesData.map(c => c.category).filter(Boolean) as string[])];

    const foundCategory = uniqueRawCategories.find(c => {
      const currentSlug = slugify(c);
      return currentSlug === slug;
    });
    
    if (!foundCategory) {
      return { posts: [], totalPages: 0, currentPage: 1, name: null };
    }
    originalName = foundCategory;
    queryCount = queryCount.eq('category', originalName);
    queryData = queryData.eq('category', originalName);

  } else { // filterType === 'tag'
    const { data: tagsData, error: tagError } = await supabase
        .from('blog_posts')
        .select('tags')
        .not('tags', 'is', null);
        // .eq('status', 'published'); // DEBUG: Temporarily commented out - TO BE RE-ENABLED

    if (tagError || !tagsData) {
        console.error(`Error fetching tags to match slug ${slug}:`, tagError); 
        return { posts: [], totalPages: 0, currentPage: 1, name: null };
    }
    const allTags = [...new Set(tagsData.flatMap(item => item.tags || []).filter(Boolean) as string[])];

    const foundTag = allTags.find(t => {
      const currentSlug = slugify(t);
      return currentSlug === slug;
    });

    if (!foundTag) {
      return { posts: [], totalPages: 0, currentPage: 1, name: null };
    }
    originalName = foundTag;
    queryCount = queryCount.contains('tags', [originalName]);
    queryData = queryData.contains('tags', [originalName]);
  }

  // queryCount = queryCount.eq('status', 'published'); // DEBUG: Temporarily commented out for debugging - TO BE RE-ENABLED
  // queryData = queryData.eq('status', 'published');  // DEBUG: Temporarily commented out for debugging - TO BE RE-ENABLED

  // Fetch all posts matching the filter (category/tag) first for in-memory sorting
  const { data: allPostsData, error: dataError } = await queryData;

  if (dataError) {
    console.error(`Error fetching all posts by ${filterType} '${originalName}':`, dataError.message);
    return { posts: [], totalPages: 0, currentPage: 1, name: originalName };
  }

  let processedAndSortedPosts = (allPostsData || []).map(p => processPostDates(p as IBlogPost));

  // Sort in memory
  processedAndSortedPosts.sort((a, b) => {
    const dateA = new Date(a.published_at || a.created_at || 0).getTime();
    const dateB = new Date(b.published_at || b.created_at || 0).getTime();
    return sortOption === 'newest' ? dateB - dateA : dateA - dateB;
  });

  // Get Total Count for pagination (this query is more efficient than counting after fetching all data fields)
  const { count, error: countError } = await queryCount;
  if (countError) {
    console.error(`Error fetching post count by ${filterType} '${originalName}':`, countError);
    // Fallback if count fails, but we have data: paginate based on what we have, though totalPages might be inaccurate.
    // This case should be rare.
    const totalPagesFallback = Math.ceil(processedAndSortedPosts.length / pageSize);
    const validCurrentPageFallback = Math.max(1, Math.min(currentPage, totalPagesFallback || 1));
    const offsetFallback = (validCurrentPageFallback - 1) * pageSize;
    const paginatedPostsFallback = processedAndSortedPosts.slice(offsetFallback, offsetFallback + pageSize);
    return { posts: paginatedPostsFallback, totalPages: totalPagesFallback, currentPage: validCurrentPageFallback, name: originalName };
  }
  
  const totalCount = count || 0;
  const totalPages = Math.ceil(totalCount / pageSize);
  const validCurrentPage = Math.max(1, Math.min(currentPage, totalPages || 1));
  const offset = (validCurrentPage - 1) * pageSize;

  // Apply pagination in memory
  const paginatedPosts = processedAndSortedPosts.slice(offset, offset + pageSize);
  
  return { posts: paginatedPosts, totalPages, currentPage: validCurrentPage, name: originalName };
}

export interface TagWithCount {
  name: string;
  count: number;
}

export async function getPopularTags(
  supabase: SupabaseClient<Database>,
  categoryName?: string | null,
  limit: number = 15
): Promise<TagWithCount[]> {
  let query = supabase.from('blog_posts').select('tags, category');
  // query = query.eq('status', 'published'); // DEBUG: Temporarily commented out - TO BE RE-ENABLED

  if (categoryName) {
    query = query.eq('category', categoryName);
  }

  const { data: posts, error } = await query;

  if (error) {
    console.error('Error fetching posts for popular tags:', error.message);
    return [];
  }

  if (!posts) {
    return [];
  }

  const tagCounts: Record<string, number> = {};

  posts.forEach(post => {
    if (post.tags) {
      post.tags.forEach(tag => {
        if (tag) { // Ensure tag is not null or empty
          tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        }
      });
    }
  });

  const sortedTags = Object.entries(tagCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  return sortedTags.slice(0, limit);
} 