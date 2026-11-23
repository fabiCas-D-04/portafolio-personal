const { averageStars, slugify, topTechnologies } = require('../../src/utils/stats');

describe('averageStars (unit)', () => {
  test('promedia las estrellas de los proyectos', () => {
    const projects = [{ stars: 5 }, { stars: 4 }, { stars: 3 }];
    expect(averageStars(projects)).toBe(4);
  });

  test('redondea a un decimal', () => {
    const projects = [{ stars: 5 }, { stars: 4 }, { stars: 4 }];
    expect(averageStars(projects)).toBe(4.3);
  });

  test('devuelve 0 con una lista vacía', () => {
    expect(averageStars([])).toBe(0);
    expect(averageStars()).toBe(0);
  });
});

describe('slugify (unit)', () => {
  test('convierte texto en un slug válido', () => {
    expect(slugify('Mi Proyecto 2.0')).toBe('mi-proyecto-2-0');
  });

  test('elimina acentos y caracteres especiales', () => {
    expect(slugify('Añadir región (nueva)')).toBe('anadir-region-nueva');
  });
});

describe('topTechnologies (unit)', () => {
  test('ordena las tecnologías por frecuencia', () => {
    const projects = [
      { tech: ['React', 'Node'] },
      { tech: ['React', 'MongoDB'] },
      { tech: ['React'] },
    ];
    expect(topTechnologies(projects, 2)).toEqual([
      { tech: 'React', count: 3 },
      { tech: 'MongoDB', count: 1 },
    ]);
  });
});
