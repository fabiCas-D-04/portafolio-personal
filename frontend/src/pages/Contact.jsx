import { useState } from 'react';
import { sendContact } from '../services/api';
import { isValidEmail } from '../utils/format';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ type: '', text: '' });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus({ type: '', text: '' });

    const nextErrors = {};
    if (!form.name.trim()) nextErrors.name = 'El nombre es obligatorio';
    if (!isValidEmail(form.email)) nextErrors.email = 'Introduce un email válido';
    if (form.message.trim().length < 5) nextErrors.message = 'El mensaje debe tener 5 caracteres como mínimo';

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    try {
      await sendContact(form);
      setStatus({ type: 'success', text: '¡Mensaje enviado correctamente! Gracias por escribir.' });
      setForm({ name: '', email: '', message: '' });
      setErrors({});
    } catch (err) {
      setStatus({ type: 'error', text: `No se pudo enviar: ${err.message}` });
    }
  }

  return (
    <div>
      <h2 className="section-title">Contacto</h2>
      <p className="muted">¿Tienes un proyecto en mente? Escríbeme.</p>

      <form className="contact" data-testid="contact-form" onSubmit={handleSubmit} noValidate>
        <label htmlFor="name">Nombre</label>
        <input
          id="name"
          name="name"
          data-testid="contact-name"
          value={form.name}
          onChange={handleChange}
          placeholder="Tu nombre"
        />
        {errors.name && (
          <p className="error" data-testid="contact-name-error">
            {errors.name}
          </p>
        )}

        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          data-testid="contact-email"
          value={form.email}
          onChange={handleChange}
          placeholder="tucorreo@ejemplo.com"
        />
        {errors.email && (
          <p className="error" data-testid="contact-email-error">
            {errors.email}
          </p>
        )}

        <label htmlFor="message">Mensaje</label>
        <textarea
          id="message"
          name="message"
          rows={5}
          data-testid="contact-message"
          value={form.message}
          onChange={handleChange}
          placeholder="Cuéntame qué necesitas…"
        />
        {errors.message && (
          <p className="error" data-testid="contact-message-error">
            {errors.message}
          </p>
        )}

        <button className="btn" type="submit" data-testid="contact-submit">
          Enviar mensaje
        </button>

        {status.text && (
          <p
            className={status.type === 'success' ? 'success' : 'error'}
            data-testid={status.type === 'success' ? 'contact-success' : 'contact-failure'}
          >
            {status.text}
          </p>
        )}
      </form>
    </div>
  );
}
