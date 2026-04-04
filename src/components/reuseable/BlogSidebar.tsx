import { format } from "date-fns";
import { es } from "date-fns/locale";
import Link from "next/link";
import { Fragment } from "react";
import { slugify, generateDeterministicPostDate } from "../../lib/utils"; // Keep slugify and generateDeterministicPostDate
import DUMMY_IMAGE_POOL from "../../lib/blog-image-pool";
import { IBlogPost } from '../../types/blog';
import { 
  getBlogPosts, 
  getAllUniqueCategories, 
  getPopularTags 
} from "../../lib/data/blog"; // Import from new provider

// GLOBAL CUSTOM COMPONENTS
import FigureImage from "./FigureImage";
import NextLink from "components/reuseable/links/NextLink"; // Keep NextLink for other parts
import SocialLinks from "components/reuseable/SocialLinks";

// CUSTOM DATA
// ========================================================
type BlogSidebarProps = {
   thumbnail?: string;
   // For single post page: tags of the current post
   // For listing pages: this might be unused or could represent a subset of tags from the list
   tags?: string[] | null; 
   allCategories?: string[] | null; // All available categories
   currentCategory?: string | null; // Name of the current category (if on a category-filtered page)
   currentTag?: string | null;      // Name of the current tag (if on a tag-filtered page)
   // postsForTagExtraction?: IBlogPost[]; // Optional: Pass listed posts to extract tags from, if not showing allTags
};
// ========================================================

async function getSidebarData(currentCategory?: string | null) {
  // Use memory data from the provider
  const allPosts = await getBlogPosts();
  const popularPosts = [...allPosts]
    .sort((a, b) => new Date(b.published_at!).getTime() - new Date(a.published_at!).getTime())
    .slice(0, 3);

  // Fetch all unique categories
  const categories = await getAllUniqueCategories();
  // Fetch popular tags (conditionally by category)
  const popularTags = await getPopularTags(currentCategory);

  return { popularPosts, categories, popularTags };
}


export default async function BlogSidebar({ 
  thumbnail, 
  tags: currentPostTags, 
  allCategories: passedAllCategories, 
  currentCategory,
  currentTag 
}: BlogSidebarProps) {
  const { popularPosts, categories: fetchedCategories, popularTags } = await getSidebarData(currentCategory);

  const displayCategories = passedAllCategories || fetchedCategories;

  return (
    <Fragment>
      {/* About Widget */}
      <div className="widget">
        <h4 className="widget-title mb-3">Sobre Via Láctea</h4>
        {thumbnail && (
          <figure className="rounded mb-4">
            <img className="img-fluid" src={thumbnail} alt="" />
          </figure>
        )}
        <p>
          Somos expertas en lactancia y sueño infantil. Te acompañamos con información y apoyo práctico para que disfrutes la crianza de tu bebé.
        </p>
        <SocialLinks className="nav social" />
      </div>

      {/* Popular Posts Widget (Dynamic) */}
      <div className="widget">
        <h4 className="widget-title mb-3">Artículos Populares</h4>
        <ul className="image-list">
          {popularPosts.map(({ id, title, published_at, created_at, slug }) => {
            const image = DUMMY_IMAGE_POOL[id % DUMMY_IMAGE_POOL.length];
            const href = slug ? `/blog/${slug}` : '#';
            const date = published_at || created_at;
            return (
              <li key={id}>
                <NextLink title={<FigureImage width={100} height={100} className="rounded" src={image} />} href={href} />
                <div className="post-content">
                  <h6 className="mb-2">
                    <NextLink className="link-dark" title={title} href={href} />
                  </h6>
                  <ul className="post-meta">
                      <i className="uil uil-calendar-alt" />
                      <span>{format(new Date(date!), "dd MMM yyyy", { locale: es })}</span>
                  </ul>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Categories Widget (Dynamic) */}
      <div className="widget">
        <h4 className="widget-title mb-3">Categorías</h4>
        {displayCategories && displayCategories.length > 0 ? (
          <ul className="unordered-list bullet-primary text-reset">
            {displayCategories.map((category) => (
              <li key={category} className={currentCategory === category ? 'fw-bold' : ''}>
                <Link href={`/blog/categorias/${slugify(category)}`} className="link-dark">
                  {category}
                </Link>
                {/* We don't have post counts per category easily here without more complex queries */}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted">No hay categorías disponibles.</p>
        )}
        <div className="mt-3">
           <Link href="/blog/categorias" className="hover-underline text-primary">Ver todas las categorías <span className="ms-2">→</span></Link>
        </div>
      </div>

      {/* Tags Widget - Logic to be refined based on context */}
      <div className="widget">
        {/* Title will be conditional */} 
        {currentPostTags && currentPostTags.length > 0 ? (
           // SCENARIO 1: On a single post page, showing tags for THAT post
          <>
            <h4 className="widget-title mb-3">Etiquetas del Artículo</h4>
            <ul className="list-unstyled tag-list">
              {currentPostTags.map((tag: string) => (
                <li key={tag}>
                  <Link 
                    href={`/blog/tags/${slugify(tag)}`}
                    className={`btn btn-soft-ash btn-sm rounded-pill ${currentTag === tag ? 'active' : ''}`}
                  >
                    {tag}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-3">
              <Link href="/blog/tags" className="hover-underline text-primary">Ver todas las etiquetas <span className="ms-2">→</span></Link>
            </div>
          </>
        ) : popularTags && popularTags.length > 0 ? (
          // SCENARIO 2: Use popularTags. These are TagWithCount[]
          <>
            <h4 className="widget-title mb-3">Etiquetas Populares</h4>
            <ul className="list-unstyled tag-list">
              {popularTags.map((tagItem) => ( // Iterate over TagWithCount objects
                <li key={tagItem.name}>
                  <Link 
                    href={`/blog/tags/${slugify(tagItem.name)}`}
                    // Highlight if currentTag matches tagItem.name
                    className={`btn btn-soft-ash btn-sm rounded-pill ${currentTag === tagItem.name ? 'active' : ''}`}
                  >
                    {tagItem.name} {/** Optionally: {tagItem.name} ({tagItem.count}) */}
                  </Link>
                </li>
              ))}
            </ul>
            {/* Link to all tags page might still be relevant if popularTags is a limited list */}
            {/* We can check if the number of popularTags returned is equal to the limit requested from getPopularTags */}
            {/* For now, assume if there are popular tags, there might be more: */}
            <div className="mt-3">
                 <Link href="/blog/tags" className="hover-underline text-primary">Ver todas las etiquetas <span className="ms-2">→</span></Link>
            </div>
          </>
        ) : (
          // Fallback if no tags are available at all
          <p className="text-muted">No hay etiquetas disponibles.</p>
        )}
      </div>

      {/* Archive Widget (Still uses static data from import) */}
      {/* 
      <div className="widget">
        <h4 className="widget-title mb-3">Archivo</h4>
        <ul className="unordered-list bullet-primary text-reset">
          {data.archieve.map(({ id, title, url }) => (
            <li key={id}>
              <NextLink title={title} href={url} />
            </li>
          ))}
        </ul>
      </div>
      */}
    </Fragment>
  );
}
