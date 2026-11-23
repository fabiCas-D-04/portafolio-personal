import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <section className="hero">
      <span className="badge">Disponible para proyectos</span>
      <h1 data-testid="hero-title">Hola, soy Rafa 👋</h1>
      <p data-testid="hero-subtitle">
        Desarrollador de software apasionado por construir aplicaciones web completas:
        interfaces con <strong>React</strong>, APIs con <strong>Node/Express</strong> y datos
        guardados en <strong>MongoDB</strong>.
      </p>
      <div>
        <Link className="btn" to="/proyectos" data-testid="cta-projects">
          Ver mis proyectos
        </Link>
        <Link className="btn secondary" to="/contacto">
          Contáctame
        </Link>
      </div>
    </section>
  );
}
