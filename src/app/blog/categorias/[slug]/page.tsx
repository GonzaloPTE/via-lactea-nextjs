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

type CategoryPostsPageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata(
  { params, searchParams }: CategoryPostsPageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const supabase = await createSupabaseServerClient();
  
  const awaitedParams = await params;
  const awaitedSearchParams = await searchParams;
  const { slug } = awaitedParams;
  const sortParam = awaitedSearchParams?.['ordenar'];
  const pageParam = awaitedSearchParams?.['pagina'];
  const sortOption = sortParam === 'oldest' ? 'oldest' : 'newest';
  const currentPage = parseInt(typeof pageParam === 'string' ? pageParam : '1', 10);
  const { name: categoryName } = await getPostsByCategoryOrTag(supabase, 'category', slug, currentPage, PAGE_SIZE, sortOption);

  if (!categoryName) {
    return {
      title: "Categoría no encontrada | Blog Vía Láctea",
      description: "La categoría que buscas no existe o no está disponible.",
      alternates: { canonical: `/blog/categorias/${slug}` }
    };
  }

  const pageTitle = `Posts sobre ${categoryName} | Blog Vía Láctea`;
  const pageDescription = `Explora todos nuestros artículos y recursos sobre ${categoryName}. Información actualizada y consejos prácticos.`;
  const canonicalUrl = `/blog/categorias/${slug}`;

  return {
    title: pageTitle,
    description: pageDescription,
    keywords: [categoryName, `blog ${categoryName}`, `artículos ${categoryName}`, "Vía Láctea"],
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

export default async function CategoryPostsPage({ params, searchParams }: CategoryPostsPageProps) {
  const supabase = await createSupabaseServerClient();
  const awaitedParams = await params;
  const awaitedSearchParams = await searchParams;
  const { slug } = awaitedParams;
  const sortParam = awaitedSearchParams?.['ordenar'];
  const pageParam = awaitedSearchParams?.['pagina'];
  const sortOption = sortParam === 'oldest' ? 'oldest' : 'newest';
  const currentPage = parseInt(typeof pageParam === 'string' ? pageParam : '1', 10);

  const { posts, totalPages, currentPage: validatedCurrentPage, name: categoryName } = await getPostsByCategoryOrTag(
    supabase,
    'category',
    slug,
    currentPage,
    PAGE_SIZE,
    sortOption
  );

  if (!categoryName) {
    notFound(); // Categoría no encontrada
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://vialacteasuenoylactancia.com';
  const pageUrl = `${baseUrl}/blog/categorias/${slug}`;

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": `${pageUrl}#breadcrumb`, // ID para referenciar
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
        "name": "Categorías",
        "item": `${baseUrl}/blog/categorias`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": categoryName,
        "item": pageUrl
      }
    ]
  };

  const collectionPageSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": `Artículos sobre ${categoryName} - Blog Vía Láctea`,
    "description": `Colección de artículos del blog de Vía Láctea sobre ${categoryName}. En esta página encontrarás posts relacionados con ${categoryName}.`,
    "url": pageUrl,
    "breadcrumb": {
      "@id": breadcrumbSchema["@id"] // Referencia al ID del BreadcrumbList
    }
    // mainEntity o hasPart podrían añadirse si se pasan los datos de los posts
    // Ejemplo: "mainEntity": { "@type": "ItemList", "itemListElement": [/* ... post list items ... */] }
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
          title={`Artículos sobre: ${categoryName}`}
          subtitle={`Explorando la categoría "${categoryName}"`}
        />

        <section className="wrapper bg-light">
          <div className="container py-10 py-md-12">
            <div className="row gx-lg-8 gx-xl-12">
              <div className="col-lg-8">
                <BlogPostList
                  posts={posts}
                  totalPages={totalPages}
                  currentPage={validatedCurrentPage}
                  emptyListMessage={`No se encontraron artículos en la categoría "${categoryName}".`}
                  emptyListLink={{
                    href: "/blog/categorias",
                    text: "Ver todas las categorías"
                  }}
                />
              </div>
              <aside className="col-lg-4 sidebar mt-8 mt-lg-0">
                <BlogSidebar 
                  currentCategory={categoryName}
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