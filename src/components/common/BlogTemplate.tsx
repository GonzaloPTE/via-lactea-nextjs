import Image from "next/image";
import { Fragment } from "react";
// GLOBAL CUSTOM COMPONENTS
import Carousel from "components/reuseable/Carousel";
import VideoPlyr from "components/reuseable/VideoPlyr";
import Pagination from "components/reuseable/Pagination";
import { BlogCard2, BlogCard3 } from "components/reuseable/blog-cards";
// CUSTOM DATA
const blogs = [
  {
    id: 1,
    link: "#",
    category: "Coding",
    image: "/img/photos/b4.jpg",
    title: "Ligula tristique quis risus",
    description: `Mauris convallis non ligula non interdum. Gravida vulputate convallis tempus vestibulum cras imperdiet nun eu dolor. Aenean lacinia bibendum nulla sed.`,
    date: "01 Jan 2024"
  },
  {
    id: 2,
    link: "#",
    category: "Workspace",
    image: "/img/photos/b5.jpg",
    title: "Nullam id dolor elit id nibh",
    description: `Mauris convallis non ligula non interdum. Gravida vulputate convallis tempus vestibulum cras imperdiet nun eu dolor. Aenean lacinia bibendum nulla sed.`,
    date: "02 Jan 2024"
  },
  {
    id: 3,
    link: "#",
    category: "Meeting",
    image: "/img/photos/b6.jpg",
    title: "Ultricies fusce porta elit",
    description: `Mauris convallis non ligula non interdum. Gravida vulputate convallis tempus vestibulum cras imperdiet nun eu dolor. Aenean lacinia bibendum nulla sed.`,
    date: "03 Jan 2024"
  },
  {
    id: 4,
    link: "#",
    category: "Business Tips",
    image: "/img/photos/b7.jpg",
    title: "Morbi leo risus porta eget",
    description: `Mauris convallis non ligula non interdum. Gravida vulputate convallis tempus vestibulum cras imperdiet nun eu dolor. Aenean lacinia bibendum nulla sed.`,
    date: "04 Jan 2024"
  }
];

export default function BlogTemplate() {
  return (
    <Fragment>
      <div className="blog classic-view">
        <BlogCard2
          link="#"
          category="TEAMWORK"
          title="Amet Dolor Bibendum Parturient Cursus"
          description="Duis mollis, est non commodo luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit. Nullam quis risus eget urna mollis ornare vel. Nulla vitae elit libero, a pharetra augue. Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Sed posuere consectetur est at lobortis. Cras mattis consectetur purus sit amet fermentum. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh. Cras mattis consectetur purus sit amet fermentum. Sed posuere consectetur."
          cardTop={
            <figure className="card-img-top overlay overlay-1 hover-scale">
              <a className="link-dark" href="#">
                <Image alt="blog" width={960} height={600} src="/img/photos/b1.jpg" className="w-100 h-auto" />
                <span className="bg" />
              </a>

              <figcaption>
                <h5 className="from-top mb-0">Read More</h5>
              </figcaption>
            </figure>
          }
        />

        <BlogCard2
          link="#"
          category="IDEAS"
          title="Fringilla Ligula Pharetra Amet"
          description="Duis mollis, est non commodo luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit. Nullam quis risus eget urna mollis ornare vel. Nulla vitae elit libero, a pharetra augue. Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Sed posuere consectetur est at lobortis. Cras mattis consectetur purus sit amet fermentum. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh. Cras mattis consectetur purus sit amet fermentum. Sed posuere consectetur."
          cardTop={
            <div className="post-slider card-img-top">
              <div className="swiper-container dots-over">
                <Carousel grabCursor spaceBetween={5} slidesPerView={1}>
                  <Image width={960} height={600} src="/img/photos/b2.jpg" alt="" className="w-100 h-auto" />
                  <Image width={960} height={600} src="/img/photos/b3.jpg" alt="" className="w-100 h-auto" />
                </Carousel>
              </div>
            </div>
          }
        />

        <BlogCard2
          link="#"
          category="WORKSPACE"
          title="Consectetur Bibendum Sollicitudin Vulputate"
          description="Duis mollis, est non commodo luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit. Nullam quis risus eget urna mollis ornare vel. Nulla vitae elit libero, a pharetra augue. Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Sed posuere consectetur est at lobortis. Cras mattis consectetur purus sit amet fermentum. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh. Cras mattis consectetur purus sit amet fermentum. Sed posuere consectetur."
          cardTop={
            <div className="card-img-top">
              <VideoPlyr
                options={{ loadSprite: true, clickToPlay: true }}
                source={{ type: "video", sources: [{ src: "j_Y2Gwaj7Gs", provider: "youtube" }] }}
              />
            </div>
          }
        />
      </div>

      <div className="blog grid grid-view">
        <div className="row isotope gx-md-8 gy-8 mb-8">
          {blogs.map((item) => (
            <BlogCard3 {...item} key={item.id} />
          ))}
        </div>
      </div>

      {/* ========== pagination section ========== */}
      <Pagination className="justify-content-start" totalPages={1} currentPage={1} />
    </Fragment>
  );
}
