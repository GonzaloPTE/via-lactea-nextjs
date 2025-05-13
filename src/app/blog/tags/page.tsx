import { Fragment } from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
// import { cookies } from 'next/headers'; // No longer needed directly for client creation
// import { createServerClient, type CookieOptions } from '@supabase/ssr'; // No longer needed directly

import ViaLacteaNavbar from '../../../components/blocks/navbar/via-lactea/ViaLacteaNavbar';
import CalendlyButton from '../../../components/blocks/navbar/components/CalendlyButton';
import ViaLacteaFooter from '../../../components/blocks/footer/ViaLacteaFooter';
import PageHeader from '../../../components/reuseable/PageHeader';
import { createSupabaseServerClient } from '../../../lib/supabase/server'; // USE THIS
import { getAllUniqueTags } from '../../../lib/supabase/blog';
import { slugify } from '../../../lib/utils';
// import BlogSidebar from '../../../components/reuseable/BlogSidebar'; // Sidebar removed

// SEO Metadata
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Etiquetas del Blog | Vía Láctea",
    description: "Explora todos los artículos de nuestro blog por etiquetas. Encuentra contenido relevante sobre sueño infantil, lactancia, crianza y más.",
    keywords: ["etiquetas blog", "tags blog", "temas blog", "Vía Láctea blog", "sueño infantil", "lactancia"],
    alternates: {
      canonical: "/blog/tags",
    },
    openGraph: {
      title: "Etiquetas del Blog | Vía Láctea",
      description: "Explora todos los artículos de nuestro blog por etiquetas.",
      url: "/blog/tags",
      type: "website",
      // images: [ { url: '/img/via-lactea/og-image-blog-tags.jpg' } ] // Example OG image
    },
    twitter: {
      card: "summary_large_image",
      title: "Etiquetas del Blog | Vía Láctea",
      description: "Explora todos los artículos de nuestro blog por etiquetas.",
      // images: [ '/img/via-lactea/og-image-blog-tags.jpg' ] // Example Twitter image
    }
  };
}

export default async function TagsPage() {
  const supabase = await createSupabaseServerClient(); // Use the centralized server client
  const tags = await getAllUniqueTags(supabase);
  tags.sort((a, b) => a.localeCompare(b)); // Sort tags alphabetically

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://vialacteasuenoylactancia.com';

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Blog",
        "item": `${baseUrl}/blog`
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Etiquetas",
        "item": `${baseUrl}/blog/tags`
      }
    ]
  };

  return (
    <Fragment>
      {/* ========== SEO: BreadcrumbList Schema ========== */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <header className="wrapper bg-soft-primary">
        <ViaLacteaNavbar button={<CalendlyButton />} />
      </header>

      <main className="content-wrapper">
        <PageHeader
          title="Etiquetas del Blog"
          subtitle="Explora nuestros artículos por temas y etiquetas"
        />

        <section className="wrapper bg-light">
          <div className="container py-10 py-md-12">
            <div className="row gx-lg-8 gy-8">
              <div className="col-lg-8">
                {tags && tags.length > 0 ? (
                  <div className="d-flex flex-wrap align-items-center justify-content-start gap-2">
                    {tags.map((tag) => (
                      <Link 
                        href={`/blog/tags/${slugify(tag)}`} 
                        key={tag} 
                        className="btn btn-soft-ash btn-sm rounded-pill"
                      >
                        {tag}
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-center">
                    <p className="lead">No hay etiquetas disponibles en este momento.</p>
                    <p>Vuelve más tarde para explorar nuestro contenido.</p>
                  </div>
                )}
              </div>

              {/* <aside className="col-lg-4 sidebar mt-8 mt-lg-0">
                <BlogSidebar />
              </aside> */}
            </div>
          </div>
        </section>
      </main>

      <ViaLacteaFooter />
    </Fragment>
  );
} 