import { test, expect } from '@playwright/test';

test('la página de inicio carga y muestra el hero', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByTestId('hero-title')).toBeVisible();
  await expect(page.getByTestId('hero-subtitle')).toContainText('MongoDB');
  await expect(page.getByTestId('footer')).toBeVisible();
});

test('la navegación muestra los 4 enlaces principales', async ({ page }) => {
  await page.goto('/');

  const nav = page.getByTestId('navbar');
  await expect(nav.getByRole('link', { name: 'Inicio' })).toBeVisible();
  await expect(nav.getByRole('link', { name: 'Proyectos' })).toBeVisible();
  await expect(nav.getByRole('link', { name: 'Sobre mí' })).toBeVisible();
  await expect(nav.getByRole('link', { name: 'Contacto' })).toBeVisible();
});

test('el botón CTA lleva a la página de proyectos', async ({ page }) => {
  await page.goto('/');
  await page.getByTestId('cta-projects').click();
  await expect(page).toHaveURL(/\/proyectos$/);
  await expect(page.getByRole('heading', { name: 'Proyectos' })).toBeVisible();
});
