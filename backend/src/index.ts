import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { Bindings } from './types/env';

// Import routes
import authRoutes from './routes/auth';
import libraryRoutes from './routes/library';
import voiceRoutes from './routes/voice';
import chatRoutes from './routes/chat';
import migrateRoutes from './routes/migrate';
import adminRoutes from './routes/admin';

const app = new Hono<{ Bindings: Bindings }>();

// Middleware
app.use('*', logger());
app.use('*', cors({
  origin: '*', // Restrict this in production
  allowHeaders: ['Content-Type', 'Authorization'],
}));

// Health check
app.get('/health', (c) => c.json({ status: 'ok', service: 'atmik-ai-backend' }));
// Mount routes
app.route('/api/auth', authRoutes);
app.route('/api/library', libraryRoutes);
app.route('/api/voice-chat', voiceRoutes);
app.route('/api/chat', chatRoutes);
app.route('/api/migrate', migrateRoutes);
app.route('/api/admin', adminRoutes);

// Error handling
app.onError((err, c) => {
  console.error(err);
  return c.json({ error: 'Internal Server Error', message: err.message }, 500);
});

export default app;
