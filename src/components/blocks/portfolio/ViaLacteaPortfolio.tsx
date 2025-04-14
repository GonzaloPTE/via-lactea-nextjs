import Image from "next/image";
import Carousel from "components/reuseable/Carousel";
// CUSTOM DATA
import { viaLacteaBrands } from "data/via-lactea-brands";

export default function ViaLacteaPortfolio() {
  const carouselBreakpoints = {
    0: { slidesPerView: 1 },
    480: { slidesPerView: 2 },
    768: { slidesPerView: 3 },
    992: { slidesPerView: 4 }
  };

  return (    
    <div className="container-fluid px-md-6 mb-8 mb-md-10">
      <div className="row text-center">
        <div className="col-lg-9 col-xl-8 col-xxl-7 mx-auto">
          <h2 className="fs-16 text-uppercase text-primary mb-3">Partners Colaboradores</h2>
        </div>
      </div>
      <div className="swiper-container mb-10">
        <Carousel grabCursor breakpoints={carouselBreakpoints}>
          {viaLacteaBrands.map((item, index) => (
            <figure 
              className="d-flex align-items-center justify-content-center mx-2" 
              key={index}
              style={{ 
                height: '170px', 
                padding: '5px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <div style={{ 
                height: '160px', 
                display: 'flex', 
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%' 
              }}>
                <Image 
                  src={item} 
                  width={500} 
                  height={100} 
                  alt="colaborador" 
                  style={{ 
                    maxHeight: '90px',
                    minHeight: '80px',
                    width: 'auto',
                    objectFit: 'contain',
                    maxWidth: '100%'
                  }} 
                />
              </div>
            </figure>
          ))}
        </Carousel>
      </div>
    </div>
  );
}
