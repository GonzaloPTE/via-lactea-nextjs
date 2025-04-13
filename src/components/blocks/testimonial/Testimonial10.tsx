import MasonryGrid from "components/MasonryGrid";
import { TestimonialCard3 } from "components/reuseable/testimonial-cards";
// CUSTOM DATA
import { testimonialList } from "data/demo-7";

export default function Testimonial10() {
  return (
    <section className="wrapper bg-soft-primary">
      <div className="container py-14 py-md-17">
        <div className="row mt-md-n25">
          <div className="col-md-10 offset-md-1 col-lg-8 offset-lg-2 mx-auto text-center">
            <h2 className="fs-15 text-uppercase text-muted mb-3">Happy Customers</h2>
            <h3 className="display-4 mb-10 px-xl-10 px-xxl-15">
              Don't take our word for it. See what customers are saying about us.
            </h3>
          </div>
        </div>

        <div className="grid">
          <MasonryGrid className="row isotope gy-6">
            {testimonialList.map((item) => (
              <div className="item col-md-6 col-xl-4" key={item.id}>
                <TestimonialCard3 {...item} shadow />
              </div>
            ))}
          </MasonryGrid>
        </div>
      </div>
    </section>
  );
}
