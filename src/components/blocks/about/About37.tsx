export default function About37() {
  return (
    <div className="row gx-0 gy-10 gy-md-13 gy-lg-0 mb-16 mb-md-18 align-items-center">
      <div className="col-lg-6 order-lg-2 ms-auto position-relative">
        <div className="p-9 ps-0 p-xxl-11 ps-xxl-0">
          <div
            className="shape bg-gray position-absolute d-block"
            style={{ top: "0", left: "0", width: "89%", height: "100%", zIndex: 0 }}
          />

          <figure className="position-relative">
            <img src="/img/photos/about35.jpg" srcSet="/img/photos/about35@2x.jpg 2x" alt="" />
          </figure>

          <div className="div position-absolute d-none d-md-block" style={{ bottom: "15%", left: "-7%", zIndex: 2 }}>
            <figure className="shadow-lg rounded">
              <img src="/img/photos/stat3.jpg" srcSet="/img/photos/stat3@2x.jpg 2x" alt="" />
            </figure>
          </div>
        </div>
      </div>

      <div className="col-lg-5">
        <h2 className="fs-16 text-uppercase text-primary mb-3">Why Choose Us?</h2>
        <h2 className="display-2 mb-7">We bring solutions to manage your finance the way works best.</h2>

        <div className="accordion accordion-wrapper" id="accordionExample">
          <div className="card plain accordion-item">
            <div className="card-header" id="headingOne">
              <button
                className="accordion-button"
                data-bs-toggle="collapse"
                data-bs-target="#collapseOne"
                aria-expanded="true"
                aria-controls="collapseOne">
                Scheduled Transactions
              </button>
            </div>

            <div
              id="collapseOne"
              className="accordion-collapse collapse show"
              aria-labelledby="headingOne"
              data-bs-parent="#accordionExample">
              <div className="card-body">
                <p>
                  Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit
                  amet risus. Cras mattis consectetur purus sit amet fermentum. Praesent commodo cursus magna, vel.
                </p>
              </div>
            </div>
          </div>

          <div className="card plain accordion-item">
            <div className="card-header" id="headingTwo">
              <button
                className="collapsed"
                data-bs-toggle="collapse"
                data-bs-target="#collapseTwo"
                aria-expanded="false"
                aria-controls="collapseTwo">
                Database Management
              </button>
            </div>

            <div
              id="collapseTwo"
              className="accordion-collapse collapse"
              aria-labelledby="headingTwo"
              data-bs-parent="#accordionExample">
              <div className="card-body">
                <p>
                  Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit
                  amet risus. Cras mattis consectetur purus sit amet fermentum. Praesent commodo cursus magna, vel.
                </p>
              </div>
            </div>
          </div>

          <div className="card plain accordion-item">
            <div className="card-header" id="headingThree">
              <button
                className="collapsed"
                data-bs-toggle="collapse"
                data-bs-target="#collapseThree"
                aria-expanded="false"
                aria-controls="collapseThree">
                Sync Between Devices
              </button>
            </div>

            <div
              id="collapseThree"
              className="accordion-collapse collapse"
              aria-labelledby="headingThree"
              data-bs-parent="#accordionExample">
              <div className="card-body">
                <p>
                  Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit
                  amet risus. Cras mattis consectetur purus sit amet fermentum. Praesent commodo cursus magna, vel.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
