import Link from "next/link";

export default function CTA14() {
  return (
    <div className="card bg-gray rounded-0">
      <div className="card-body py-14">
        <div className="row text-center">
          <div className="col-xl-11 col-xxl-10 mx-auto">
            <h2 className="fs-16 text-uppercase text-primary mb-3">Join Our Community</h2>
            <h3 className="display-2 mb-9 px-xxl-10">
              We are <span className="underline-3 style-1 primary">trusted</span> by over 5000+ clients. Join them now
              and grow your business.
            </h3>

            <Link href="#" className="btn btn-lg btn-primary btn-icon btn-icon-end rounded">
              Get Started <i className="uil uil-arrow-up-right" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
