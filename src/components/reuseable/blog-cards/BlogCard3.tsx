import Link from "next/link";
// GLOBAL CUSTOM COMPONENTS
import NextLink from "../links/NextLink";
import FigureImage from "../../reuseable/FigureImage";

// ========================================================
interface BlogCard3Props {
  link: string;
  title: string;
  image: string;
  category: string;
  description: string;
  date: string;
}
// ========================================================

export default function BlogCard3({ title, category, description, link, image, date }: BlogCard3Props) {
  return (
    <article className="item post col-md-6">
      <div className="card">
        <figure className="card-img-top overlay overlay-1 hover-scale">
          <Link href="#">
            <FigureImage width={560} height={350} src={image} />
            <span className="bg" />
          </Link>

          <figcaption>
            <h5 className="from-top mb-0">Read More</h5>
          </figcaption>
        </figure>

        <div className="card-body">
          <div className="post-header">
            <div className="post-category text-line">
              <NextLink title={category} href="#" className="hover text-primary" />
            </div>

            <h2 className="post-title h3 mt-1 mb-3">
              <NextLink title={title} className="link-dark" href={link} />
            </h2>
          </div>

          <div className="post-content">
            <p>{description}</p>
          </div>
        </div>

        <div className="card-footer">
          <ul className="post-meta d-flex mb-0">
            <li className="post-date">
              <i className="uil uil-calendar-alt" />
              <span>{date}</span>
            </li>
            <li className="post-readmore ms-auto text-primary">
              <NextLink title="Leer más" className="text-primary link-dark" href={link} />
              <i className="uil uil-arrow-right" style={{ marginLeft: '0.25rem' }}></i>
            </li>
          </ul>
        </div>
      </div>
    </article>
  );
}
