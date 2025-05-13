import { Fragment } from "react";
import CalendlyButton from "components/blocks/navbar/components/CalendlyButton";
import ViaLacteaNavbar from "components/blocks/navbar/via-lactea/ViaLacteaNavbar";
// Updated imports: Removed Carousel, BlogCard4. Added BlogCard3, Pagination.
import { BlogCard3 } from "components/reuseable/blog-cards"; 
import PaginationClientWrapper from "components/reuseable/PaginationClientWrapper"; // Use the wrapper again
import BlogSidebar from "components/reuseable/BlogSidebar"; 
import BlogHero from "components/blocks/hero/BlogHero"; // Import BlogHero
// Utils
import { format } from 'date-fns'; 
import { es } from 'date-fns/locale'; 

// Supabase
import { Database } from '../../types/supabase'; 
import { SupabaseClient } from '@supabase/supabase-js';
import ViaLacteaFooter from "components/blocks/footer/ViaLacteaFooter";
import { IBlogPost } from "../../types/blog"; // Import IBlogPost
import DUMMY_IMAGE_POOL from '../../lib/blog-image-pool';
import { createSupabaseServerClient } from "../../lib/supabase/server"; // Import the new utility
import BlogPostList from "components/reuseable/BlogPostList"; // Import the new component
import { generateDeterministicPostDate } from "../../lib/utils"; // Import generateDeterministicPostDate

// --- Define Page Props ---
interface BlogPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

// --- Restore Helper Function for Data Fetching ---
async function getBlogData(
  supabase: SupabaseClient<Database>,
  searchParams: BlogPageProps['searchParams']
) {
  // Read params inside the function - this is where the error occurred before
  const awaitedSearchParams = await searchParams;
  const sortParam = awaitedSearchParams['ordenar']; 
  const pageParam = awaitedSearchParams['pagina'];  
  const sortOption = sortParam === 'oldest' ? 'oldest' : 'newest';
  const currentPage = parseInt(typeof pageParam === 'string' ? pageParam : '1', 10);
  const pageSize = 6;

  // Fetch count first (more efficient for totalPages calculation)
  const { count: totalCountResult, error: countError } = await supabase
    .from('blog_posts')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'published');

  if (countError) {
    console.error('Error fetching post count:', countError);
    // Handle error or return empty/fallback state
  }
  const totalCount = totalCountResult || 0;
  const totalPages = Math.ceil(totalCount / pageSize);
  const validCurrentPage = Math.max(1, Math.min(currentPage, totalPages || 1));
  const offset = (validCurrentPage - 1) * pageSize;

  // Fetch ALL posts (without DB pagination or sorting)
  const { data: allPosts, error: postsError } = await supabase
    .from('blog_posts')
    .select('id, title, slug, meta_description, created_at, published_at, issue_ids, status, category, tags, is_featured, content_html') // Added content_html
    .eq('status', 'published');
    // DB-level .range() and .order() removed

  if (postsError) {
    console.error('Error fetching posts:', postsError);
    return { blogPosts: [], totalPages: 0, currentPage: 1 }; // Return empty state on error
  }

  let processedAndSortedPosts: IBlogPost[] = allPosts || [];

  // Process dates for all fetched posts
  processedAndSortedPosts = processedAndSortedPosts.map(post => {
    if (!post.published_at && post.id) { // Check post.id exists
      const deterministicDate = generateDeterministicPostDate(post.id).toISOString();
      post.published_at = deterministicDate;
      if (!post.created_at) {
        post.created_at = deterministicDate;
      }
    }
    return post;
  });

  // Sort in memory
  processedAndSortedPosts.sort((a, b) => {
    const dateA = new Date(a.published_at || a.created_at || 0).getTime();
    const dateB = new Date(b.published_at || b.created_at || 0).getTime();
    return sortOption === 'newest' ? dateB - dateA : dateA - dateB;
  });

  // Apply pagination in memory
  const paginatedPosts = processedAndSortedPosts.slice(offset, offset + pageSize);

  return { blogPosts: paginatedPosts, totalPages, currentPage: validCurrentPage };
}

// --- Main Page Component (Server Component) ---
export default async function BlogPage({ searchParams }: BlogPageProps) { // Make async again, accept searchParams
  // Setup server client
  const supabase = await createSupabaseServerClient(); // Use the new utility

  // Fetch data using the helper
  const { blogPosts, totalPages, currentPage } = await getBlogData(supabase, searchParams);

  return (
    <Fragment>
      {/* ========== Header ========== */}
      <header className="wrapper bg-soft-primary"> { /* Match ResourcesHero? */}
        <ViaLacteaNavbar button={<CalendlyButton />}/>
      </header>

      <main className="content-wrapper">
        {/* ========== Blog Hero Section ========== */}
        <BlogHero />

        {/* ========== Blog Posts Section with Sidebar ========== */}
        <section className="wrapper bg-light"> {/* Or bg-soft-primary like resources? */} 
          <div className="container py-10 py-md-12">
            {/* Render content directly */}
            <div className="row gx-lg-8 gx-xl-12">
              {/* Main Content Column */}
              <div className="col-lg-8">
                <BlogPostList 
                  posts={blogPosts}
                  totalPages={totalPages}
                  currentPage={currentPage}
                  // emptyListMessage and emptyListLink can be customized if needed for this page
                />
              </div>
              {/* Sidebar Column */}
              <aside className="col-lg-4 sidebar mt-8 mt-lg-0">
                <BlogSidebar />
              </aside>
            </div> {/* End row */}
          </div> {/* End container */}
            </section>

        {/* ========== Optional: Add CTA or other sections if needed ========== */}
        <ViaLacteaFooter />

      </main>
    </Fragment>
  );
} 