import CountUp from "components/reuseable/CountUp";
import CloudGroup from "icons/solid-duo/CloudGroup";
import React from "react";

export default function Hero35() {
  return (
    <div className="row gx-0 gy-10 gy-md-13 gy-lg-0 mb-16 mb-md-18 align-items-center">
      <div className="col-lg-6 ms-auto position-relative order-lg-2">
        <div className="p-9 ps-0 p-xxl-11 ps-xxl-0">
          <div
            className="shape bg-gray position-absolute d-block"
            style={{ top: "0", right: "0", width: "89%", height: "100%", zIndex: 0 }}
          />

          <figure className="position-relative">
            <img src="/img/photos/about34.jpg" srcSet="/img/photos/about34@2x.jpg 2x" alt="" />
          </figure>

          <div
            className="card shadow-lg position-absolute d-none d-md-block"
            style={{ bottom: "20%", left: "-8%", zIndex: 2 }}>
            <div className="card-body py-4 px-5">
              <div className="d-flex flex-row align-items-center">
                <div>
                  <CloudGroup className="icon-svg-sm solid-mono text-primary me-3" />
                </div>

                <div>
                  <h3 className="counter fs-23 mb-0 text-nowrap">
                    <CountUp end={25000} suffix="+" />
                  </h3>
                  <p className="fs-15 lh-sm mb-0 text-nowrap">Happy Clients</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="col-lg-5">
        <h2 className="fs-16 text-uppercase text-primary mb-3">We Are Sandbox</h2>
        <h1 className="display-1 fs-58 mb-5">
          Create a <span className="underline-3 style-1 primary">strategy</span> via next generation banking model.
        </h1>
        <p className="lead fs-25 lh-sm mb-6 pe-md-10">
          We consider our solutions to support each and every stage of your growth.
        </p>
        <div className="row gy-3 gx-xl-8 mb-9">
          <div className="col-xl-6">
            <ul className="icon-list bullet-bg bullet-soft-primary mb-0">
              <li>
                <span>
                  <i className="uil uil-check" />
                </span>
                <span>Secured Transactions</span>
              </li>

              <li className="mt-3">
                <span>
                  <i className="uil uil-check" />
                </span>
                <span>Track Your Spending</span>
              </li>
            </ul>
          </div>

          <div className="col-xl-6">
            <ul className="icon-list bullet-bg bullet-soft-primary mb-0">
              <li>
                <span>
                  <i className="uil uil-check" />
                </span>
                <span>Multiple Currencies</span>
              </li>

              <li className="mt-3">
                <span>
                  <i className="uil uil-check" />
                </span>
                <span>Sync Between Devices</span>
              </li>
            </ul>
          </div>
        </div>

        <a href="#" className="btn btn-lg btn-primary btn-icon btn-icon-end rounded">
          Explore Now <i className="uil uil-arrow-up-right" />
        </a>
      </div>
    </div>
  );
}
