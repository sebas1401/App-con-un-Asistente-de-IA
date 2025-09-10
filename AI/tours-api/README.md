# Tours API (NestJS + TypeORM + JWT + CASL)

Backend de ejemplo para el laboratorio: autenticación con JWT, roles (admin/editor), permisos con guard estilo CASL y CRUD de Tours.

## Pasos rápidos
1. Copia `.env.example` a `.env` y ajusta credenciales.
2. Instala deps: `npm install`
3. Ejecuta en dev: `npm run start:dev`
4. Seed de datos (roles y admin): `npm run seed`
5. Login:
   - `admin@demo.com` / `Admin123!`
   - `editor@demo.com` / `Editor123!`

## Endpoints
- `POST /auth/register`
- `POST /auth/login`
- `GET /tours`
- `POST /tours`
- `PATCH /tours/:id`
- `DELETE /tours/:id`
