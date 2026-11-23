import { describe, test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Navbar from './Navbar';

describe('Navbar', () => {
  test('muestra el nombre del portafolio', () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );
    expect(screen.getByTestId('navbar')).toBeInTheDocument();
    expect(screen.getByText(/MiPortafolio/)).toBeInTheDocument();
  });

  test('muestra los 4 enlaces de navegación', () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );
    expect(screen.getByRole('link', { name: 'Inicio' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Proyectos' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Sobre mí' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Contacto' })).toBeInTheDocument();
  });
});
