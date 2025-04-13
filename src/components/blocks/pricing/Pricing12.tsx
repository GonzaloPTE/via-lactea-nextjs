import { Fragment } from "react";

const faq = [
  {
    id: 1,
    title: "Can I cancel my subscription?",
    description: `Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Etiam porta sem malesuada magna mollis euismod maecenas.`
  },
  {
    id: 2,
    title: "Which payment methods do you accept?",
    description: `Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Etiam porta sem malesuada magna mollis euismod maecenas.`
  },
  {
    id: 3,
    title: "How can I manage my Account?",
    description: `Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Etiam porta sem malesuada magna mollis euismod maecenas.`
  },
  {
    id: 4,
    title: "Is my credit card information secure?",
    description: `Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Etiam porta sem malesuada magna mollis euismod maecenas.`
  }
];

export default function Pricing12() {
  return (
    <Fragment>
      <div className="row pt-15 pt-md-17">
        <div className="col-lg-10 col-xxl-9 mx-auto text-center">
          <h2 className="fs-16 text-uppercase text-muted mb-3">Our Pricing</h2>
          <h3 className="display-2 ls-xs mb-12 px-xl-10">
            We offer great prices, premium products and
            <span className="underline-3 style-2 yellow">quality</span> service for your business.
          </h3>
        </div>
      </div>

      <div className="row">
        <div className="col-xl-11 mx-auto">
          <div className="pricing-wrapper position-relative mb-10 mb-md-14">
            <div className="row gy-6">
              <div className="col-md-6 col-lg-4">
                <div className="pricing card">
                  <div className="card-body">
                    <div className="prices text-dark">
                      <div className="price justify-content-start">
                        <span className="price-currency">$</span>
                        <span className="price-value">9</span>
                        <span className="price-duration">mo</span>
                      </div>
                    </div>

                    <h4 className="card-title ls-xs mt-2">Basic Plan</h4>
                    <ul className="icon-list bullet-bg bullet-soft-primary mt-7 mb-8 text-start">
                      <li>
                        <i className="uil uil-check" />
                        <span>
                          <strong>1</strong> Project{" "}
                        </span>
                      </li>
                      <li>
                        <i className="uil uil-check" />
                        <span>
                          <strong>100K</strong> API Access{" "}
                        </span>
                      </li>
                      <li>
                        <i className="uil uil-check" />
                        <span>
                          <strong>100MB</strong> Storage{" "}
                        </span>
                      </li>
                      <li>
                        <i className="uil uil-check" />
                        <span>
                          {" "}
                          Weekly <strong>Reports</strong>{" "}
                        </span>
                      </li>
                      <li>
                        <i className="uil uil-check" />
                        <span>
                          {" "}
                          7/24 <strong>Support</strong>
                        </span>
                      </li>
                    </ul>
                    <a href="#" className="btn btn-primary rounded">
                      Choose Plan
                    </a>
                  </div>
                </div>
              </div>

              <div className="col-md-6 col-lg-4 popular">
                <div className="pricing card">
                  <div className="card-body">
                    <div className="prices text-dark">
                      <div className="pricejustify-content-start">
                        <span className="price-currency">$</span>
                        <span className="price-value">19</span>
                        <span className="price-duration">mo</span>
                      </div>
                    </div>

                    <h4 className="card-title ls-xs mt-2">Premium Plan</h4>
                    <ul className="icon-list bullet-bg bullet-soft-primary mt-7 mb-8 text-start">
                      <li>
                        <i className="uil uil-check" />
                        <span>
                          <strong>5</strong> Projects{" "}
                        </span>
                      </li>
                      <li>
                        <i className="uil uil-check" />
                        <span>
                          <strong>100K</strong> API Access{" "}
                        </span>
                      </li>
                      <li>
                        <i className="uil uil-check" />
                        <span>
                          <strong>200MB</strong> Storage{" "}
                        </span>
                      </li>
                      <li>
                        <i className="uil uil-check" />
                        <span>
                          {" "}
                          Weekly <strong>Reports</strong>
                        </span>
                      </li>
                      <li>
                        <i className="uil uil-check" />
                        <span>
                          {" "}
                          7/24 <strong>Support</strong>
                        </span>
                      </li>
                    </ul>
                    <a href="#" className="btn btn-primary rounded">
                      Choose Plan
                    </a>
                  </div>
                </div>
              </div>

              <div className="col-md-6 offset-md-3 col-lg-4 offset-lg-0">
                <div className="pricing card">
                  <div className="card-body">
                    <div className="prices text-dark">
                      <div className="pricejustify-content-start">
                        <span className="price-currency">$</span>
                        <span className="price-value">49</span>
                        <span className="price-duration">mo</span>
                      </div>
                    </div>

                    <h4 className="card-title ls-xs mt-2">Corporate Plan</h4>
                    <ul className="icon-list bullet-bg bullet-soft-primary mt-7 mb-8 text-start">
                      <li>
                        <i className="uil uil-check" />
                        <span>
                          <strong>20</strong> Projects{" "}
                        </span>
                      </li>
                      <li>
                        <i className="uil uil-check" />
                        <span>
                          <strong>300K</strong> API Access{" "}
                        </span>
                      </li>
                      <li>
                        <i className="uil uil-check" />
                        <span>
                          <strong>500MB</strong> Storage{" "}
                        </span>
                      </li>
                      <li>
                        <i className="uil uil-check" />
                        <span>
                          {" "}
                          Weekly <strong>Reports</strong>
                        </span>
                      </li>
                      <li>
                        <i className="uil uil-check" />
                        <span>
                          {" "}
                          7/24 <strong>Support</strong>
                        </span>
                      </li>
                    </ul>
                    <a href="#" className="btn btn-primary rounded">
                      Choose Plan
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row gx-md-8 gx-xl-12 gy-10">
            {faq.map(({ description, title, id }) => (
              <div className="col-lg-6" key={id}>
                <div className="d-flex flex-row">
                  <div>
                    <span className="icon btn btn-sm btn-circle btn-primary pe-none me-5">
                      <i className="uil uil-comment-exclamation" />
                    </span>
                  </div>

                  <div>
                    <h3 className="fs-21 ls-xs mb-1">{title}</h3>
                    <p className="mb-0">{description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Fragment>
  );
}
