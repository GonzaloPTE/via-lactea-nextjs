import { Metadata } from "next";
import Link from "next/link"; // Import Link

// CUSTOM COMPONENTS
import ViaLacteaNavbar from "components/blocks/navbar/via-lactea/ViaLacteaNavbar";
import ViaLacteaFooter from "components/blocks/footer/ViaLacteaFooter";
import PageHeader from "components/reuseable/PageHeader";
import FigureImage from "components/reuseable/FigureImage"; // For category images

// CUSTOM LIB FUNCTIONS
import { createSupabaseServerClient } from "lib/supabase/server"; // USE THIS
import { getAllUniqueCategories } from "lib/supabase/blog";
import { slugify } from "lib/utils";
import DUMMY_IMAGE_POOL from "lib/blog-image-pool"; // For category card images

// ===================================================================================================
// METADATA FUNCTION
// ===================================================================================================
export async function generateMetadata(): Promise<Metadata> {
  // Basic metadata, can be expanded based on lib/meta.ts or specific SEO strategy
  return {
    title: "Categorías del Blog | Vía Láctea",
    description: "Explora todas las categorías de nuestro blog en Vía Láctea. Encuentra artículos detallados, guías y consejos sobre lactancia, sueño infantil, desarrollo del bebé, y mucho más. ¡Sumérgete en el tema que más te interese!",
    alternates: {
      canonical: "/blog/categorias",
    },
    openGraph: {
      title: "Categorías del Blog | Vía Láctea",
      description: "Explora todas las categorías de nuestro blog en Vía Láctea. Encuentra artículos detallados, guías y consejos sobre lactancia, sueño infantil, desarrollo del bebé, y mucho más. ¡Sumérgete en el tema que más te interese!",
      url: "/blog/categorias",
      type: "website",
      // images: [ { url: '/path/to/default-blog-image.jpg' } ] // Add a default image if available
    },
    twitter: {
      card: "summary_large_image",
      title: "Categorías del Blog | Vía Láctea",
      description: "Explora todas las categorías de nuestro blog en Vía Láctea. Encuentra artículos detallados, guías y consejos sobre lactancia, sueño infantil, desarrollo del bebé, y mucho más. ¡Sumérgete en el tema que más te interese!",
      // images: [ '/path/to/default-blog-image.jpg' ] // Add a default image if available
    }
  };
}

// ===================================================================================================
// CATEGORY CARD COMPONENT (Simplified BlogCard3)
// ===================================================================================================
interface CategoryCardProps {
  link: string;
  title: string;
  image: string;
  description: string;
}

function CategoryCard({ title, link, image, description }: CategoryCardProps) {
  return (
    <div className="col-md-6 col-lg-4 mb-4"> {/* Grid column classes */}
      <article className="item post">
        <div className="card h-100"> {/* Ensure cards have equal height if in a row */}
          <figure className="card-img-top overlay overlay-1 hover-scale">
            <Link href={link}>
              <FigureImage width={560} height={350} src={image} />
              <span className="bg" />
            </Link>
            <figcaption>
              <h5 className="from-top mb-0">Explorar Categoría</h5>
            </figcaption>
          </figure>

          <div className="card-body">
            <div className="post-header">
              <h2 className="post-title h4 mt-1 mb-2"> {/* Smaller title for category card */}
                <Link href={link} className="link-dark">{title}</Link>
              </h2>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}


// ===================================================================================================
// PAGE COMPONENT
// ===================================================================================================
export default async function BlogCategoriesPage() {
  const supabase = await createSupabaseServerClient(); // Use the centralized server client

  const categories = await getAllUniqueCategories(supabase);
  categories.sort((a, b) => a.localeCompare(b));

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
        "name": "Categorías",
        "item": `${baseUrl}/blog/categorias`
      }
    ]
  };

  return (
    <>
      {/* ========== SEO: BreadcrumbList Schema ========== */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* ========== NAVIGATION BAR ========== */}
      <ViaLacteaNavbar />

      <main className="content-wrapper">
        {/* ========== PAGE HEADER ========== */}
        <PageHeader 
          title="Categorías del Blog Vía Láctea"
          subtitle="Sumérgete en temas clave como lactancia, sueño infantil y desarrollo del bebé. Explora nuestras categorías para encontrar guías y consejos prácticos que te acompañarán en la crianza."
        />
        
        <section className="wrapper bg-light">
          <div className="container py-10 py-md-12">
            <div className="row gx-lg-8 gy-8">
              <div className="col-12">
                <div className="row">
                  {categories && categories.length > 0 ? (
                    categories.map((category, index) => {
                      const categorySlug = slugify(category);
                      const imageSrc = DUMMY_IMAGE_POOL[index % DUMMY_IMAGE_POOL.length];
                      const description = `Descubre artículos, guías y consejos sobre ${category}. Profundiza en este tema y encuentra el apoyo que necesitas.`;
                      
                      return (
                        <CategoryCard
                          key={categorySlug}
                          title={category}
                          link={`/blog/categorias/${categorySlug}`}
                          image={imageSrc}
                          description={description}
                        />
                      );
                    })
                  ) : (
                    <div className="col-12 text-center">
                      <p className="lead">Actualmente no tenemos categorías definidas.</p>
                      <p>¡Estamos trabajando en organizar nuestro contenido! Mientras tanto, puedes explorar todos nuestros artículos en el <Link href="/blog" className="hover-underline text-primary">blog principal</Link>.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ========== FOOTER ========== */}
      <ViaLacteaFooter />
    </>
  );
} 