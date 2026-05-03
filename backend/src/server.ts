import express from 'express';
import type { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { supabase } from './supabase.js';

dotenv.config();

const app = express();
const port = parseInt(process.env.PORT || '5000', 10);
const allowedOrigins = process.env.CORS_ORIGIN?.split(',').map((origin) => origin.trim()).filter(Boolean) || '*';
const projectImagesBucket = process.env.SUPABASE_PROJECTS_BUCKET || 'project-images';

type ProjectPayload = {
  location?: unknown;
  client?: unknown;
  scope?: unknown;
};

type ImagePayload = {
  fileName?: unknown;
  contentType?: unknown;
  base64?: unknown;
  altText?: unknown;
  isCover?: unknown;
};

class HttpError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-admin-key']
}));
app.use(express.json({ limit: '12mb' }));

const parsePositiveInteger = (value: unknown, fallback: number, max = Number.MAX_SAFE_INTEGER) => {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 1) return fallback;
  return Math.min(parsed, max);
};

const normalizeProjectPayload = (body: ProjectPayload, partial = false) => {
  const payload = {
    location: typeof body.location === 'string' ? body.location.trim() : undefined,
    client: typeof body.client === 'string' ? body.client.trim() : undefined,
    scope: typeof body.scope === 'string' ? body.scope.trim() : undefined
  };

  if (!partial && (!payload.location || !payload.client || !payload.scope)) {
    throw new HttpError(400, 'location, client, and scope are required.');
  }

  if (partial && !payload.location && !payload.client && !payload.scope) {
    throw new HttpError(400, 'At least one of location, client, or scope is required.');
  }

  return Object.fromEntries(Object.entries(payload).filter(([, value]) => value !== undefined));
};

const normalizeImagePayload = (body: ImagePayload) => {
  const fileName = typeof body.fileName === 'string' ? body.fileName.trim() : '';
  const contentType = typeof body.contentType === 'string' ? body.contentType.trim() : '';
  const base64Input = typeof body.base64 === 'string' ? body.base64.trim() : '';
  const altText = typeof body.altText === 'string' ? body.altText.trim() : '';
  const isCover = Boolean(body.isCover);

  if (!fileName || !contentType || !base64Input) {
    throw new HttpError(400, 'fileName, contentType, and base64 are required.');
  }

  if (!contentType.startsWith('image/')) {
    throw new HttpError(400, 'Only image uploads are allowed.');
  }

  const base64 = base64Input.includes(',') ? base64Input.split(',').pop() || '' : base64Input;
  const buffer = Buffer.from(base64, 'base64');

  if (!buffer.length) {
    throw new HttpError(400, 'Image data is empty.');
  }

  if (buffer.length > 8 * 1024 * 1024) {
    throw new HttpError(400, 'Image must be 8 MB or smaller.');
  }

  return { fileName, contentType, buffer, altText, isCover };
};

const requireAdminKey = (req: Request, _res: Response, next: NextFunction) => {
  const adminKey = process.env.ADMIN_API_KEY;

  if (!adminKey) {
    next(new HttpError(403, 'Mutating project endpoints require ADMIN_API_KEY to be configured.'));
    return;
  }

  if (req.header('x-admin-key') !== adminKey) {
    next(new HttpError(401, 'Invalid admin key.'));
    return;
  }

  next();
};

const getProjectImages = async (projectIds: number[]) => {
  if (!projectIds.length) return new Map<number, unknown[]>();

  const { data, error } = await supabase
    .from('project_images')
    .select('*')
    .in('project_id', projectIds)
    .order('is_cover', { ascending: false })
    .order('sort_order', { ascending: true })
    .order('id', { ascending: true });

  if (error) throw error;

  const grouped = new Map<number, unknown[]>();
  for (const image of data || []) {
    const imageProjectId = Number(image.project_id);
    grouped.set(imageProjectId, [...(grouped.get(imageProjectId) || []), image]);
  }

  return grouped;
};

app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', service: 'golden-energy-backend' });
});

app.get('/api/admin/validate', requireAdminKey, (_req: Request, res: Response) => {
  res.json({ message: 'success' });
});

app.get('/api/projects', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parsePositiveInteger(req.query.page, 1);
    const limit = parsePositiveInteger(req.query.limit, 100, 200);
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    const search = typeof req.query.search === 'string' ? req.query.search.trim() : '';

    let query = supabase
      .from('projects')
      .select('*', { count: 'exact' })
      .order('id', { ascending: true })
      .range(from, to);

    if (search) {
      const safeSearch = search.replaceAll(',', ' ').replaceAll('%', '\\%').replaceAll('_', '\\_');
      query = query.or(`location.ilike.%${safeSearch}%,client.ilike.%${safeSearch}%,scope.ilike.%${safeSearch}%`);
    }

    const { data, error, count } = await query;
    if (error) throw error;

    const imagesByProject = await getProjectImages((data || []).map((project) => Number(project.id)));
    const projectsWithImages = (data || []).map((project) => ({
      ...project,
      images: imagesByProject.get(Number(project.id)) || []
    }));

    res.json({
      message: 'success',
      data: projectsWithImages,
      meta: {
        page,
        limit,
        total: count ?? 0,
        totalPages: Math.ceil((count ?? 0) / limit)
      }
    });
  } catch (err) {
    next(err);
  }
});

