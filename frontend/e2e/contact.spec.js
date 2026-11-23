import { test, expect } from '@playwright/test';

test('valida el formulario de contacto vacío', async ({ page }) => {
  await page.goto('/contacto');

  await page.getByTestId('contact-submit').click();

  await expect(page.getByTestId('contact-name-error')).toBeVisible();
  await expect(page.getByTestId('contact-email-error')).toBeVisible();
  await expect(page.getByTestId('contact-message-error')).toBeVisible();
});

test('rechaza un email inválido', async ({ page }) => {
  await page.goto('/contacto');

  await page.getByTestId('contact-name').fill('Rafa');
  await page.getByTestId('contact-email').fill('no-es-un-email');
  await page.getByTestId('contact-message').fill('Hola, me interesa tu trabajo');
  await page.getByTestId('contact-submit').click();

  await expect(page.getByTestId('contact-email-error')).toBeVisible();
  await expect(page.getByTestId('contact-success')).toHaveCount(0);
});

test('envía un mensaje de contacto válido y muestra confirmación', async ({ page }) => {
  await page.goto('/contacto');

  await page.getByTestId('contact-name').fill('Rafa');
  await page.getByTestId('contact-email').fill('rafa@ejemplo.com');
  await page.getByTestId('contact-message').fill('¡Excelente portafolio, hablemos!');
  await page.getByTestId('contact-submit').click();

  await expect(page.getByTestId('contact-success')).toBeVisible();
  await expect(page.getByTestId('contact-success')).toContainText('Mensaje enviado correctamente');

  // El formulario se limpia después del envío
  await expect(page.getByTestId('contact-name')).toHaveValue('');
});
