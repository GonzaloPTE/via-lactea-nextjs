import Image from 'next/image';
import Link from 'next/link';
import { BlogPostHeroProps } from '../../../types/blog';

const BlogPostHero: React.FC<BlogPostHeroProps> = ({ title, category, publishedDate, imageUrl }) => {
  return (
    <section className="wrapper bg-soft-primary">
      <div className="container pt-10 pb-19 pt-md-14 pb-md-20 text-center">
        <div className="row">
          <div className="col-md-10 col-xl-8 mx-auto">
            <div className="post-header">
              {/* Category Link */}
              {category && (
                <div className="post-category text-line">
                  <Link href="#" className="hover">{/* TODO: Update href to actual category page */}
                    {category}
                  </Link>
                </div>
              )}
              {/* Title */}
              <h1 className="display-1 mb-4">{title}</h1>
              {/* Meta Information */}
              <ul className="post-meta list-unstyled mb-5">
                <li className="post-date">
                  <i className="uil uil-calendar-alt"></i> {/* Calendar Icon */}
                  <time dateTime={publishedDate}> {publishedDate}</time>
                </li>
                <li className="post-author">
                  <i className="uil uil-user"></i> {/* User Icon */}
                  <span> Por Vía Láctea Sueño y Lactancia</span> {/* TODO: Make this a Link if Miriam has an author page */}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Image - Rendered below the text header block */}
      {imageUrl && (
        <figure className="wrapper bg-light pt-0 mb-0"> {/* Changed bg to light, removed top padding */}
          <div className="container pb-4 pb-md-8">
            <div className="row">
              <div className="col-lg-6 mx-auto mt-n18">
                 {/* Consider a class for the image wrapper if specific styling needed e.g. rounded corners on image */}
                <Image 
                  src={imageUrl} 
                  alt={title} 
                  width={1080} // Adjusted example width, can be fine-tuned
                  height={540} // Adjusted example height, maintain aspect ratio
                  layout="responsive"
                  className="rounded shadow-lg" // Added rounded corners and shadow for better presentation
                  priority // If this is LCP, consider adding priority
                />
              </div>
            </div>
          </div>
        </figure>
      )}
    </section>
  );
};

export default BlogPostHero; 