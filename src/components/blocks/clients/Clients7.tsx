import Carousel from "components/reuseable/Carousel";

export default function Clients7() {
  const carouselProps = {
    slideClassName: "swiper-slide px-5",
    wrapperClass: "swiper-wrapper ticker",
    speed: 5000,
    spaceBetween: 30,
    pagination: false,
    navigation: false,
    autoplay: { delay: 1 },
    breakpoints: {
      0: { slidesPerView: 2 },
      576: { slidesPerView: 2 },
      768: { slidesPerView: 3 },
      992: { slidesPerView: 5 },
      1200: { slidesPerView: 5 },
      1400: { slidesPerView: 6 }
    }
  };

  return (
    <div className="card bg-gray shadow-lg rounded-0 mb-16 mb-md-18">
      <div className="card-body px-8 p-md-12">
        <div className="swiper-container clients mb-0">
          <Carousel {...carouselProps}>
            {Array.from({ length: 10 }, (_, index) => (
              <img key={index} src={`/img/brands/c${index + 1}.png`} alt={`client ${index + 1}`} loading="lazy" />
            ))}
          </Carousel>
        </div>
      </div>
    </div>
  );
}
