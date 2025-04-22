// GLOBAL CUSTOM COMPONENTS
import DropdownToggleLink from "components/reuseable/links/DropdownToggleLink";
import NextLink from "components/reuseable/links/NextLink";
// LOCAL CUSTOM COMPONENTS
// CUSTOM DATA
import { serviceCategories, serviceList } from "data/service-data";

export default function ViaLacteaNavServicesItem() {
  return (
    <li className="nav-item dropdown dropdown-mega">
      <DropdownToggleLink title="Servicios" className="nav-link dropdown-toggle" />
      <ul className="dropdown-menu mega-menu">
        <li className="mega-menu-content">
          <div className="row gx-0 gx-lg-3">
            {serviceCategories.map((category) => (
              <div className="col-lg-4" key={category.id}>
                <h6 className="dropdown-header">{category.label}</h6>
                <ul className="list-unstyled" style={{ columnGap: '1rem' }}>
                  {(() => {
                    if (category.id === 'child') {
                      return serviceList
                        .filter(s => s.category === 'child' && s.slug.startsWith('plan-'))
                        .map(srv => (
                          <li key={srv.id}>
                            <NextLink
                              href={`/servicios/${srv.slug}`}
                              title={srv.title}
                              className="dropdown-item whitespace-normal break-words"
                            />
                          </li>
                        ));
                    }
                    if (category.id === 'general') {
                      return serviceList
                        .filter(s => s.category === 'general' || ['valoracion-gratuita', 'videollamada-sos', 'semana-seguimiento'].includes(s.slug))
                        .map(srv => (
                          <li key={srv.id}>
                            <NextLink
                              href={`/servicios/${srv.slug}`}
                              title={srv.title}
                              className="dropdown-item whitespace-normal break-words"
                            />
                          </li>
                        ));
                    }
                    return serviceList
                      .filter(s => s.category === category.id)
                      .map(srv => (
                        <li key={srv.id}>
                          <NextLink
                            href={`/servicios/${srv.slug}`}
                            title={srv.title}
                            className="dropdown-item whitespace-normal break-words"
                          />
                        </li>
                      ));
                  })()}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <NextLink
              href="/servicios"
              title="Ver todos los servicios →"
              className="dropdown-header"
            />
          </div>
        </li>
      </ul>
    </li>
  );
}
