import { Link, NavLink } from 'react-router-dom';

const links = [
  { to: '/', label: 'Inicio' },
  { to: '/proyectos', label: 'Proyectos' },
  { to: '/sobre-mi', label: 'Sobre mí' },
  { to: '/contacto', label: 'Contacto' },
];

export default function Navbar() {
  return (
    <nav data-testid="navbar">
      <Link className="brand" to="/">
        &lt;MiPortafolio /&gt;
      </Link>
      <ul>
        {links.map((link) => (
          <li key={link.to}>
            <NavLink
              to={link.to}
              className={({ isActive }) => (isActive ? 'active' : undefined)}
              data-testid={`nav-${link.label.toLowerCase().replace('í', 'i')}`}
            >
              {link.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
