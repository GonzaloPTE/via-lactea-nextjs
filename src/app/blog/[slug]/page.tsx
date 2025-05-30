import { Fragment } from 'react';
import { notFound } from 'next/navigation';
// Corrected path
import { IBlogPost } from '../../../types/blog';   // Corrected path
import { getPostBySlug } from '../../../lib/supabase/blog'; // Corrected path
import { createSupabaseServerClient } from "../../../lib/supabase/server"; // Import the new utility
import { processPostHtmlContent } from '../../../lib/utils'; // Nueva importación

// Import Components
import ViaLacteaNavbar from '../../../components/blocks/navbar/via-lactea/ViaLacteaNavbar'; // Corrected path
import CalendlyButton from '../../../components/blocks/navbar/components/CalendlyButton'; // Corrected path
import BlogPostHero from '../../../components/blocks/hero/BlogPostHero'; // Corrected path
import BlogSidebar from '../../../components/reuseable/BlogSidebar'; // Corrected path
import SocialShareButtons from '../../../components/reuseable/SocialShareButtons'; // Corrected path
import RelatedArticles from '../../../components/reuseable/RelatedArticles'; // Corrected path
import ViaLacteaFooter from '../../../components/blocks/footer/ViaLacteaFooter'; // Corrected path
import Link from 'next/link';

// Utils for date formatting
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { slugify } from '../../../lib/utils'; // Import slugify
import DUMMY_IMAGE_POOL from '../../../lib/blog-image-pool';

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Function to get Supabase client
// REMOVE THE OLD getSupabaseClient FUNCTION
// const getSupabaseClient = async () => { ... };

// SEO Metadata Generation
export async function generateMetadata({ params }: BlogPostPageProps) {
  const awaitedParams = await params;
  const supabase = await createSupabaseServerClient(); // Use the new utility
  const post = await getPostBySlug(supabase, awaitedParams.slug);

  if (!post) {
    return {
      title: 'Artículo no encontrado',
      description: 'El artículo que buscas no existe o ha sido movido.',
    };
  }

  return {
    title: post.title,
    description: post.meta_description,
    // openGraph: { // Optional: Add OpenGraph tags for better social sharing
    //   title: post.title,
    //   description: post.meta_description,
    //   images: [post.imageUrl || DUMMY_IMAGE_POOL[0]], // Use actual image if available
    //   url: `https://vialacteasuenoylactancia.com/blog/${post.slug}`,
    //   type: 'article',
    //   publishedTime: post.published_at,
    //   authors: ['Miriam Rubio'], // Or link to author page
    //   tags: post.tags,
    // },
  };
}

// Schema.org JSON-LD Generation
const generateBlogPostingJsonLd = (post: IBlogPost, imageUrl: string, canonicalUrl: string) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': canonicalUrl,
    },
    headline: post.title,
    description: post.meta_description,
    image: imageUrl, // Use the selected image for the hero
    author: {
      '@type': 'Person',
      // TODO: Use @id for Miriam Rubio once available in schema-org.md and Person schema is updated
      name: 'Miriam Rubio', 
      // "@id": "https://vialacteasuenoylactancia.com/#person-miriam-rubio"
    },
    publisher: {
      '@type': 'Organization',
      '@id': 'https://vialacteasuenoylactancia.com/#organization', // From schema-org.md
    },
    datePublished: post.published_at ? new Date(post.published_at).toISOString() : new Date(post.created_at).toISOString(),
    dateModified: post.published_at ? new Date(post.published_at).toISOString() : new Date(post.created_at).toISOString(), // Placeholder, use updated_at if available
  };
};

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const supabase = await createSupabaseServerClient(); // Use the new utility
  const awaitedParams = await params;
  const post = await getPostBySlug(supabase, awaitedParams.slug);

  if (!post) {
    notFound(); // Triggers Next.js 404 page
  }

  // Image selection logic (modulo based)
  const selectedImage = DUMMY_IMAGE_POOL[post.id % DUMMY_IMAGE_POOL.length];

  // Format dates for display
  const displayDate = post.published_at
    ? format(new Date(post.published_at), 'dd MMM yyyy', { locale: es })
    : format(new Date(post.created_at), 'dd MMM yyyy', { locale: es });
  
  const siteUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://vialacteasuenoylactancia.com';
  const canonicalUrl = `${siteUrl}/blog/${post.slug}`;
  const heroImageUrl = `${siteUrl}${selectedImage}`;

  const jsonLd = generateBlogPostingJsonLd(post, heroImageUrl, canonicalUrl);

  // Define Instagram profile URL (should ideally come from env or config)
  const VIA_LACTEA_INSTAGRAM_URL = "https://www.instagram.com/vialacteasuenoylactancia/";

  const processedContentHtml = processPostHtmlContent(post.content_html);

  return (
    <Fragment>
      <header className="wrapper bg-soft-primary">
        <ViaLacteaNavbar button={<CalendlyButton />}/>
      </header>

      <main className="content-wrapper">
        <BlogPostHero 
          title={post.title} 
          category={post.category}
          publishedDate={displayDate} 
          imageUrl={selectedImage} 
        />

        <section className="wrapper bg-light">
          <div className="container py-10 py-md-12">
            <div className="row gx-lg-8 gx-xl-12">
              <div className="col-lg-8">
                {/* Post Content */}
                <div className="post-content" dangerouslySetInnerHTML={{ __html: processedContentHtml }} />

                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                  <div className="post-tags mt-6 mb-3">
                    {post.tags.map((tag) => (
                      <Link 
                        href={`/blog/tag/${slugify(tag)}`} 
                        key={tag} 
                        className="text-primary me-2 hover-underline"
                      >
                        #{tag}
                      </Link>
                    ))}
                  </div>
                )}
                
                <SocialShareButtons 
                  url={canonicalUrl} 
                  title={post.title} 
                  instagramProfileUrl={VIA_LACTEA_INSTAGRAM_URL}
                />
              </div>

              <aside className="col-lg-4 sidebar mt-8 mt-lg-0">
                <BlogSidebar 
                  tags={post.tags}
                  currentCategory={post.category}
                />
              </aside>
            </div>
          </div>
        </section>
        <RelatedArticles 
          currentPostId={post.id} 
          category={post.category}
          tags={post.tags}
        />
      </main>

      
      
      <ViaLacteaFooter />

      {/* Schema.org JSON-LD Script */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </Fragment>
  );
}
