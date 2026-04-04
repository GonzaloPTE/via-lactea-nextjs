import React from 'react';
import { RelatedArticlesProps } from '../../types/blog';
import { IBlogPost } from '../../types/blog';
import { getRelatedPosts } from '../../lib/data/blog';
import { BlogCard3 } from './blog-cards'; // Assuming BlogCard3 is in this path
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import DUMMY_IMAGE_POOL from '../../lib/blog-image-pool';

const RelatedArticles: React.FC<RelatedArticlesProps> = async ({ currentPostId, category, tags }) => {
  const relatedPosts: IBlogPost[] = await getRelatedPosts(currentPostId, category, 3);

  if (!relatedPosts || relatedPosts.length === 0) {
    return null; // Don't render the section if no related articles found
  }

  return (
    <section className="wrapper related-articles-section pt-0 pb-12 pt-md-0 pb-md-16">
      <div className="container">
        <h3 className="mb-6 text-center">También te puede interesar...</h3>
        <div className="row gy-4 justify-content-center">
          {relatedPosts.map((post) => {
             // Map IBlogPost to BlogCard3 props
             const image = DUMMY_IMAGE_POOL[post.id % DUMMY_IMAGE_POOL.length];
             const cardProps = {
               id: post.id,
               link: `/blog/${post.slug}`,
               image, // Imagen correspondiente
               title: post.title,
               category: post.category || "Consejos", 
               description: post.meta_description || '', 
               date: post.published_at 
                 ? format(new Date(post.published_at), 'dd MMM yyyy', { locale: es })
                 : format(new Date(post.created_at), 'dd MMM yyyy', { locale: es })
             };
            return (
              <div className="col-md-6 col-lg-4" key={post.id}>
                <BlogCard3 {...cardProps} disableDefaultColClass={true} />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default RelatedArticles; 