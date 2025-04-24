import { Fragment } from "react";
import clsx from "clsx";
import { ProductItem } from "../../../data/product-data";

interface ResourceDetailDescriptionProps {
  product: ProductItem;
}

export default function ResourceDetailDescription({ product }: ResourceDetailDescriptionProps) {
  const tabIds = ["descripcion", "beneficios", "detalles"];
  const tabTitles = ["Descripción", "Beneficios", "Detalles"];

  return (
    <Fragment>
      <div className="mt-12">
        <ul className="nav nav-tabs nav-tabs-basic">
          {tabIds.map((id, i) => (
            <li className="nav-item" key={id}>
              <a data-bs-toggle="tab" href={`#${id}`} className={clsx({ "nav-link": true, active: i === 0 })}>
                {tabTitles[i]}
              </a>
            </li>
          ))}
        </ul>

        <div className="tab-content mt-0 mt-md-5">
          {/* Tab de descripción */}
          <div className="tab-pane fade show active" id="descripcion">
            <div className="row gx-lg-8 gx-xl-12 gy-6 mb-12">
              <div className="col-lg-8">
                <p className="mb-5">{product.description}</p>
                
                {/* Si hay contenido completo o excerpt, mostrarlo */}
                {product.content?.find(c => c.format === product.primaryFormat)?.excerpt && (
                  <div className="mb-5">
                    <p>{product.content.find(c => c.format === product.primaryFormat)?.excerpt}</p>
                  </div>
                )}
              </div>
              
              {/* Previsualización del producto */}
              <div className="col-lg-4">
                {product.previewUrls?.find(p => p.format === product.primaryFormat) && (
                  <figure className="mb-6">
                    <img 
                      src={product.previewUrls.find(p => p.format === product.primaryFormat)?.url} 
                      alt={`Vista previa de ${product.title}`} 
                      className="img-fluid rounded shadow-lg"
                    />
                    <figcaption className="mt-2 text-center fs-sm">
                      Vista previa
                    </figcaption>
                  </figure>
                )}
              </div>
            </div>
          </div>

          {/* Tab de beneficios */}
          <div className="tab-pane fade" id="beneficios">
            <div className="row gy-8">
              {product.benefits?.map((benefit, index) => {
                const Icon = benefit.icon;
                return (
                  <div className="col-md-6" key={benefit.id || index}>
                    <div className="d-flex flex-row">
                      <div>
                        <div className="icon btn btn-circle btn-lg btn-soft-primary pe-none me-5">
                          <Icon className="uil" />
                        </div>
                      </div>
                      <div>
                        <h4 className="mb-1">{benefit.title}</h4>
                        <p className="mb-0">{benefit.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Tab de detalles */}
          <div className="tab-pane fade" id="detalles">
            <div className="row gx-lg-8 gx-xl-12 gy-6 mb-12">
              <div className="col-lg-12">
                <div className="table-responsive">
                  <table className="table table-striped">
                    <tbody>
                      {product.formatDetails?.find(fd => fd.format === product.primaryFormat) && (
                        <>
                          {product.formatDetails.find(fd => fd.format === product.primaryFormat)?.details.pageCount && (
                            <tr>
                              <td className="w-25"><strong>Número de páginas</strong></td>
                              <td>{product.formatDetails.find(fd => fd.format === product.primaryFormat)?.details.pageCount}</td>
                            </tr>
                          )}
                          {product.formatDetails.find(fd => fd.format === product.primaryFormat)?.details.fileSize && (
                            <tr>
                              <td><strong>Tamaño del archivo</strong></td>
                              <td>{product.formatDetails.find(fd => fd.format === product.primaryFormat)?.details.fileSize}</td>
                            </tr>
                          )}
                          {product.formatDetails.find(fd => fd.format === product.primaryFormat)?.details.fileFormat && (
                            <tr>
                              <td><strong>Formato</strong></td>
                              <td>{product.formatDetails.find(fd => fd.format === product.primaryFormat)?.details.fileFormat}</td>
                            </tr>
                          )}
                          {product.formatDetails.find(fd => fd.format === product.primaryFormat)?.details.duration && (
                            <tr>
                              <td><strong>Duración</strong></td>
                              <td>{product.formatDetails.find(fd => fd.format === product.primaryFormat)?.details.duration}</td>
                            </tr>
                          )}
                          {product.formatDetails.find(fd => fd.format === product.primaryFormat)?.details.lessonCount && (
                            <tr>
                              <td><strong>Número de lecciones</strong></td>
                              <td>{product.formatDetails.find(fd => fd.format === product.primaryFormat)?.details.lessonCount}</td>
                            </tr>
                          )}
                        </>
                      )}
                      <tr>
                        <td className="w-25"><strong>Fecha de publicación</strong></td>
                        <td>{new Date(product.publishDate).toLocaleDateString('es-ES', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}</td>
                      </tr>
                      {product.lastUpdated && (
                        <tr>
                          <td><strong>Última actualización</strong></td>
                          <td>{new Date(product.lastUpdated).toLocaleDateString('es-ES', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          })}</td>
                        </tr>
                      )}
                      {product.topic && (
                        <tr>
                          <td><strong>Categoría</strong></td>
                          <td>{product.topic}</td>
                        </tr>
                      )}
                      {product.tags && product.tags.length > 0 && (
                        <tr>
                          <td><strong>Etiquetas</strong></td>
                          <td>{product.tags.join(', ')}</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
} 