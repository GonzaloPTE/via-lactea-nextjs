import CountUp from "components/reuseable/CountUp";

export default function Process21() {
  return (
    <section className="wrapper bg-gray position-relative min-vh-60 d-lg-flex align-items-center">
      <div
        className="col-lg-6 position-lg-absolute top-0 start-0 image-wrapper bg-image bg-cover h-100"
        style={{ backgroundImage: "url(/img/photos/about31.jpg)" }}></div>

      <div className="container">
        <div className="row gx-0">
          <div className="col-lg-6 ms-auto">
            <div className="pt-13 pb-15 pb-md-17 py-lg-16 ps-lg-15">
              <h2 className="fs-16 text-uppercase text-muted mb-3">Our Solutions</h2>
              <h3 className="display-2 ls-xs mb-5">
                We make your spending
                <span className="underline-3 style-2 yellow">stress-free</span> for you to have the perfect control.
              </h3>

              <p className="mb-6">
                Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Cras justo odio,
                dapibus ac facilisis in, egestas eget quam. Praesent commodo cursus. Maecenas sed diam eget risus varius
                blandit sit amet non magna.
              </p>

              <div className="row align-items-center counter-wrapper gy-6">
                <div className="col-md-6">
                  <h3 className="counter counter-lg mb-1">
                    <CountUp end={99.7} suffix="%" decimals={1} />
                  </h3>
                  <h5 className="ls-xs mb-1">Customer Satisfaction</h5>
                  <span className="ratings five" />
                </div>

                <div className="col-md-6">
                  <h3 className="counter counter-lg mb-1">
                    <CountUp end={4} suffix="x" />
                  </h3>
                  <h5 className="ls-xs mb-1">New Visitors</h5>
                  <span className="ratings five" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
