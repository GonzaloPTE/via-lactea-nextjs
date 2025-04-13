import Lamp from "icons/solid-mono/Lamp";
import BarChart from "icons/solid/BarChart";
import Target from "icons/solid-mono/Target";
import PenTool from "icons/solid-duo/PenTool";

export default function Process22() {
  return (
    <div className="row gx-0 gy-10 gy-md-13 gy-lg-0 mb-16 mb-md-18 align-items-center">
      <div className="col-lg-6 position-relative">
        <div className="p-9 pe-0 p-xxl-11 pe-xxl-0">
          <div
            className="shape bg-gray position-absolute d-block"
            style={{ top: "0", left: "0", width: "89%", height: "100%", zIndex: 0 }}
          />

          <figure className="position-relative">
            <img src="/img/photos/about33.jpg" srcSet="/img/photos/about33@2x.jpg 2x" alt="" />
          </figure>

          <div className="card shadow-lg position-absolute d-none d-md-block" style={{ top: "15%", right: "-7%" }}>
            <div className="card-body py-4 px-5">
              <div className="d-flex flex-row align-items-center">
                <div>
                  <div className="svg-bg bg-pale-primary rounded-circle me-3">
                    <Target className="icon-svg-sm solid-mono text-primary" />
                  </div>
                </div>

                <div>
                  <h3 className="fs-25 counter mb-0 text-nowrap">900+</h3>
                  <p className="fs-16 lh-sm mb-0 text-nowrap">Projects Done</p>
                </div>
              </div>
            </div>
          </div>

          <div
            className="card shadow-lg position-absolute text-center d-none d-md-block"
            style={{ bottom: "15%", right: "-7%" }}>
            <div className="card-body p-6">
              <div
                className="progressbar semi-circle primary mb-3"
                data-value="80"
                style={{ width: "7rem", height: "4rem" }}
              />
              <h4 className="mb-0">Time Saved</h4>
            </div>
          </div>
        </div>
      </div>

      <div className="col-lg-5 ms-auto">
        <h2 className="fs-16 text-uppercase text-primary mb-3">How It Works?</h2>
        <h2 className="display-2 mb-7">Here are the 3 working steps on success.</h2>
        <div className="d-flex flex-row pe-xxl-15 mb-6">
          <div>
            <Lamp className="icon-svg-sm solid-mono text-primary me-4" />
          </div>

          <div>
            <h4 className="mb-1">Collect Ideas</h4>
            <p className="mb-0">Nulla vitae elit libero pharetra augue dapibus. Praesent commodo cursus.</p>
          </div>
        </div>

        <div className="d-flex flex-row pe-xxl-15 mb-6">
          <div>
            <BarChart className="icon-svg-sm solid-mono text-primary me-4" />
          </div>

          <div>
            <h4 className="mb-1">Data Analysis</h4>
            <p className="mb-0">Vivamus sagittis lacus vel augue laoreet. Etiam porta sem malesuada magna.</p>
          </div>
        </div>

        <div className="d-flex flex-row pe-xxl-15">
          <div>
            <PenTool className="icon-svg-sm solid-mono text-primary me-4" />
          </div>

          <div>
            <h4 className="mb-1">Finalize Product</h4>
            <p className="mb-0">Cras mattis consectetur purus sit amet. Aenean lacinia bibendum nulla sed.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
