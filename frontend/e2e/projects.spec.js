import { test, expect } from '@playwright/test';

test('los proyectos creados en la API aparecen en la página', async ({ page, request }) => {
  // 1. Creamos un proyecto directamente en la API
  const created = await request.post('/api/projects', {
    data: {
      title: 'Proyecto E2E',
      description: 'Proyecto creado desde un test de extremo a extremo',
      tech: ['Playwright', 'React'],
      category: 'web',
    },
  });
  expect(created.ok()).toBeTruthy();
  const project = await created.json();

  try {
    // 2. El frontend lo muestra
    await page.goto('/proyectos');
    await expect(page.getByTestId('projects-list')).toBeVisible();
    await expect(
      page.getByTestId('project-card').filter({ hasText: 'Proyecto E2E' })
    ).toBeVisible();
  } finally {
    // 3. Limpieza para no ensuciar la base de datos
    await request.delete(`/api/projects/${project._id}`);
  }
});

test('la página de proyectos funciona sin datos (estado vacío)', async ({ page, request }) => {
  // Aseguramos que no quede ningún proyecto en la API
  const res = await request.get('/api/projects');
  const projects = await res.json();
  for (const p of projects) {
    await request.delete(`/api/projects/${p._id}`);
  }

  await page.goto('/proyectos');
  await expect(page.getByTestId('projects-empty')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Proyectos' })).toBeVisible();
});
