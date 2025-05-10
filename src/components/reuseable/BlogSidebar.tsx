import dayjs from "dayjs";
import Link from "next/link";
import { Fragment } from "react";
import { slugify } from "../../lib/utils"; // Keep slugify
import DUMMY_IMAGE_POOL from "../../lib/blog-image-pool";
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { Database } from '../../types/supabase';
import { IBlogPost } from '../../types/blog';

// GLOBAL CUSTOM COMPONENTS
import FigureImage from "./FigureImage";
import NextLink from "components/reuseable/links/NextLink"; // Keep NextLink for other parts
import SocialLinks from "components/reuseable/SocialLinks";

// CUSTOM DATA
import data from "data/blog-sidebar"; // Keep using static data for other sections

// ========================================================
// Updated props to include optional tags array
type BlogSidebarProps = {
   thumbnail?: string;
   tags?: string[] | null;
};
// ========================================================

async function getRandomPopularPosts(): Promise<IBlogPost[]> {
  const cookieStore = await cookies();
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
  );
  // Obtener 10 posts y elegir 3 aleatorios en el servidor
  const { data, error } = await supabase
    .from('blog_posts')
    .select('id, title, slug, published_at, created_at')
    .order('published_at', { ascending: false })
    .limit(10);
  if (!data || error) return [];
  // Seleccionar 3 aleatorios
  const shuffled = data.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 3) as IBlogPost[];
}

// Reverted to standard functional component (not async)
export default async function BlogSidebar({ thumbnail, tags }: BlogSidebarProps) {
  const popularPosts = await getRandomPopularPosts();
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
                    <li className="post-date">
                      <i className="uil uil-calendar-alt" />
                      <span>{dayjs(date).format("DD MMM YYYY")}</span>
                    </li>
                  </ul>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Categories Widget (Still uses static data) */}
      <div className="widget">
        <h4 className="widget-title mb-3">Categorías</h4>
        <ul className="unordered-list bullet-primary text-reset">
          {data.categories.map(({ id, title, post, url }) => (
            <li key={id}>
              <NextLink title={`${title} (${post})`} href={url} />
            </li>
          ))}
        </ul>
      </div>

      {/* Tags Widget (Shows tags from current post passed via props) */}
      <div className="widget">
        <h4 className="widget-title mb-3">Etiquetas del Artículo</h4>
        {tags && tags.length > 0 ? (
          <> {/* Use Fragment to group list and link */} 
            <ul className="list-unstyled tag-list">
              {tags.map((tag) => (
                <li key={tag}>
                  <Link 
                    href={`/blog/tag/${slugify(tag)}`} 
                    className="btn btn-soft-ash btn-sm rounded-pill"
                  >
                    {tag}
                  </Link>
                </li>
              ))}
            </ul>
            {/* Link to all tags page */}
            <div className="mt-3">
              <Link href="/blog/tag" className="hover-underline text-primary">Ver todas las etiquetas <span className="ms-2">→</span></Link>
            </div>
          </>
        ) : (
          <p className="text-muted">Este artículo no tiene etiquetas.</p>
        )}
      </div>

      {/* Archive Widget (Still uses static data) */}
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
    </Fragment>
  );
}
