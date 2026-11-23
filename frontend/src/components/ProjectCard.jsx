import { formatTechList, formatDate } from '../utils/format';

export default function ProjectCard({ project }) {
  return (
    <article className="card" data-testid="project-card">
      <h3>{project.title}</h3>
      <p className="muted">{project.description}</p>
      <p className="tech">
        <span>{formatTechList(project.tech)}</span>
      </p>
      <small className="muted">{formatDate(project.createdAt)}</small>
      {project.url && (
        <div>
          <a href={project.url} target="_blank" rel="noreferrer" className="btn secondary">
            Ver proyecto
          </a>
        </div>
      )}
    </article>
  );
}
