import Tooltip from "components/Tooltip";
import { ProjectCard4 } from "components/reuseable/project-cards";
// CUSTOM DATA
import { projects } from "data/demo-28";

export default function Portfolio13() {
  return (
    <div className="grid grid-view projects-masonry mt-md-n20 mt-lg-n22 mb-20">
      <div className="row g-8 g-lg-10">
        {/* USER FOR TOOLTIP FUNCTIONALITY */}
        <Tooltip />

        {projects.map((item) => (
          <div key={item.id} className="project col-md-6 col-xl-4">
            <ProjectCard4 {...item} />
          </div>
        ))}
      </div>
    </div>
  );
}
