const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../src/app');
const { connectDB, disconnectDB } = require('../../src/config/db');
const Project = require('../../src/models/Project');
const Contact = require('../../src/models/Contact');

beforeAll(async () => {
  await connectDB(); // usa MONGODB_URI o un MongoDB en memoria
});

afterAll(async () => {
  await Project.deleteMany({});
  await Contact.deleteMany({});
  await disconnectDB();
});

beforeEach(async () => {
  await Project.deleteMany({});
  await Contact.deleteMany({});
});

describe('GET /api/health', () => {
  test('responde con estado ok', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.service).toBe('portfolio-api');
  });
});

describe('GET /api/projects', () => {
  test('devuelve la lista de proyectos (vacía al inicio)', async () => {
    const res = await request(app).get('/api/projects');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body).toHaveLength(0);
  });

  test('devuelve los proyectos creados', async () => {
    await Project.create({
      title: 'Proyecto de prueba',
      description: 'Descripción de prueba para integración',
      tech: ['React'],
    });

    const res = await request(app).get('/api/projects');
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].title).toBe('Proyecto de prueba');
  });
});

describe('POST /api/projects', () => {
  test('crea un proyecto y responde 201', async () => {
    const payload = {
      title: 'Nuevo proyecto',
      description: 'Este es un proyecto creado desde un test de integración',
      tech: ['Express', 'MongoDB'],
      category: 'web',
    };

    const res = await request(app).post('/api/projects').send(payload);
    expect(res.status).toBe(201);
    expect(res.body._id).toBeDefined();
    expect(res.body.title).toBe('Nuevo proyecto');

    const saved = await Project.findById(res.body._id);
    expect(saved).not.toBeNull();
  });

  test('responde 400 si faltan campos obligatorios', async () => {
    const res = await request(app).post('/api/projects').send({ title: '' });
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Datos inválidos');
    expect(Array.isArray(res.body.details)).toBe(true);
  });
});

describe('GET /api/projects/:id', () => {
  test('devuelve 404 con un id inexistente o inválido', async () => {
    const res = await request(app).get('/api/projects/64b000000000000000000000');
    expect(res.status).toBe(404);
    expect(res.body.error).toBe('Proyecto no encontrado');
  });

  test('devuelve 404 con un id que no es un ObjectId', async () => {
    const res = await request(app).get('/api/projects/no-es-un-id');
    expect(res.status).toBe(404);
  });
});

describe('DELETE /api/projects/:id', () => {
  test('elimina un proyecto existente', async () => {
    const project = await Project.create({
      title: 'Para borrar',
      description: 'Proyecto que será eliminado en el test',
    });

    const res = await request(app).delete(`/api/projects/${project._id}`);
    expect(res.status).toBe(204);

    const found = await Project.findById(project._id);
    expect(found).toBeNull();
  });
});

describe('POST /api/contact', () => {
  test('acepta un mensaje de contacto válido', async () => {
    const res = await request(app)
      .post('/api/contact')
      .send({ name: 'Rafa', email: 'rafa@ejemplo.com', message: '¡Buen trabajo!' });

    expect(res.status).toBe(201);
    expect(res.body.ok).toBe(true);

    const saved = await Contact.findOne({ email: 'rafa@ejemplo.com' });
    expect(saved).not.toBeNull();
  });

  test('rechaza un email inválido con 400', async () => {
    const res = await request(app)
      .post('/api/contact')
      .send({ name: 'Rafa', email: 'malo', message: 'Hola' });

    expect(res.status).toBe(400);
    expect(res.body.details).toContain('email debe ser un correo válido');
  });
});

describe('Errores de la API', () => {
  test('responde 404 en rutas inexistentes', async () => {
    const res = await request(app).get('/api/ruta-que-no-existe');
    expect(res.status).toBe(404);
    expect(res.body.error).toBe('Ruta no encontrada');
  });
});
