-- Run this once in Supabase SQL Editor if creating a project fails with:
-- duplicate key value violates unique constraint "projects_pkey"
-- Key (id)=(1) already exists.

select setval(
  pg_get_serial_sequence('public.projects', 'id'),
  (select coalesce(max(id), 0) from public.projects) + 1,
  false
);

select setval(
  pg_get_serial_sequence('public.project_images', 'id'),
  (select coalesce(max(id), 0) from public.project_images) + 1,
  false
);
