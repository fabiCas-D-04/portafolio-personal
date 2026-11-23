const { validateProject, validateContact } = require('../../src/utils/validate');

describe('validateProject (unit)', () => {
  test('acepta un proyecto válido', () => {
    const result = validateProject({
      title: 'Portafolio',
      description: 'Sitio web con React y Express',
      tech: ['React', 'Node'],
      url: 'https://ejemplo.com',
      category: 'web',
    });
    expect(result.valid).toBe(true);
    expect(result.errors).toEqual([]);
  });

  test('rechaza un proyecto sin título', () => {
    const result = validateProject({ description: 'Una descripción suficientemente larga' });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('title es obligatorio');
  });

  test('rechaza una descripción demasiado corta', () => {
    const result = validateProject({ title: 'Proyecto', description: 'corta' });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain(
      'description es obligatoria y debe tener al menos 10 caracteres'
    );
  });

  test('rechaza una URL que no sea http/https', () => {
    const result = validateProject({
      title: 'Proyecto',
      description: 'Descripción válida del proyecto',
      url: 'ftp://malformada',
    });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('url debe ser una URL válida (http/https)');
  });
});

describe('validateContact (unit)', () => {
  test('acepta un mensaje de contacto válido', () => {
    const result = validateContact({
      name: 'Rafa',
      email: 'rafa@ejemplo.com',
      message: 'Hola, me interesa tu proyecto',
    });
    expect(result.valid).toBe(true);
  });

  test('rechaza un email inválido', () => {
    const result = validateContact({ name: 'Rafa', email: 'no-es-email', message: 'Hola' });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('email debe ser un correo válido');
  });
});
