import { Fragment } from 'react';
import { notFound } from 'next/navigation';
import { Metadata, ResolvingMetadata } from 'next';
import { createSupabaseServerClient } from '../../../../lib/supabase/server';

// Componentes
import ViaLacteaNavbar from '../../../../components/blocks/navbar/via-lactea/ViaLacteaNavbar';
import CalendlyButton from '../../../../components/blocks/navbar/components/CalendlyButton';
import ViaLacteaFooter from '../../../../components/blocks/footer/ViaLacteaFooter';
import PageHeader from '../../../../components/reuseable/PageHeader';
import BlogSidebar from '../../../../components/reuseable/BlogSidebar';
import BlogPostList from '../../../../components/reuseable/BlogPostList';

// Supabase y datos
import { getPostsByCategoryOrTag } from '../../../../lib/supabase/blog';

const PAGE_SIZE = 6; // Constante para el tamaño de página

type TagPostsPageProps = {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

// ===================================================================================================
// METADATA FUNCTION
// ===================================================================================================
export async function generateMetadata(
  { params, searchParams }: TagPostsPageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const supabase = await createSupabaseServerClient();

  const awaitedParams = await params;
  const awaitedSearchParams = await searchParams;
  const { slug } = awaitedParams;
  const sortParam = awaitedSearchParams?.['ordenar'];
  const pageParam = awaitedSearchParams?.['pagina'];
  const sortOption = sortParam === 'oldest' ? 'oldest' : 'newest';
  const { name: tagName } = await getPostsByCategoryOrTag(supabase, 'tag', slug, 1, 1, sortOption);

  if (!tagName) {
    return {
      title: "Etiqueta no encontrada | Blog Vía Láctea",
      description: "La etiqueta que buscas no existe o no está disponible.",
      alternates: { canonical: `/blog/tags/${slug}` },
    };
  }

  const pageTitle = `Posts con la etiqueta #${tagName} | Blog Vía Láctea`;
  const pageDescription = `Descubre todos nuestros artículos y posts marcados con la etiqueta #${tagName}. Encuentra información relevante y actualizada.`;
  const canonicalUrl = `/blog/tags/${slug}`;

  return {
    title: pageTitle,
    description: pageDescription,
    keywords: [tagName, `blog ${tagName}`, `artículos ${tagName}`, "Vía Láctea"],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      url: canonicalUrl,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description: pageDescription,
    },
  };
}

// ===================================================================================================
// PAGE COMPONENT
// ===================================================================================================
export default async function TagPostsPage({ params, searchParams }: TagPostsPageProps) {
  const supabase = await createSupabaseServerClient();
  const awaitedParams = await params;
  const awaitedSearchParams = await searchParams;
  const { slug } = awaitedParams;
  const sortParam = awaitedSearchParams?.['ordenar'];
  const pageParam = awaitedSearchParams?.['pagina'];
  const sortOption = sortParam === 'oldest' ? 'oldest' : 'newest';
  const currentPage = parseInt(typeof pageParam === 'string' ? pageParam : '1', 10);

  const { posts, totalPages, currentPage: validatedCurrentPage, name: tagName } = await getPostsByCategoryOrTag(
    supabase,
    'tag',
    slug,
    currentPage,
    PAGE_SIZE,
    sortOption
  );

  if (!tagName) {
    notFound();
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://vialacteasuenoylactancia.com';
  const pageUrl = `${baseUrl}/blog/tags/${slug}`;

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": `${pageUrl}#breadcrumb`,
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
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": tagName,
        "item": pageUrl
      }
    ]
  };

  const collectionPageSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": `Posts con la etiqueta #${tagName} - Blog Vía Láctea`,
    "description": `Colección de artículos del blog de Vía Láctea con la etiqueta #${tagName}. En esta página encontrarás posts relacionados con ${tagName}.`,
    "url": pageUrl,
    "breadcrumb": {
      "@id": breadcrumbSchema["@id"]
    }
  };

  return (
    <Fragment>
      {/* ========== SEO: BreadcrumbList & CollectionPage Schemas ========== */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumbSchema, collectionPageSchema]) }}
      />

      <header className="wrapper bg-soft-primary">
        <ViaLacteaNavbar button={<CalendlyButton />} />
      </header>

      <main className="content-wrapper">
        <PageHeader
          title={`Artículos etiquetados como: ${tagName}`}
          subtitle={`Explorando la etiqueta "${tagName}"`}
        />

        <section className="wrapper bg-light">
          <div className="container py-10 py-md-12">
            <div className="row gx-lg-8 gx-xl-12">
              <div className="col-lg-8">
                <BlogPostList
                  posts={posts}
                  totalPages={totalPages}
                  currentPage={validatedCurrentPage}
                  emptyListMessage={`No se encontraron artículos con la etiqueta "${tagName}".`}
                  emptyListLink={{
                    href: "/blog/tags",
                    text: "Ver todas las etiquetas"
                  }}
                />
              </div>
              <aside className="col-lg-4 sidebar mt-8 mt-lg-0">
                <BlogSidebar 
                  currentTag={tagName}
                />
              </aside>
            </div>
          </div>
        </section>
      </main>

      <ViaLacteaFooter />
    </Fragment>
  );
} 