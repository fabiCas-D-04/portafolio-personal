import { describe, test, expect, vi, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Contact from './Contact';

function renderPage() {
  return render(
    <MemoryRouter>
      <Contact />
    </MemoryRouter>
  );
}

describe('Contact', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  test('muestra errores de validación si el formulario está vacío', async () => {
    const user = userEvent.setup();
    renderPage();

    await user.click(screen.getByTestId('contact-submit'));

    expect(await screen.findByTestId('contact-name-error')).toHaveTextContent(
      'El nombre es obligatorio'
    );
    expect(screen.getByTestId('contact-email-error')).toHaveTextContent(
      'Introduce un email válido'
    );
    expect(screen.getByTestId('contact-message-error')).toHaveTextContent(
      'El mensaje debe tener 5 caracteres como mínimo'
    );
  });

  test('rechaza un email inválido', async () => {
    const user = userEvent.setup();
    renderPage();

    await user.type(screen.getByTestId('contact-name'), 'Rafa');
    await user.type(screen.getByTestId('contact-email'), 'no-es-email');
    await user.type(screen.getByTestId('contact-message'), 'Hola, quiero hablar de un proyecto');
    await user.click(screen.getByTestId('contact-submit'));

    expect(await screen.findByTestId('contact-email-error')).toBeInTheDocument();
  });

  test('envía el formulario válido y muestra confirmación', async () => {
    const user = userEvent.setup();
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        status: 201,
        json: () => Promise.resolve({ ok: true }),
      })
    );

    renderPage();

    await user.type(screen.getByTestId('contact-name'), 'Rafa');
    await user.type(screen.getByTestId('contact-email'), 'rafa@ejemplo.com');
    await user.type(screen.getByTestId('contact-message'), '¡Me gusta tu portafolio!');
    await user.click(screen.getByTestId('contact-submit'));

    expect(await screen.findByTestId('contact-success')).toHaveTextContent(
      'Mensaje enviado correctamente'
    );
    expect(fetch).toHaveBeenCalledWith(
      '/api/contact',
      expect.objectContaining({ method: 'POST' })
    );
  });
});
