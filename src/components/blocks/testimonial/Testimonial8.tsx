import MasonryGrid from "components/MasonryGrid";
import { TestimonialCard3 } from "components/reuseable/testimonial-cards";
// CUSTOM DATA
import { testimonialList } from "data/demo-7";

export default function Testimonial8() {
  return (
    <div>
      <h2 className="display-4 text-center mb-8">Happy Customers</h2>

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
  );
}
