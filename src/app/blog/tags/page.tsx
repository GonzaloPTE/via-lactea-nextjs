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
    description: "Descubre artículos de Vía Láctea por etiquetas. Filtra por temas específicos como #LactanciaExclusiva, #SueñoRecienNacido, #CrianzaRespetuosa y más para acceder rápidamente a la información que buscas.",
    keywords: ["etiquetas blog", "tags blog", "temas blog", "Vía Láctea blog", "sueño infantil", "lactancia", "crianza respetuosa", "alimentación complementaria"],
    alternates: {
      canonical: "/blog/tags",
    },
    openGraph: {
      title: "Etiquetas del Blog | Vía Láctea",
      description: "Descubre artículos de Vía Láctea por etiquetas. Filtra por temas específicos como #LactanciaExclusiva, #SueñoRecienNacido, #CrianzaRespetuosa y más para acceder rápidamente a la información que buscas.",
      url: "/blog/tags",
      type: "website",
      // images: [ { url: '/img/via-lactea/og-image-blog-tags.jpg' } ] // Example OG image
    },
    twitter: {
      card: "summary_large_image",
      title: "Etiquetas del Blog | Vía Láctea",
      description: "Descubre artículos de Vía Láctea por etiquetas. Filtra por temas específicos como #LactanciaExclusiva, #SueñoRecienNacido, #CrianzaRespetuosa y más para acceder rápidamente a la información que buscas.",
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
          title="Etiquetas del Blog Vía Láctea"
          subtitle="Accede directamente a la información que te interesa sobre #Lactancia, #SueñoInfantil, #CrianzaRespetuosa y otros temas clave navegando por nuestras etiquetas."
        />

        <section className="wrapper bg-light">
          <div className="container py-10 py-md-12">
            <div className="row gx-lg-8 gy-8">
              <div className="col-12">
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
                    <p className="lead">Aún no hemos añadido etiquetas a nuestros artículos.</p>
                    <p>¡Estamos en ello! Mientras tanto, te invitamos a explorar todos nuestros posts en el <Link href="/blog" className="hover-underline text-primary">blog principal</Link>.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <ViaLacteaFooter />
    </Fragment>
  );
} 