app.get('/api/projects/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parsePositiveInteger(req.params.id, 0);
    if (!id) throw new HttpError(400, 'Project id must be a positive integer.');

    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    if (!data) throw new HttpError(404, 'Project not found.');

    const imagesByProject = await getProjectImages([id]);

    res.json({
      message: 'success',
      data: {
        ...data,
        images: imagesByProject.get(id) || []
      }
    });
  } catch (err) {
    next(err);
  }
});

app.post('/api/projects', requireAdminKey, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = normalizeProjectPayload(req.body);
    const { data, error } = await supabase
      .from('projects')
      .insert(payload)
      .select()
      .single();

    if (error) throw error;
    res.status(201).json({ message: 'success', data: { ...data, images: [] } });
  } catch (err) {
    next(err);
  }
});

app.patch('/api/projects/:id', requireAdminKey, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parsePositiveInteger(req.params.id, 0);
    if (!id) throw new HttpError(400, 'Project id must be a positive integer.');

    const payload = normalizeProjectPayload(req.body, true);
    const { data, error } = await supabase
      .from('projects')
      .update(payload)
      .eq('id', id)
      .select()
      .maybeSingle();

    if (error) throw error;
    if (!data) throw new HttpError(404, 'Project not found.');

    res.json({ message: 'success', data });
  } catch (err) {
    next(err);
  }
});

app.delete('/api/projects/:id', requireAdminKey, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parsePositiveInteger(req.params.id, 0);
    if (!id) throw new HttpError(400, 'Project id must be a positive integer.');

    const { data: images, error: imageReadError } = await supabase
      .from('project_images')
      .select('storage_path')
      .eq('project_id', id);

    if (imageReadError) throw imageReadError;

    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);

    if (error) throw error;

    const paths = (images || []).map((image) => image.storage_path).filter(Boolean);
    if (paths.length) {
      await supabase.storage.from(projectImagesBucket).remove(paths);
    }

    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

app.post('/api/projects/:id/images', requireAdminKey, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const projectId = parsePositiveInteger(req.params.id, 0);
    if (!projectId) throw new HttpError(400, 'Project id must be a positive integer.');

    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('id')
      .eq('id', projectId)
      .maybeSingle();

    if (projectError) throw projectError;
    if (!project) throw new HttpError(404, 'Project not found.');

    const image = normalizeImagePayload(req.body);
    const extension = image.fileName.split('.').pop()?.toLowerCase().replace(/[^a-z0-9]/g, '') || 'jpg';
    const storagePath = `${projectId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${extension}`;

    const { error: uploadError } = await supabase.storage
      .from(projectImagesBucket)
      .upload(storagePath, image.buffer, {
        contentType: image.contentType,
        upsert: false
      });

    if (uploadError) throw uploadError;

    const { data: publicUrlData } = supabase.storage
      .from(projectImagesBucket)
      .getPublicUrl(storagePath);

    if (image.isCover) {
      const { error: coverResetError } = await supabase
        .from('project_images')
        .update({ is_cover: false })
        .eq('project_id', projectId);

      if (coverResetError) throw coverResetError;
    }

    const { data, error } = await supabase
      .from('project_images')
      .insert({
        project_id: projectId,
        image_url: publicUrlData.publicUrl,
        storage_path: storagePath,
        alt_text: image.altText || image.fileName,
        is_cover: image.isCover
      })
      .select()
      .single();

    if (error) throw error;
    res.status(201).json({ message: 'success', data });
  } catch (err) {
    next(err);
  }
});

app.patch('/api/project-images/:imageId/cover', requireAdminKey, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const imageId = parsePositiveInteger(req.params.imageId, 0);
    if (!imageId) throw new HttpError(400, 'Image id must be a positive integer.');

    const { data: image, error: readError } = await supabase
      .from('project_images')
      .select('*')
      .eq('id', imageId)
      .maybeSingle();

    if (readError) throw readError;
    if (!image) throw new HttpError(404, 'Image not found.');

    const { error: resetError } = await supabase
      .from('project_images')
      .update({ is_cover: false })
      .eq('project_id', image.project_id);

    if (resetError) throw resetError;

    const { data, error } = await supabase
      .from('project_images')
      .update({ is_cover: true })
      .eq('id', imageId)
      .select()
      .single();

    if (error) throw error;
    res.json({ message: 'success', data });
  } catch (err) {
    next(err);
  }
});

app.delete('/api/project-images/:imageId', requireAdminKey, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const imageId = parsePositiveInteger(req.params.imageId, 0);
    if (!imageId) throw new HttpError(400, 'Image id must be a positive integer.');

    const { data: image, error: readError } = await supabase
      .from('project_images')
      .select('*')
      .eq('id', imageId)
      .maybeSingle();

    if (readError) throw readError;
    if (!image) throw new HttpError(404, 'Image not found.');

    const { error: deleteError } = await supabase
      .from('project_images')
      .delete()
      .eq('id', imageId);

    if (deleteError) throw deleteError;

    await supabase.storage.from(projectImagesBucket).remove([image.storage_path]);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

app.use((_req: Request, _res: Response, next: NextFunction) => {
  next(new HttpError(404, 'Route not found.'));
});

app.use((err: Error | HttpError, _req: Request, res: Response, _next: NextFunction) => {
  void _next;

  const status = err instanceof HttpError ? err.status : 500;
  const message = status === 500 ? 'Internal server error.' : err.message;

  if (status === 500) {
    console.error(err);
  }

  res.status(status).json({ error: message });
});

const host = '0.0.0.0';
app.listen(port, host, () => {
  console.log(`Server is running at http://${host}:${port}`);
});
