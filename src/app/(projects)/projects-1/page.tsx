import { Fragment } from "react";
// GLOBAL CUSTOM COMPONENTS
import Tooltip from "components/Tooltip";
import Navbar from "components/blocks/navbar/navbar-1";
import { Footer8 } from "components/blocks/footer";
import NextLink from "components/reuseable/links/NextLink";
import { ProjectCard1 } from "components/reuseable/project-cards";
// CUSTOM DATA
import { projectList1 } from "data/project";

export default function Projects() {
  return (
    <Fragment>
      {/* USER FOR TOOLTIP FUNCTIONALITY */}
      <Tooltip />

      {/* ========== header section ========== */}
      <header className="wrapper bg-gray">
        <Navbar
          language
          navClassName="navbar navbar-expand-lg center-nav navbar-light navbar-bg-light"
          button={<NextLink title="Contact" href="#" className="btn btn-sm btn-primary rounded-pill" />}
        />
      </header>

      <main className="content-wrapper">
        {/* ========== title section ========== */}
        <section className="section-frame overflow-hidden">
          <div className="wrapper bg-gray">
            <div className="container py-13 py-md-17 text-center">
              <div className="row">
                <div className="col-lg-10 col-xxl-8 mx-auto">
                  <h1 className="display-1 mb-1">Check out some of our awesome projects with creative ideas.</h1>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========== projects section ========== */}
        <section className="wrapper bg-light">
          <div className="container py-14 py-md-16">
            <div className="row mt-6">
              <div className="col-xl-10 mx-auto">
                <div className="projects-tiles">
                  {projectList1.map((item) => (
                    <ProjectCard1 {...item} key={item.id} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ========== footer section ========== */}
      <Footer8 />
    </Fragment>
  );
}
