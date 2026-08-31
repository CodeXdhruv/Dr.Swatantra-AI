import { Hono } from 'hono';
import { Bindings } from '../types/env';

const auth = new Hono<{ Bindings: Bindings }>();

// POST /api/auth/sync
// Syncs a Firebase user with the Cloudflare D1 database after they log in
auth.post('/sync', async (c) => {
  try {
    const { firebaseUid, email, displayName } = await c.req.json();

    if (!firebaseUid || !email) {
      return c.json({ error: 'Missing firebaseUid or email' }, 400);
    }

    // Check if user exists in D1
    const { results } = await c.env.DB.prepare('SELECT id, role FROM User WHERE firebaseUid = ?')
      .bind(firebaseUid)
      .all();

    if (results.length === 0) {
      // User doesn't exist, create them with default USER role
      const id = crypto.randomUUID();
      const role = 'USER';

      await c.env.DB.prepare(
        'INSERT INTO User (id, firebaseUid, email, role) VALUES (?, ?, ?, ?)'
      )
      .bind(id, firebaseUid, email, role)
      .run();

      return c.json({ success: true, message: 'User created in D1', id, role }, 201);
    }

    return c.json({ success: true, message: 'User already exists', id: results[0].id, role: results[0].role }, 200);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

export default auth;
