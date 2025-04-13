import MasonryGrid from "components/MasonryGrid";

// CUSTOM DATA
const testimonials = [
  {
    id: 1,
    image: "te1",
    name: "Coriss Ambady",
    designation: "Financial Analyst",
    review: `Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor. Vestibulum id ligula porta felis euismod semper. Cras justo odio dapibus facilisis sociis natoque penatibus.`
  },
  {
    id: 2,
    image: "te2",
    name: "Cory Zamora",
    designation: "Marketing Specialist",
    review: `Fusce dapibus, tellus ac cursus tortor mauris condimentum fermentum massa justo sit amet. Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor. Cras mattis consectetur purus sit amet fermentum. Aenean lacinia bibendum nulla sed consectetur.`
  },
  {
    id: 3,
    image: "te3",
    name: "Nikolas Brooten",
    designation: "Sales Manager",
    review: `Curabitur blandit tempus porttitor. Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor. Nullam quis risus eget porta ac consectetur vestibulum. Donec sed odio dui consectetur adipiscing elit.`
  },
  {
    id: 4,
    image: "te4",
    name: "Coriss Ambady",
    designation: "Financial Analyst",
    review: `Etiam adipiscing tincidunt elit convallis felis suscipit ut. Phasellus rhoncus tincidunt auctor. Nullam eu sagittis mauris. Donec non dolor ac elit aliquam tincidunt at at sapien. Aenean tortor libero condimentum ac laoreet vitae.`
  },
  {
    id: 5,
    image: "te5",
    name: "Laura Widerski",
    designation: "Sales Specialist",
    review: `Donec id elit non mi porta gravida at eget metus. Nulla vitae elit libero, a pharetra augue. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.`
  },
  {
    id: 6,
    image: "te6",
    name: "Jackie Sanders",
    designation: "Investment Planner",
    review: `Maecenas sed diam eget risus varius blandit sit amet non magna. Cum sociis natoque penatibus magnis dis montes, nascetur ridiculus mus. Donec sed odio dui. Nulla vitae elit libero a pharetra.`
  }
];

export default function Testimonial28() {
  return (
    <section className="wrapper bg-gray">
      <div className="container py-14 py-md-17">
        <div className="row mt-md-n25">
          <div className="col-lg-9 col-xxl-8 mx-auto text-center">
            <h2 className="fs-16 text-uppercase text-muted mb-3">Happy Customers</h2>
            <h3 className="display-2 ls-xs mb-10 px-xl-10">
              Don't take our word for it. See what <span className="underline-3 style-2 yellow">customers</span> are
              saying about us.
            </h3>
          </div>
        </div>

        <div className="grid">
          <MasonryGrid className="row isotope gy-6">
            {testimonials.map(({ designation, name, id, review, image }) => (
              <div className="item col-md-6 col-xl-4" key={id}>
                <div className="card">
                  <div className="card-body">
                    <span className="ratings five mb-3" />
                    <blockquote className="icon mb-0">
                      <p>“{review}”</p>
                      <div className="blockquote-details">
                        <img
                          className="rounded-circle w-12"
                          src={`/img/avatars/${image}.jpg`}
                          srcSet={`/img/avatars/${image}@2x.jpg 2x`}
                          alt=""
                        />
                        <div className="info">
                          <h5 className="mb-1">{name}</h5>
                          <p className="mb-0">{designation}</p>
                        </div>
                      </div>
                    </blockquote>
                  </div>
                </div>
              </div>
            ))}
          </MasonryGrid>
        </div>
      </div>
    </section>
  );
}
