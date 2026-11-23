import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Projects from './Projects';

function renderPage() {
  return render(
    <MemoryRouter>
      <Projects />
    </MemoryRouter>
  );
}

describe('Projects', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  test('muestra los proyectos devueltos por la API', async () => {
    const projects = [
      { _id: '1', title: 'Proyecto A', description: 'Descripción del proyecto A', tech: ['React'] },
      { _id: '2', title: 'Proyecto B', description: 'Descripción del proyecto B', tech: ['Node'] },
    ];

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: () => Promise.resolve(projects),
      })
    );

    renderPage();

    await waitFor(() => {
      expect(screen.getByTestId('projects-list')).toBeInTheDocument();
    });
    expect(screen.getAllByTestId('project-card')).toHaveLength(2);
    expect(screen.getByRole('heading', { name: 'Proyecto A' })).toBeInTheDocument();
  });

  test('muestra el estado vacío cuando no hay proyectos', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: () => Promise.resolve([]),
      })
    );

    renderPage();

    await waitFor(() => {
      expect(screen.getByTestId('projects-empty')).toBeInTheDocument();
    });
  });

  test('muestra un error si la API falla', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        json: () => Promise.resolve({ error: 'Error interno' }),
      })
    );

    renderPage();

    await waitFor(() => {
      expect(screen.getByTestId('projects-error')).toBeInTheDocument();
    });
    expect(screen.getByTestId('projects-error')).toHaveTextContent('Error interno');
  });
});
