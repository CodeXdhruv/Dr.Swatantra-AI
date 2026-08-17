import { Hono } from 'hono';
import { Bindings } from '../types/env';

import { verifyFirebaseToken } from '../utils/auth';

const library = new Hono<{ Bindings: Bindings, Variables: { user: any } }>();

// Auth middleware
library.use('*', async (c, next) => {
  const authHeader = c.req.header('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  const token = authHeader.split('Bearer ')[1];
  const payload = await verifyFirebaseToken(token, c.env.FIREBASE_PROJECT_ID);

  if (!payload || !payload.sub) {
    return c.json({ error: 'Invalid or expired token' }, 401);
  }

  // Check if user has ADMIN role in D1 database
  const { results } = await c.env.DB.prepare('SELECT role FROM User WHERE firebaseUid = ?')
    .bind(payload.sub)
    .all();

  if (results.length === 0 || results[0].role !== 'ADMIN') {
    return c.json({ error: 'Forbidden: Admins only' }, 403);
  }

  c.set('user', payload);
  await next();
});

// POST /api/library/upload
// Uploads a file directly to Cloudflare R2 via the worker binding
library.post('/upload', async (c) => {
  try {
    const formData = await c.req.parseBody();
    const file = formData['file'];
    
    if (!(file instanceof File)) {
      return c.json({ error: 'No file provided' }, 400);
    }
    
    const fileKey = `${crypto.randomUUID()}-${file.name}`;
    
    // Upload directly using the R2 binding
    await c.env.R2.put(fileKey, await file.arrayBuffer(), {
      httpMetadata: { contentType: file.type },
    });
    
    // We will serve the file via a worker route for now
    const url = new URL(c.req.url);
    const publicUrl = `${url.protocol}//${url.host}/api/library/file/${fileKey}`;

    return c.json({
      success: true,
      fileKey,
      publicUrl
    });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

// GET /api/library/file/:fileKey
// Serves files from R2
library.get('/file/:fileKey', async (c) => {
  const fileKey = c.req.param('fileKey');
  const object = await c.env.R2.get(fileKey);
  
  if (!object) {
    return c.notFound();
  }
  
  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set('etag', object.httpEtag);
  
  return new Response(object.body, { headers });
});

// POST /api/library/content
// Saves the uploaded media metadata to D1
library.post('/content', async (c) => {
  try {
    const { title, type, coverUrl, fileUrl } = await c.req.json();
    
    if (!title || !type || !fileUrl) {
      return c.json({ error: 'Missing required fields' }, 400);
    }

    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();

    await c.env.DB.prepare(
      'INSERT INTO Content (id, title, type, coverUrl, fileUrl, createdAt) VALUES (?, ?, ?, ?, ?, ?)'
    ).bind(id, title, type, coverUrl || null, fileUrl, createdAt).run();

    return c.json({ success: true, message: 'Content added successfully', id }, 201);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

// GET /api/library/content
library.get('/content', async (c) => {
  try {
    const { results } = await c.env.DB.prepare('SELECT * FROM Content ORDER BY createdAt DESC').all();
    return c.json({ success: true, data: results });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

export default library;
