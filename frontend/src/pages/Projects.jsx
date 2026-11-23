import { useEffect, useState } from 'react';
import { getProjects } from '../services/api';
import ProjectCard from '../components/ProjectCard';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    getProjects()
      .then((data) => {
        if (!cancelled) setProjects(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) return <p className="muted" data-testid="projects-loading">Cargando proyectos…</p>;

  if (error) {
    return (
      <div>
        <h2 className="section-title">Proyectos</h2>
        <p className="error" data-testid="projects-error">
          No se pudieron cargar los proyectos: {error}
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="section-title">Proyectos</h2>
      <p className="muted">Trabajos recientes cargados desde la API.</p>

      {projects.length === 0 ? (
        <div className="empty-state" data-testid="projects-empty">
          Aún no hay proyectos publicados. Vuelve pronto ✨
        </div>
      ) : (
        <div className="grid" data-testid="projects-list">
          {projects.map((project) => (
            <ProjectCard key={project._id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}
