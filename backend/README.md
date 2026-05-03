# Golden Energy Backend

Express API backed by Supabase Postgres and Supabase Storage.

## Setup

1. Copy `.env.example` to `.env` and fill in the Supabase values.
2. Set `ADMIN_API_KEY` to a long random secret. The Next.js admin dashboard uses this key.
3. In Supabase SQL Editor, run `schema.sql` once to create `public.projects` and `public.project_images`.
4. In Supabase Storage, create a **public** bucket named `project-images` or change `SUPABASE_PROJECTS_BUCKET` to your bucket name.
5. Seed the preserved 56-project dataset:

```bash
npm run migrate-supabase
```

6. Start the API:

```bash
npm run dev
```

## Public endpoints

- `GET /health`
- `GET /api/projects`
- `GET /api/projects?search=الغردقة&page=1&limit=20`
- `GET /api/projects/:id`

## Admin endpoints

These endpoints require an `x-admin-key` header matching `ADMIN_API_KEY`.

- `POST /api/projects`
- `PATCH /api/projects/:id`
- `DELETE /api/projects/:id`
- `POST /api/projects/:id/images`
- `PATCH /api/project-images/:imageId/cover`
- `DELETE /api/project-images/:imageId`

## Notes

Use `SUPABASE_SERVICE_ROLE_KEY` only inside this private backend environment. Never expose it to the Next.js frontend and never commit the real value.
