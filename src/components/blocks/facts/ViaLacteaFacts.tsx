import CountUp from "components/reuseable/CountUp";
// CUSTOM DATA
import { miriamStats } from "../../../data/via-lactea-about";

export default function ViaLacteaFacts() {
  return (
    <section className="wrapper bg-soft-grape mb-50">
      <div className="container py-12 py-md-14">
        <div className="row">
          <div className="col-xl-10 mx-auto">
            <div className="row align-items-center counter-wrapper gy-6 text-center">
              {miriamStats.map(({ value, title, Icon, id }) => (
                <div className="col-md-3" key={id}>
                  <Icon className="icon-svg-lg text-grape mb-3" />
                  <h3 className="counter">
                    {typeof value === 'number' ? (
                      <CountUp end={value} />
                    ) : (
                      value
                    )}
                  </h3>
                  <p className="mb-0">{title}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 