import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../../types/supabase'; // Corrected path
import { IBlogPost } from '../../types/blog'; // Corrected path
import { slugify } from '../utils'; // Assuming slugify is in ../utils

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
    // .eq('status', 'published') // Temporarily commented out for debugging
    .single();

  if (error) {
    console.error(`Error fetching post by slug ${slug}:`, error);
    return null;
  }
  return data as IBlogPost;
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

// --- NEW FUNCTIONS ---

export async function getAllUniqueCategories(supabase: SupabaseClient<Database>): Promise<string[]> {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('category') 
    .not('category', 'is', null)
    // .eq('status', 'published'); // Temporarily commented out for debugging

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
    // .eq('status', 'published'); // Temporarily commented out for debugging

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
  
  // console.log(`[getPostsByCategoryOrTag] Received slug: "${slug}", filterType: "${filterType}"`); // LOG REMOVED

  let originalName: string | null = null;
  let queryCount = supabase.from('blog_posts').select('id', { count: 'exact', head: true });
  let queryData = supabase.from('blog_posts').select(POST_COLUMNS_SELECT);
  
  if (filterType === 'category') {
    const { data: categoriesData, error: catError } = await supabase
        .from('blog_posts')
        .select('category')
        .not('category', 'is', null);
        // .eq('status', 'published');
    
    // console.log('[getPostsByCategoryOrTag] Raw categoriesData:', categoriesData); // LOG REMOVED

    if (catError || !categoriesData) {
        // console.error(`[getPostsByCategoryOrTag] Error fetching categories to match slug ${slug}:`, catError); // LOG REMOVED (original error still good)
        console.error(`Error fetching categories to match slug ${slug}:`, catError); // Keep standard error
        return { posts: [], totalPages: 0, currentPage: 1, name: null };
    }
    const uniqueRawCategories = [...new Set(categoriesData.map(c => c.category).filter(Boolean) as string[])];
    // console.log('[getPostsByCategoryOrTag] Unique raw categories from DB:', uniqueRawCategories); // LOG REMOVED

    const foundCategory = uniqueRawCategories.find(c => {
      const currentSlug = slugify(c);
      // console.log(`[getPostsByCategoryOrTag] Comparing DB category "${c}" (slugified: "${currentSlug}") with URL slug "${slug}"`); // LOG REMOVED
      return currentSlug === slug;
    });
    
    if (!foundCategory) {
      // console.log(`[getPostsByCategoryOrTag] No matching category found for slug "${slug}"`); // LOG REMOVED
      return { posts: [], totalPages: 0, currentPage: 1, name: null };
    }
    originalName = foundCategory;
    // console.log(`[getPostsByCategoryOrTag] Matched category. Original name: "${originalName}"`); // LOG REMOVED
    queryCount = queryCount.eq('category', originalName);
    queryData = queryData.eq('category', originalName);

  } else { // filterType === 'tag'
    const { data: tagsData, error: tagError } = await supabase
        .from('blog_posts')
        .select('tags')
        .not('tags', 'is', null);
        // .eq('status', 'published');

    // console.log('[getPostsByCategoryOrTag] Raw tagsData:', tagsData); // LOG REMOVED

    if (tagError || !tagsData) {
        // console.error(`[getPostsByCategoryOrTag] Error fetching tags to match slug ${slug}:`, tagError); // LOG REMOVED
        console.error(`Error fetching tags to match slug ${slug}:`, tagError); // Keep standard error
        return { posts: [], totalPages: 0, currentPage: 1, name: null };
    }
    const allTags = [...new Set(tagsData.flatMap(item => item.tags || []).filter(Boolean) as string[])];
    // console.log('[getPostsByCategoryOrTag] Unique raw tags from DB:', allTags); // LOG REMOVED

    const foundTag = allTags.find(t => {
      const currentSlug = slugify(t);
      // console.log(`[getPostsByCategoryOrTag] Comparing DB tag "${t}" (slugified: "${currentSlug}") with URL slug "${slug}"`); // LOG REMOVED
      return currentSlug === slug;
    });

    if (!foundTag) {
      // console.log(`[getPostsByCategoryOrTag] No matching tag found for slug "${slug}"`); // LOG REMOVED
      return { posts: [], totalPages: 0, currentPage: 1, name: null };
    }
    originalName = foundTag;
    // console.log(`[getPostsByCategoryOrTag] Matched tag. Original name: "${originalName}"`); // LOG REMOVED
    queryCount = queryCount.contains('tags', [originalName]);
    queryData = queryData.contains('tags', [originalName]);
  }

  // queryCount = queryCount.eq('status', 'published'); // TEMPORARILY COMMENTED OUT FOR DEBUGGING
  // queryData = queryData.eq('status', 'published');  // TEMPORARILY COMMENTED OUT FOR DEBUGGING

  // Get Total Count
  const { count, error: countError } = await queryCount;
  if (countError) {
    console.error(`Error fetching post count by ${filterType} '${originalName}':`, countError);
    return { posts: [], totalPages: 0, currentPage: 1, name: originalName };
  }
  
  const totalCount = count || 0;
  const totalPages = Math.ceil(totalCount / pageSize);
  const validCurrentPage = Math.max(1, Math.min(currentPage, totalPages || 1));
  const offset = (validCurrentPage - 1) * pageSize;

  queryData = queryData.range(offset, offset + pageSize - 1);

  if (sortOption === 'oldest') {
    queryData = queryData.order('published_at', { ascending: true, nullsFirst: false }).order('created_at', { ascending: true });
  } else {
    queryData = queryData.order('published_at', { ascending: false, nullsFirst: false }).order('created_at', { ascending: false });
  }

  const { data: postsData, error: dataError } = await queryData;
  // console.log(`[getPostsByCategoryOrTag] For ${filterType} "${originalName}", postsData:`, postsData); // Add this if posts are still not showing
  // console.log(`[getPostsByCategoryOrTag] For ${filterType} "${originalName}", dataError:`, dataError); // Add this if posts are still not showing


  if (dataError) {
    console.error(`Error fetching posts by ${filterType} '${originalName}':`, dataError);
    return { posts: [], totalPages, currentPage: validCurrentPage, name: originalName };
  }
  
  return { posts: (postsData || []) as IBlogPost[], totalPages, currentPage: validCurrentPage, name: originalName };
} 