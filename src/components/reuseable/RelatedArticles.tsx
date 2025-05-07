import React from 'react';
import { RelatedArticlesProps } from '../../types/blog';
import { IBlogPost } from '../../types/blog';
import { createServerClient } from '@supabase/ssr'; // For server-side data fetching
import { cookies } from 'next/headers'; // For server-side data fetching
import { Database } from '../../types/supabase';
import { getRelatedPosts } from '../../lib/supabase/blog';
import { BlogCard3 } from './blog-cards'; // Assuming BlogCard3 is in this path
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

// Helper to get Supabase client, similar to the one in page.tsx
// This could be refactored into a shared utility if used in many Server Components
const getSupabaseClientForComponent = async () => {
  const cookieStore = await cookies();
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: any[]) { // Simplified type for brevity, ensure it matches actual usage
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              if (typeof (cookieStore as any).set === 'function') {
                (cookieStore as any).set(name, value, options);
              }
            });
          } catch (error) { /* Server components cannot set cookies */ }
        }
      }
    }
  );
};

const RelatedArticles: React.FC<RelatedArticlesProps> = async ({ currentPostId, category, tags }) => {
  const supabase = await getSupabaseClientForComponent();
  const relatedPosts: IBlogPost[] = await getRelatedPosts(supabase, currentPostId, category, 3);

  if (!relatedPosts || relatedPosts.length === 0) {
    return null; // Don't render the section if no related articles found
  }

  return (
    <section className="wrapper related-articles-section pt-0 pb-12 pt-md-0 pb-md-16">
      <div className="container">
        <h3 className="mb-6 text-center">También te puede interesar...</h3>
        <div className="row gy-4 justify-content-center">
          {relatedPosts.map((post) => {
             // Map IBlogPost to BlogCard3 props
             const cardProps = {
              id: post.id,
              link: `/blog/${post.slug}`,
              image: DUMMY_IMAGE_POOL_RELATED[post.id % DUMMY_IMAGE_POOL_RELATED.length], // Use a separate or same image pool
              title: post.title,
              category: post.category || "Consejos", 
              description: post.meta_description || '', 
              date: post.published_at 
                ? format(new Date(post.published_at), 'dd MMM yyyy', { locale: es })
                : format(new Date(post.created_at), 'dd MMM yyyy', { locale: es })
            };
            return (
              <div className="col-md-6 col-lg-4" key={post.id}>
                <BlogCard3 {...cardProps} disableDefaultColClass={true} />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

// Define a dummy image pool for related articles, can be same as main one or different
const DUMMY_IMAGE_POOL_RELATED = [
  '/img/photos/b4.jpg',
  '/img/photos/b1.jpg',
  '/img/photos/b2.jpg',
  '/img/photos/b3.jpg',
];

export default RelatedArticles; 