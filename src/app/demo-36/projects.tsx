"use client";

import Link from "next/link";
// GLOBAL CUSTOM HOOKS
import useIsotope from "hooks/useIsotope";
// CUSTOM DATA
import { filterList, innerPages } from "data/demo-34";

export default function Projects() {
  // used for demo filtering and masonry layout
  const { filterKey, handleFilterKeyChange } = useIsotope();

  return (
    <div className="grid grid-view projects-masonry">
      <div className="isotope-filter filter mb-10 text-start text-md-center">
        <p>Filter:</p>
        <ul>
          {filterList.map(({ id, title, value }) => (
            <li key={id}>
              <a
                onClick={handleFilterKeyChange(value)}
                className={filterKey === value ? "filter-item active" : "filter-item"}>
                {title}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div data-cue="fadeIn">
        <div className="row gx-md-8 gx-xl-9 gy-8 gy-xl-9 isotope">
          {innerPages.map(({ category, id, image, title }) => (
            <div className={`project item col-md-6 col-xl-4 ${category}`} key={id}>
              <figure className="itooltip itooltip-primary rounded shadow-lg" title={title}>
                <Link href="#">
                  <img src={`/img/demos/${image}.jpg`} srcSet={`/img/demos/${image}@2x.jpg 2x`} alt="" />
                </Link>
              </figure>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
