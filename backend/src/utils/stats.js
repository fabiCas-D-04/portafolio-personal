/**
 * Funciones puras de estadísticas del portafolio (usadas en tests unitarios).
 */

/** Promedio de las estrellas de los proyectos, redondeado a 1 decimal. */
function averageStars(projects = []) {
  if (!Array.isArray(projects) || projects.length === 0) return 0;
  const total = projects.reduce((sum, p) => sum + (Number(p.stars) || 0), 0);
  return Math.round((total / projects.length) * 10) / 10;
}

/** Slug amigable para URLs: "Mi Proyecto 2.0" -> "mi-proyecto-2-0" */
function slugify(text = '') {
  return String(text)
    .normalize('NFD') // separa letra + acento
    .replace(/[\u0300-\u036f]/g, '') // elimina tildes
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-') // todo lo no alfanumérico se vuelve guion
    .replace(/^-+|-+$/g, ''); // quita guiones sobrantes
}

/** Las N tecnologías más usadas en el portafolio. */
function topTechnologies(projects = [], limit = 3) {
  const counts = {};
  for (const p of projects) {
    for (const t of p.tech || []) {
      counts[t] = (counts[t] || 0) + 1;
    }
  }
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit)
    .map(([tech, count]) => ({ tech, count }));
}

module.exports = { averageStars, slugify, topTechnologies };
