export default function BlogHero() {
  return (
    <section className="wrapper bg-soft-primary">
      <div className="container pt-10 pt-md-14 text-center">
        <div className="row gx-lg-8 gx-xl-12 gy-10 gy-xl-0 mb-14 align-items-center">
          <div className="col-lg-7 order-lg-2 mb-n20">
            <figure>
              <img
                alt="Ilustración para el blog de Via Láctea sobre lactancia y sueño infantil"
                className="img-auto"
                src="/img/via-lactea/illustrations/blog-hero.png"
                srcSet="/img/via-lactea/illustrations/blog-hero.png"
              />
            </figure>
          </div>
          <div className="col-md-10 offset-md-1 offset-lg-0 col-lg-5 text-center text-lg-start">
            <h1 className="display-1 fs-48 mb-5 mx-md-n5 mx-lg-0 mt-7">
              Blog sobre <br className="d-md-none" />
              <span className="text-primary">Lactancia y Sueño Infantil</span>
            </h1>
            <p className="lead fs-lg mb-7">
              Encuentra artículos, guías y consejos prácticos sobre lactancia, sueño infantil y desarrollo para acompañarte en la crianza.
            </p>
          </div>
        </div>
      </div>
      <div className="overflow-hidden">
        <div className="divider text-light mx-n2">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 100">
            <path
              fill="currentColor"
              d="M1260,1.65c-60-5.07-119.82,2.47-179.83,10.13s-120,11.48-180,9.57-120-7.66-180-6.42c-60,1.63-120,11.21-180,16a1129.52,1129.52,0,0,1-180,0c-60-4.78-120-14.36-180-19.14S60,7,30,7H0v93H1440V30.89C1380.07,23.2,1319.93,6.15,1260,1.65Z"
            />
          </svg>
        </div>
      </div>
    </section>
  );
} 