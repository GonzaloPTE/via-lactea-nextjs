import Link from "next/link";
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { IBlogPost } from "../../types/blog"; // Ajusta la ruta según tu estructura
import DUMMY_IMAGE_POOL from "../../lib/blog-image-pool"; // Ajusta la ruta
import { BlogCard3 } from "./blog-cards"; // Asume que BlogCard3 está en un subdirectorio blog-cards
import PaginationClientWrapper from "./PaginationClientWrapper";

interface BlogPostListProps {
  posts: IBlogPost[];
  totalPages: number;
  currentPage: number;
  emptyListMessage?: string;
  emptyListLink?: {
    href: string;
    text: string;
  };
  basePath?: string; // Para construir el enlace del BlogCard3, ej. "/blog"
}

export default function BlogPostList({
  posts,
  totalPages,
  currentPage,
  emptyListMessage = "No hay artículos disponibles por el momento.",
  emptyListLink,
  basePath = "/blog" // Por defecto, los posts individuales están en /blog/[slug]
}: BlogPostListProps) {
  if (!posts || posts.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="lead">{emptyListMessage}</p>
        {emptyListLink && (
          <Link href={emptyListLink.href} className="btn btn-primary rounded-pill mt-3">
            {emptyListLink.text}
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className="position-relative">
      <div className="blog grid grid-view">
        <div className="row isotope gx-md-8 gy-8 mb-8">
          {posts.map((item) => {
            const image = DUMMY_IMAGE_POOL[item.id % DUMMY_IMAGE_POOL.length];
            // Asegúrate de que item.category sea string o proporciona un valor por defecto
            const categoryDisplay = typeof item.category === 'string' ? item.category : "General";

            const cardProps = {
              id: item.id,
              link: `${basePath}/${item.slug}`,
              image,
              title: item.title,
              category: categoryDisplay,
              description: item.meta_description || '',
              date: item.published_at
                ? format(new Date(item.published_at), 'dd MMM yyyy', { locale: es })
                : format(new Date(item.created_at), 'dd MMM yyyy', { locale: es })
            };
            return <BlogCard3 {...cardProps} key={item.id} />;
          })}
        </div>
      </div>
      {totalPages > 1 && (
        <PaginationClientWrapper
          className="justify-content-start"
          altStyle
          totalPages={totalPages}
          currentPage={currentPage}
        />
      )}
    </div>
  );
} 