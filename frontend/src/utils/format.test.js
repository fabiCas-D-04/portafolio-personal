import { describe, test, expect } from 'vitest';
import { formatTechList, formatDate, initials, isValidEmail } from './format';

describe('formatTechList', () => {
  test('une las tecnologías con un separador', () => {
    expect(formatTechList(['React', 'Node', 'MongoDB'])).toBe('React · Node · MongoDB');
  });

  test('devuelve un mensaje por defecto sin tecnologías', () => {
    expect(formatTechList([])).toBe('Sin tecnologías');
    expect(formatTechList()).toBe('Sin tecnologías');
  });
});

describe('formatDate', () => {
  test('formatea una fecha ISO válida', () => {
    expect(formatDate('2026-01-15T10:00:00.000Z')).toContain('2026');
  });

  test('devuelve cadena vacía con fechas inválidas', () => {
    expect(formatDate('no-es-fecha')).toBe('');
    expect(formatDate()).toBe('');
  });
});

describe('initials', () => {
  test('devuelve las iniciales del nombre', () => {
    expect(initials('Rafa Pérez')).toBe('RP');
    expect(initials('  ')).toBe('');
  });
});

describe('isValidEmail', () => {
  test('valida correos electrónicos', () => {
    expect(isValidEmail('rafa@ejemplo.com')).toBe(true);
    expect(isValidEmail('no-es-email')).toBe(false);
    expect(isValidEmail('')).toBe(false);
  });
});
