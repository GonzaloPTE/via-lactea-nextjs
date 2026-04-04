import { Fragment } from "react";
import CalendlyButton from "components/blocks/navbar/components/CalendlyButton";
import ViaLacteaNavbar from "components/blocks/navbar/via-lactea/ViaLacteaNavbar";
import BlogSidebar from "components/reuseable/BlogSidebar"; 
import BlogHero from "components/blocks/hero/BlogHero";
import ViaLacteaFooter from "components/blocks/footer/ViaLacteaFooter";
import BlogPostList from "components/reuseable/BlogPostList";
import { getBlogData } from "../../lib/data/blog";

// --- Define Page Props ---
interface BlogPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

// --- Main Page Component (Server Component) ---
export default async function BlogPage({ searchParams }: BlogPageProps) {
  const awaitedSearchParams = await searchParams;
  const { blogPosts, totalPages, currentPage } = await getBlogData(awaitedSearchParams);

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