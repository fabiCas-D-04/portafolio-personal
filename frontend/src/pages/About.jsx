const skills = [
  'JavaScript',
  'React',
  'Node.js',
  'Express',
  'MongoDB',
  'Docker',
  'Terraform',
  'Ansible',
  'GitHub Actions',
  'Linux',
];

const experience = [
  {
    role: 'Desarrollador Full Stack (proyectos académicos)',
    period: '2024 – 2026',
    detail:
      'Aplicaciones CRUD con React y Express, despliegue contenedorizado con Docker e infraestructura como código con Terraform.',
  },
  {
    role: 'Automatización y CI/CD',
    period: '2025',
    detail:
      'Pipelines en GitHub Actions con tests automatizados, publicación de imágenes en DockerHub y configuración de servidores con Ansible.',
  },
];

export default function About() {
  return (
    <div>
      <h2 className="section-title">Sobre mí</h2>
      <p className="muted" data-testid="about-text">
        Estudiante de sistemas y desarrollador con foco en la web moderna. Me gusta que todo esté
        probado: tests unitarios, de integración y de extremo a extremo, desplegado con un pipeline
        automático.
      </p>

      <h3>Tecnologías</h3>
      <ul className="skills" data-testid="skills-list">
        {skills.map((skill) => (
          <li key={skill}>{skill}</li>
        ))}
      </ul>

      <h3>Experiencia</h3>
      {experience.map((item) => (
        <article className="card" key={item.role} style={{ marginBottom: '1rem' }}>
          <h3>{item.role}</h3>
          <small className="muted">{item.period}</small>
          <p className="muted">{item.detail}</p>
        </article>
      ))}
    </div>
  );
}
