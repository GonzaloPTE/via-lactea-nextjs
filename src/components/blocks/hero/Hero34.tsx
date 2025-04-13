import LightBox from "components/LightBox";
// CUSTOM UTILS
import { fadeInAnimate, slideInDownAnimate } from "utils/animation";

export default function Hero34() {
  return (
    <section className="wrapper bg-gray position-relative min-vh-60 d-lg-flex align-items-center">
      <div
        className="col-lg-6 position-lg-absolute top-0 start-0 image-wrapper bg-image bg-cover h-100"
        style={{ backgroundImage: "url(/img/photos/about32.jpg)" }}>
        <a
          data-glightbox=""
          href="/media/movie3.mp4"
          className="btn btn-circle btn-primary btn-play ripple mx-auto position-absolute d-lg-none"
          style={{ top: "50%", left: "50%", transform: "translate(-50%,-50%)", zIndex: 3 }}
          data-gallery="mobile-video">
          <i className="icn-caret-right"></i>
        </a>
      </div>

      <div
        data-cue="fadeIn"
        data-delay="600"
        data-show="true"
        className="container position-relative"
        style={fadeInAnimate("600ms")}>
        <a
          data-glightbox=""
          href="/media/movie3.mp4"
          className="btn btn-circle btn-primary btn-play ripple mx-auto position-absolute d-none d-lg-flex"
          style={{ top: "50%", left: "50%", transform: "translate(-50%,-50%)", zIndex: 3 }}
          data-gallery="desktop-video">
          <i className="icn-caret-right"></i>
        </a>

        {/* USED FOR IMAGE LIGHTBOX */}
        <LightBox />

        <div className="row gx-0">
          <div className="col-lg-6 offset-lg-6">
            <div
              className="py-12 py-lg-16 ps-lg-12 py-xxl-18 ps-xxl-16 pe-lg-0 position-relative"
              data-cues="slideInDown"
              data-group="page-title"
              data-disabled="true">
              <h1
                className="display-1 ls-xs fs-52 mb-4"
                data-cue="slideInDown"
                data-group="page-title"
                data-show="true"
                style={slideInDownAnimate("0ms")}>
                We bring solutions to make life <span className="underline-3 style-2 yellow">easier</span> for our
                customers.
              </h1>

              <p
                className="lead fs-25 lh-sm mb-7"
                data-cue="slideInDown"
                data-group="page-title"
                data-show="true"
                style={slideInDownAnimate("300ms")}>
                We have considered our solutions to support every stage of your growth.
              </p>

              <div data-cue="slideInDown" data-group="page-title" data-show="true" style={slideInDownAnimate("600ms")}>
                <a className="btn btn-lg btn-primary rounded mb-2">Get Started</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
