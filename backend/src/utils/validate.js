const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Valida un proyecto recibido por la API.
 * @returns {{ valid: boolean, errors: string[] }}
 */
function validateProject(data = {}) {
  const errors = [];

  if (!data.title || String(data.title).trim().length === 0) {
    errors.push('title es obligatorio');
  } else if (String(data.title).trim().length > 100) {
    errors.push('title no puede superar 100 caracteres');
  }

  if (!data.description || String(data.description).trim().length < 10) {
    errors.push('description es obligatoria y debe tener al menos 10 caracteres');
  }

  if (data.tech !== undefined && !Array.isArray(data.tech)) {
    errors.push('tech debe ser un arreglo de strings');
  }

  if (data.url && !/^https?:\/\/.+/.test(String(data.url))) {
    errors.push('url debe ser una URL válida (http/https)');
  }

  if (data.category && !['web', 'mobile', 'ia', 'juego', 'otro'].includes(data.category)) {
    errors.push('category inválida');
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Valida un mensaje de contacto.
 * @returns {{ valid: boolean, errors: string[] }}
 */
function validateContact(data = {}) {
  const errors = [];

  if (!data.name || String(data.name).trim().length === 0) {
    errors.push('name es obligatorio');
  }

  if (!data.email || !EMAIL_REGEX.test(String(data.email).trim())) {
    errors.push('email debe ser un correo válido');
  }

  if (!data.message || String(data.message).trim().length < 5) {
    errors.push('message debe tener al menos 5 caracteres');
  }

  return { valid: errors.length === 0, errors };
}

module.exports = { validateProject, validateContact, EMAIL_REGEX };
