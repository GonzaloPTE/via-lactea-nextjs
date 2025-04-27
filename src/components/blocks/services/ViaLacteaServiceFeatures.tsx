import { ServiceItem } from "data/service-data";
// Import all required icons from icons/lineal
import Target from 'icons/lineal/Target';
import Shield from 'icons/lineal/Shield';
import Settings from 'icons/lineal/Settings';
import CheckList from 'icons/lineal/CheckList';
import CloudComputingTwo from 'icons/lineal/CloudComputingTwo';
import ChatTwo from 'icons/lineal/ChatTwo';
import ShoppingBasket from 'icons/lineal/ShoppingBasket';
import ClockThree from 'icons/lineal/ClockThree';
import List from 'icons/lineal/List';
import Email from 'icons/lineal/Email';
import Analytics from 'icons/lineal/Analytics';
import LightBulb from 'icons/lineal/LightBulb';
import VideoEditing from 'icons/lineal/VideoEditing';
import BriefcaseTwo from 'icons/lineal/BriefcaseTwo';
import User from 'icons/lineal/User';
import Team from 'icons/lineal/Team';
import Savings from 'icons/lineal/Savings';
// Add any other icons used in service-data.ts here

// Map string identifiers to icon components
const iconMap: { [key: string]: React.FC<any> } = {
  Target,
  Shield,
  Settings,
  CheckList,
  CloudComputingTwo,
  ChatTwo,
  ShoppingBasket,
  ClockThree,
  List,
  Email,
  Analytics,
  LightBulb,
  VideoEditing,
  BriefcaseTwo,
  User,
  Team,
  Savings
  // Ensure all used icons are mapped here
};

interface ViaLacteaServiceFeaturesProps {
  service: ServiceItem;
}

export default function ViaLacteaServiceFeatures({ service }: ViaLacteaServiceFeaturesProps) {
  return (
    <section className="wrapper bg-light">
      <div className="container pt-17 pb-12">
        {/* Service features detailed */}
        <div className="row text-center">
          <div className="col-md-10 col-lg-9 col-xxl-8 mx-auto">
            <h2 className="fs-15 text-uppercase text-muted mb-3">Características del servicio</h2>
            <h3 className="display-4 mb-3">Todo lo que incluye {service.title}</h3>
            <div className="d-flex justify-content-center align-items-center mb-7">
              <div className="text-center">
                <h3 className="mb-0">
                  <span className={`display-6 text-${service.color ? service.color : 'grape'}`}>{service.duration}</span>
                </h3>
              </div>
            </div>
          </div>
        </div>

        <div className="row gx-lg-8 gx-xl-12 gy-8">
          {service.features.map((feature) => {
            const IconComponent = iconMap[feature.featureIcon]; // Look up the component using the string identifier

            if (!IconComponent) {
                console.warn(`Icon component not found for identifier: ${feature.featureIcon}`);
                return null; // Or render a default icon/placeholder
            }

            return (
              <div className="col-md-6 col-lg-4" key={feature.id}>
                <div className="d-flex flex-row">
                  <div>
                    {/* Render the looked-up component */}
                    <IconComponent className={`icon-svg-md text-${service.color || 'grape'} me-5 mt-1`} />
                  </div>

                  <div>
                    <h4 className="fs-20 ls-sm">{feature.title}</h4>
                    <p className="mb-0">{feature.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
