import { IBlogPost } from '../../types/blog';
import { slugify, generateDeterministicPostDate } from '../utils';

// Helper to assure dates
export function processPostDates(post: any): IBlogPost {
  if (!post.published_at && post.id) {
    const deterministicDate = generateDeterministicPostDate(post.id).toISOString();
    post.published_at = deterministicDate;
    if (!post.created_at) {
      post.created_at = deterministicDate;
    }
  }
  return post as IBlogPost;
}

let cachedPosts: IBlogPost[] | null = null;

const BLOG_DATA_URL = 'https://blog.vialacteasuenoylactancia.com/blog_posts.json';

export async function getBlogPosts(): Promise<IBlogPost[]> {
  if (cachedPosts) return cachedPosts;

  try {
    const response = await fetch(BLOG_DATA_URL, {
      next: { revalidate: 3600 } // Revalidate every hour
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch blog posts: ${response.statusText}`);
    }

    const data = await response.json();
    console.log(`Success! Fetched ${data.length} posts from ${BLOG_DATA_URL}`);
    cachedPosts = (data as any[]).map(processPostDates);
    return cachedPosts!;
  } catch (error) {
    console.error('Error fetching blog posts from URL:', error);
    return [];
  }
}

// Replicate the functions that used to need supabase
export async function getPostBySlug(slug: string): Promise<IBlogPost | null> {
  const allPosts = await getBlogPosts();
  const post = allPosts.find(p => p.slug === slug);
  return post || null;
}

export async function getRelatedPosts(
  currentPostId: number,
  category: string | null | undefined,
  limit: number = 3
): Promise<IBlogPost[]> {
  const allPosts = await getBlogPosts();
  let posts: IBlogPost[] = [];
  
  if (category) {
    posts = allPosts
      .filter(p => p.category === category && p.id !== currentPostId)
      .sort((a, b) => new Date(b.published_at!).getTime() - new Date(a.published_at!).getTime());
  }
  
  if (posts.length < limit) {
    const remainingLimit = limit - posts.length;
    const existingIds = new Set(posts.map(p => p.id));
    existingIds.add(currentPostId);
    
    const recentPosts = allPosts
      .filter(p => !existingIds.has(p.id))
      .sort((a, b) => new Date(b.published_at!).getTime() - new Date(a.published_at!).getTime())
      .slice(0, remainingLimit);
      
    posts = [...posts, ...recentPosts];
  }
  return posts.slice(0, limit);
}

export async function getAllUniqueCategories(): Promise<string[]> {
  const allPosts = await getBlogPosts();
  const cats = allPosts.map(p => p.category).filter(Boolean) as string[];
  return [...new Set(cats)];
}

export async function getAllUniqueTags(): Promise<string[]> {
  const allPosts = await getBlogPosts();
  const tags = allPosts.flatMap(p => p.tags || []).filter(Boolean) as string[];
  return [...new Set(tags)];
}

export async function getPopularTags(categoryName?: string | null, limit: number = 15) {
  const allPosts = await getBlogPosts();
  let posts = allPosts;
  if (categoryName) {
    posts = posts.filter(p => p.category === categoryName);
  }
  const tagCounts: Record<string, number> = {};
  posts.forEach(post => {
    if (post.tags) {
      post.tags.forEach(tag => {
        if (tag) tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    }
  });
  const sortedTags = Object.entries(tagCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
  return sortedTags.slice(0, limit);
}

export async function getAllPublishedPostSlugsAndDates() {
  const allPosts = await getBlogPosts();
  return allPosts.map(post => ({
    slug: post.slug,
    lastModified: post.published_at!
  }));
}

export async function getPostsByCategoryOrTag(
  filterType: 'category' | 'tag',
  slug: string, 
  currentPage: number,
  pageSize: number,
  sortOption: 'newest' | 'oldest'
) {
  const allPosts = await getBlogPosts();
  let filteredPosts = allPosts;
  let originalName: string | null = null;
  
  if (filterType === 'category') {
    const cats = await getAllUniqueCategories();
    const foundCategory = cats.find(c => slugify(c) === slug);
    if (!foundCategory) return { posts: [], totalPages: 0, currentPage: 1, name: null };
    originalName = foundCategory;
    filteredPosts = allPosts.filter(p => p.category === originalName);
  } else {
    const tags = await getAllUniqueTags();
    const foundTag = tags.find(t => slugify(t) === slug);
    if (!foundTag) return { posts: [], totalPages: 0, currentPage: 1, name: null };
    originalName = foundTag;
    filteredPosts = allPosts.filter(p => p.tags && p.tags.includes(originalName!));
  }
  
  const sortedPosts = [...filteredPosts].sort((a, b) => {
    const dateA = new Date(a.published_at!).getTime();
    const dateB = new Date(b.published_at!).getTime();
    return sortOption === 'newest' ? dateB - dateA : dateA - dateB;
  });
  
  const totalPages = Math.ceil(sortedPosts.length / pageSize);
  const validCurrentPage = Math.max(1, Math.min(currentPage, totalPages || 1));
  const offset = (validCurrentPage - 1) * pageSize;
  const paginatedPosts = sortedPosts.slice(offset, offset + pageSize);
  
  return { posts: paginatedPosts, totalPages, currentPage: validCurrentPage, name: originalName };
}

export async function getBlogData(
  searchParams: { [key: string]: string | string[] | undefined }
) {
  const allPosts = await getBlogPosts();
  const sortParam = searchParams['ordenar']; 
  const pageParam = searchParams['pagina'];  
  const sortOption = sortParam === 'oldest' ? 'oldest' : 'newest';
  const currentPage = parseInt(typeof pageParam === 'string' ? pageParam : '1', 10);
  const pageSize = 6;
  
  const sortedPosts = [...allPosts].sort((a, b) => {
    const dateA = new Date(a.published_at!).getTime();
    const dateB = new Date(b.published_at!).getTime();
    return sortOption === 'newest' ? dateB - dateA : dateA - dateB;
  });
  
  const totalPages = Math.ceil(sortedPosts.length / pageSize);
  const validCurrentPage = Math.max(1, Math.min(currentPage, totalPages || 1));
  const offset = (validCurrentPage - 1) * pageSize;
  const paginatedPosts = sortedPosts.slice(offset, offset + pageSize);
  
  return { blogPosts: paginatedPosts, totalPages, currentPage: validCurrentPage };
}
