import { test, expect } from '@playwright/test';

test('se puede navegar entre todas las páginas', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('link', { name: 'Sobre mí' }).click();
  await expect(page).toHaveURL(/\/sobre-mi$/);
  await expect(page.getByTestId('skills-list')).toBeVisible();

  await page.getByRole('link', { name: 'Contacto' }).click();
  await expect(page).toHaveURL(/\/contacto$/);
  await expect(page.getByTestId('contact-form')).toBeVisible();

  await page.getByRole('link', { name: 'Proyectos' }).click();
  await expect(page).toHaveURL(/\/proyectos$/);

  await page.getByRole('link', { name: 'Inicio' }).click();
  await expect(page.getByTestId('hero-title')).toBeVisible();
});

test('la página "Sobre mí" muestra la lista de tecnologías', async ({ page }) => {
  await page.goto('/sobre-mi');
  await expect(page.getByTestId('skills-list')).toContainText('React');
  await expect(page.getByTestId('skills-list')).toContainText('Terraform');
});
