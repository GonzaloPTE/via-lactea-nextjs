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
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { Database } from '../../types/supabase'; 
import { SupabaseClient } from '@supabase/supabase-js';
import ViaLacteaFooter from "components/blocks/footer/ViaLacteaFooter";
import { IBlogPost } from "../../types/blog"; // Import IBlogPost
import DUMMY_IMAGE_POOL from '../../lib/blog-image-pool';

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
  const cookieStore = await cookies()
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: { 
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        }
      },
    }
  )

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
                {blogPosts.length > 0 ? (
                  <div className="position-relative">
                    <div className="blog grid grid-view">
                      <div className="row isotope gx-md-8 gy-8 mb-8">
                        {blogPosts.map((item) => {
                          // Map IBlogPost to BlogCard3 props
                          const image = DUMMY_IMAGE_POOL[item.id % DUMMY_IMAGE_POOL.length];
                          const cardProps = {
                            id: item.id,
                            link: `/blog/${item.slug}`,
                            image, // Imagen correspondiente
                            title: item.title,
                            category: "Consejos", // Use default category
                            description: item.meta_description || '', // Use meta_description
                            date: item.published_at 
                              ? format(new Date(item.published_at), 'dd MMM yyyy', { locale: es })
                              : format(new Date(item.created_at), 'dd MMM yyyy', { locale: es })
                          };
                          return (
                            <BlogCard3 {...cardProps} key={item.id} />
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ) : (
                  // Message if no posts found
                  <div className="text-center py-10">
                    <p className="text-lg text-gray-600">No hay artículos disponibles por el momento.</p>
                    <p className="text-gray-500">Vuelve pronto para encontrar nuevo contenido.</p>
                  </div>
                )}

                {/* Pagination - Needs props eventually for real data */}
                {blogPosts.length > 0 && (
                  <PaginationClientWrapper 
                    className="justify-content-start" 
                    altStyle 
                    totalPages={totalPages}
                    currentPage={currentPage}
                  />
                )}
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