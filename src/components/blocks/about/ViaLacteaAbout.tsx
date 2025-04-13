import ListColumn from "components/reuseable/ListColumn";
import Banner4 from "../banner/Banner4";
// CUSTOM DATA
import { aboutMiriamList } from "../../../data/via-lactea-about";

export default function ViaLacteaAbout() {
  return (
    <div className="row gy-10 gy-sm-13 gx-lg-3 align-items-center mb-8 mb-md-12 mb-lg-12">
      <div className="col-md-8 col-lg-6 position-relative">
        <Banner4 btnColor="primary" />
      </div>

      <div className="col-lg-5 offset-lg-1">
        <h2 className="fs-16 text-uppercase text-grape mb-3">Sobre mí</h2>
        <h3 className="display-4 mb-6">Miriam Rubio, tu acompañante en la crianza</h3>

        <p className="mb-6">
          Con más de 15 años de experiencia, soy asesora del sueño infantil respetuoso certificada 
          por el método Conecta, asesora de lactancia certificada, enfermera y madre. Mi misión es 
          acompañarte en este camino de la crianza, ayudándote a encontrar soluciones adaptadas a 
          tu familia y a las necesidades específicas de tu bebé.
        </p>

        <ListColumn rowClass="gx-xl-8" list={aboutMiriamList} bulletColor="grape" />
      </div>
    </div>
  );
} 