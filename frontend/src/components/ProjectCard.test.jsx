import { describe, test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ProjectCard from './ProjectCard';

const project = {
  _id: '1',
  title: 'Tienda online',
  description: 'E-commerce con carrito y pagos',
  tech: ['React', 'Express', 'MongoDB'],
  createdAt: '2026-02-10T12:00:00.000Z',
};

describe('ProjectCard', () => {
  test('muestra título y descripción', () => {
    render(<ProjectCard project={project} />);
    expect(screen.getByRole('heading', { name: 'Tienda online' })).toBeInTheDocument();
    expect(screen.getByText('E-commerce con carrito y pagos')).toBeInTheDocument();
  });

  test('muestra las tecnologías del proyecto', () => {
    render(<ProjectCard project={project} />);
    expect(screen.getByText('React · Express · MongoDB')).toBeInTheDocument();
  });

  test('muestra el enlace externo solo si hay URL', () => {
    render(<ProjectCard project={project} />);
    expect(screen.queryByRole('link', { name: 'Ver proyecto' })).not.toBeInTheDocument();

    render(<ProjectCard project={{ ...project, url: 'https://tienda.dev' }} />);
    expect(screen.getByRole('link', { name: 'Ver proyecto' })).toBeInTheDocument();
  });
});
