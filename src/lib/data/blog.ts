import postsData from '../../data/blog_posts_lite.json';
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

export const allPublishedPosts: IBlogPost[] = (postsData as any[]).map(processPostDates);

// Replicate the functions that used to need supabase
export async function getPostBySlug(slug: string): Promise<IBlogPost | null> {
  const postLite = allPublishedPosts.find(p => p.slug === slug);
  if (!postLite) return null;
  
  // Try to load the full content dynamically
  try {
    const fullPost = await import(`../../data/posts/${slug}.json`);
    return { ...postLite, ...fullPost.default };
  } catch (error) {
    console.error(`Error loading full post data for ${slug}:`, error);
    return postLite;
  }
}

export async function getRelatedPosts(
  currentPostId: number,
  category: string | null | undefined,
  limit: number = 3
): Promise<IBlogPost[]> {
  let posts: IBlogPost[] = [];
  
  if (category) {
    posts = allPublishedPosts
      .filter(p => p.category === category && p.id !== currentPostId)
      .sort((a, b) => new Date(b.published_at!).getTime() - new Date(a.published_at!).getTime());
  }
  
  if (posts.length < limit) {
    const remainingLimit = limit - posts.length;
    const existingIds = new Set(posts.map(p => p.id));
    existingIds.add(currentPostId);
    
    const recentPosts = allPublishedPosts
      .filter(p => !existingIds.has(p.id))
      .sort((a, b) => new Date(b.published_at!).getTime() - new Date(a.published_at!).getTime())
      .slice(0, remainingLimit);
      
    posts = [...posts, ...recentPosts];
  }
  return posts.slice(0, limit);
}

export async function getAllUniqueCategories(): Promise<string[]> {
  const cats = allPublishedPosts.map(p => p.category).filter(Boolean) as string[];
  return [...new Set(cats)];
}

export async function getAllUniqueTags(): Promise<string[]> {
  const tags = allPublishedPosts.flatMap(p => p.tags || []).filter(Boolean) as string[];
  return [...new Set(tags)];
}

export async function getPopularTags(categoryName?: string | null, limit: number = 15) {
  let posts = allPublishedPosts;
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
  return allPublishedPosts.map(post => ({
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
  let filteredPosts = allPublishedPosts;
  let originalName: string | null = null;
  
  if (filterType === 'category') {
    const cats = await getAllUniqueCategories();
    const foundCategory = cats.find(c => slugify(c) === slug);
    if (!foundCategory) return { posts: [], totalPages: 0, currentPage: 1, name: null };
    originalName = foundCategory;
    filteredPosts = allPublishedPosts.filter(p => p.category === originalName);
  } else {
    const tags = await getAllUniqueTags();
    const foundTag = tags.find(t => slugify(t) === slug);
    if (!foundTag) return { posts: [], totalPages: 0, currentPage: 1, name: null };
    originalName = foundTag;
    filteredPosts = allPublishedPosts.filter(p => p.tags && p.tags.includes(originalName!));
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
  const sortParam = searchParams['ordenar']; 
  const pageParam = searchParams['pagina'];  
  const sortOption = sortParam === 'oldest' ? 'oldest' : 'newest';
  const currentPage = parseInt(typeof pageParam === 'string' ? pageParam : '1', 10);
  const pageSize = 6;
  
  const sortedPosts = [...allPublishedPosts].sort((a, b) => {
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
