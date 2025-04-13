import Link from "next/link";

const services = [
  {
    id: 1,
    title: "Marketing Automation",
    image: "/img/illustrations/ni1.png",
    description: "Duis mollis gravida commodo id luctus erat porttitor ligula, eget lacinia odio sem aget elit."
  },
  {
    id: 2,
    title: "Project Management",
    image: "/img/illustrations/ni2.png",
    description: "Duis mollis gravida commodo id luctus erat porttitor ligula, eget lacinia odio sem aget elit."
  },
  {
    id: 3,
    title: "Web Analytics",
    image: "/img/illustrations/ni3.png",
    description: "Duis mollis gravida commodo id luctus erat porttitor ligula, eget lacinia odio sem aget elit."
  },
  {
    id: 4,
    title: "SEO Services",
    image: "/img/illustrations/ni4.png",
    description: "Duis mollis gravida commodo id luctus erat porttitor ligula, eget lacinia odio sem aget elit."
  },
  {
    id: 5,
    title: "Market Research",
    image: "/img/illustrations/ni5.png",
    description: "Duis mollis gravida commodo id luctus erat porttitor ligula, eget lacinia odio sem aget elit."
  },
  {
    id: 6,
    title: "Social Media Management",
    image: "/img/illustrations/ni6.png",
    description: "Duis mollis gravida commodo id luctus erat porttitor ligula, eget lacinia odio sem aget elit."
  }
];

export default function Services37() {
  return (
    <section className="bg-light">
      <div className="container py-15 py-md-17 pb-md-25">
        <div className="row d-flex align-items-start gy-10">
          <div className="col-lg-5 position-lg-sticky" style={{ top: "8rem" }}>
            <h2 className="fs-16 text-uppercase text-muted mb-3">What We Do?</h2>
            <h3 className="display-2 ls-xs mb-5">
              The service we offer is <span className="underline-3 style-2 yellow">specifically</span> designed to meet
              your needs.
            </h3>
            <p className="mb-7">
              Cras mattis consectetur purus sit amet fermentum. Donec ullamcorper nulla non metus auctor fringilla.
              Integer posuere erat a ante venenatis dapibus posuere velit aliquet.
            </p>
            <Link href="#" className="btn btn-primary">
              More Details
            </Link>
          </div>

          <div className="col-lg-6 ms-auto">
            {services.map((service) => (
              <div className="card mb-6" key={service.id}>
                <div className="card-body d-flex flex-row">
                  <div>
                    <img src={service.image} className="w-13 me-5" alt={service.title} />
                  </div>

                  <div>
                    <h3 className="fs-21 ls-xs mb-2">{service.title}</h3>
                    <p className="mb-0">{service.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
