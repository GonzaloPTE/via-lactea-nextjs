import dayjs from "dayjs";
import Link from "next/link";
import { Fragment } from "react";
// GLOBAL CUSTOM COMPONENTS
import FigureImage from "./FigureImage";
import NextLink from "components/reuseable/links/NextLink";
import SocialLinks from "components/reuseable/SocialLinks";
// CUSTOM DATA
import data from "data/blog-sidebar";

// ========================================================
type BlogSidebarProps = { thumbnail?: string };
// ========================================================

export default function BlogSidebar({ thumbnail }: BlogSidebarProps) {
  return (
    <Fragment>
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

      {/* ========== popular posts section ========== */}
      <div className="widget">
        <h4 className="widget-title mb-3">Artículos Populares</h4>

        <ul className="image-list">
          {data.popularPosts.map(({ id, title, image, comment, date }) => (
            <li key={id}>
              <NextLink title={<FigureImage width={100} height={100} className="rounded" src={image} />} href="#" />

              <div className="post-content">
                <h6 className="mb-2">
                  <NextLink className="link-dark" title={title} href="#" />
                </h6>

                <ul className="post-meta">
                  <li className="post-date">
                    <i className="uil uil-calendar-alt" />
                    <span>{dayjs(date).format("DD MMM YYYY")}</span>
                  </li>
                </ul>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* ========== categories section ========== */}
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

      {/* ========== tags section ========== */}
      <div className="widget">
        <h4 className="widget-title mb-3">Etiquetas</h4>

        <ul className="list-unstyled tag-list">
          {data.tags.map(({ id, title, url }) => (
            <li key={id}>
              <NextLink title={title} href={url} className="btn btn-soft-ash btn-sm rounded-pill" />
            </li>
          ))}
        </ul>
      </div>

      {/* ========== archieve section ========== */}
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
