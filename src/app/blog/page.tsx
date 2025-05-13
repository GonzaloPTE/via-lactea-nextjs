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

  // Fetch count
  const { count: totalCount, error: countError } = await supabase
    .from('blog_posts')
    .select('', { count: 'exact', head: true })
    // .eq('status', 'published'); // Temporarily commented out to show all posts

  if (countError) {
    console.error('Error fetching post count:', countError);
  }

  const totalPages = Math.ceil((totalCount || 0) / pageSize);

  const validCurrentPage = Math.max(1, Math.min(currentPage, totalPages || 1));
  const offset = (validCurrentPage - 1) * pageSize;

  // Fetch posts
  const query = supabase
    .from('blog_posts')
    .select('id, title, slug, meta_description, created_at, published_at, issue_ids, status, category, tags, is_featured, content_html') // Added content_html
    // .eq('status', 'published'); // Keep commented out for now
    .range(offset, offset + pageSize - 1); // Restore range

  // Restore ordering
  if (sortOption === 'oldest') {
    query.order('published_at', { ascending: true, nullsFirst: false }).order('created_at', { ascending: true });
  } else {
    query.order('published_at', { ascending: false, nullsFirst: false }).order('created_at', { ascending: false });
  }

  const { data: posts, error } = await query;

  if (error) {
    console.error('Error fetching posts:', error);
  }

  const blogPosts: IBlogPost[] = posts || []; // Remove cast

  return { blogPosts, totalPages, currentPage: validCurrentPage };
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