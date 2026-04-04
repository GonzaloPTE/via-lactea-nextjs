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

export async function getBlogPosts(): Promise<IBlogPost[]> {
  if (cachedPosts) return cachedPosts;

  // 1. Cloudflare R2 binding (Runtime - Worker)
  // This is the primary method in production and has zero bundle overhead.
  const bucket = (process.env as any).BLOG_BUCKET || (globalThis as any).BLOG_BUCKET;
  
  if (!bucket) {
    console.warn('BLOG_BUCKET binding not found on process.env or globalThis');
  }

  if (bucket && typeof bucket.get === 'function') {
    try {
      console.log('Fetching from R2 bucket binding...');
      const obj = await bucket.get('blog_posts.json');
      if (obj) {
        const data = await obj.json();
        console.log(`Success! Fetched ${data.length} posts from R2 binding.`);
        cachedPosts = (data as any[]).map(processPostDates);
        return cachedPosts!;
      } else {
        console.warn('Object blog_posts.json NOT found in R2 bucket.');
      }
    } catch (error) {
      console.error('Error fetching from R2 bucket binding:', error);
    }
  }

  // 2. Fallback to local file (Build time / Local Development)
  // The local file is populated by a separate sync script during build.
  try {
    const fs = await import('fs');
    const path = await import('path');
    const localPath = path.join(process.cwd(), 'src/data/blog_posts_merged.json');
    if (fs.existsSync(localPath)) {
      const data = JSON.parse(fs.readFileSync(localPath, 'utf-8'));
      cachedPosts = (data as any[]).map(processPostDates);
      return cachedPosts!;
    }
  } catch (e) {
    // environments without 'fs' support (like Edge runtime)
  }

  return [];
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
