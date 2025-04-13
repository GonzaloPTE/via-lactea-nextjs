import { Fragment } from "react";
import Carousel from "components/reuseable/Carousel";

export default function Testimonial29() {
  return (
    <div className="card bg-gray rounded-0 mb-16 mb-md-18">
      <div className="card-body py-14 px-lg-0">
        <div className="row text-center">
          <div className="col-lg-9 col-xl-8 mx-auto">
            <h2 className="fs-16 text-uppercase text-primary mb-3">Happy Customers</h2>
            <h3 className="display-2 mb-10 px-xxl-10">
              Don't take our word for it. See what customers are saying about us.
            </h3>
          </div>
        </div>

        <div className="row gx-lg-8 gx-xl-12 align-items-center">
          <div className="col-lg-5 ms-auto col-xl-4 d-none d-lg-flex">
            <div className="img-mask mask-3">
              <img src="/img/photos/about36.jpg" srcSet="/img/photos/about36@2x.jpg 2x" alt="Customer" />
            </div>
          </div>

          <div className="col-lg-6 col-xl-6 col-xxl-5 me-auto">
            <div className="swiper-container dots-start dots-closer mb-6" data-margin="30" data-dots="true">
              <Carousel grabCursor pagination slidesPerView={1} navigation={false}>
                {[1, 2, 3].map((item) => (
                  <Fragment key={item}>
                    <span className="ratings five mb-3" />

                    <blockquote className="border-0 fs-lg mb-0">
                      <p>
                        “Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor. Vestibulum ligula porta
                        felis euismod semper. Cras justo odio consectetur nulla dapibus curabitur blandit faucibus.”
                      </p>

                      <div className="blockquote-details">
                        <div className="info ps-0">
                          <h5 className="mb-1">Coriss Ambady</h5>
                          <p className="mb-0">Financial Analyst</p>
                        </div>
                      </div>
                    </blockquote>
                  </Fragment>
                ))}
              </Carousel>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
