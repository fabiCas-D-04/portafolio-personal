import { describe, test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Home from './Home';

describe('Home', () => {
  test('muestra el título del hero', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );
    expect(screen.getByTestId('hero-title')).toHaveTextContent('Hola, soy Rafa');
  });

  test('muestra el botón para ver los proyectos', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );
    expect(screen.getByTestId('cta-projects')).toHaveAttribute('href', '/proyectos');
  });

  test('menciona el stack usado en el portafolio', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );
    expect(screen.getByTestId('hero-subtitle')).toHaveTextContent('MongoDB');
  });
});
