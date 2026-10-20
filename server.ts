import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { db } from './server/db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const isProduction = process.env.NODE_ENV === 'production';

// Body parsers with support for base64 photo uploads
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Ensure uploads folder exists and serve static uploads
const UPLOADS_DIR = path.resolve(process.cwd(), 'data', 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}
app.use('/uploads', express.static(UPLOADS_DIR));

// Static assets (for generated images)
app.use('/src/assets/images', express.static(path.resolve(process.cwd(), 'src', 'assets', 'images')));

// Authentication middleware
const requireAuth = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthorized: missing or invalid token' });
    return;
  }
  const token = authHeader.substring(7);
  if (!db.validateToken(token)) {
    res.status(401).json({ error: 'Unauthorized: session expired or invalid' });
    return;
  }
  next();
};

// ---------------- PUBLIC API ----------------
app.get('/api/public-content', (_req: Request, res: Response) => {
  try {
    const data = db.getPublicContent();
    res.json(data);
  } catch (err) {
    console.error('Error fetching public content:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ---------------- AUTH API ----------------
app.post('/api/auth/login', (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const result = db.verifyLogin(email, password);
    if (!result.success) {
      res.status(401).json({ error: result.error || 'Authentication failed' });
      return;
    }
    res.json({ token: result.token, email });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Authentication error' });
  }
});

app.get('/api/auth/me', requireAuth, (_req: Request, res: Response) => {
  const adminData = db.getAdminData();
  res.json({ email: adminData.adminEmail });
});

app.post('/api/auth/logout', requireAuth, (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.substring(7);
    db.invalidateToken(token);
  }
  res.json({ success: true });
});

app.put('/api/admin/password', requireAuth, (req: Request, res: Response) => {
  const { currentPassword, newPassword } = req.body;
  const result = db.updatePassword(currentPassword, newPassword);
  if (!result.success) {
    res.status(400).json({ error: result.error });
    return;
  }
  res.json({ success: true });
});

// ---------------- ADMIN API ----------------
app.get('/api/admin/data', requireAuth, (_req: Request, res: Response) => {
  try {
    const data = db.getAdminData();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch admin data' });
  }
});

app.put('/api/admin/settings', requireAuth, (req: Request, res: Response) => {
  try {
    const updated = db.updateSettings(req.body);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

// Wishes
app.post('/api/admin/wishes', requireAuth, (req: Request, res: Response) => {
  try {
    const created = db.createWish(req.body);
    res.status(201).json(created);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create wish' });
  }
});

app.put('/api/admin/wishes/:id', requireAuth, (req: Request, res: Response) => {
  try {
    const updated = db.updateWish(req.params.id, req.body);
    if (!updated) {
      res.status(404).json({ error: 'Wish not found' });
      return;
    }
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update wish' });
  }
});

app.delete('/api/admin/wishes/:id', requireAuth, (req: Request, res: Response) => {
  try {
    const ok = db.deleteWish(req.params.id);
    if (!ok) {
      res.status(404).json({ error: 'Wish not found' });
      return;
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete wish' });
  }
});

// Memories
app.post('/api/admin/memories', requireAuth, (req: Request, res: Response) => {
  try {
    const created = db.createMemory(req.body);
    res.status(201).json(created);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create memory' });
  }
});

app.put('/api/admin/memories/:id', requireAuth, (req: Request, res: Response) => {
  try {
    const updated = db.updateMemory(req.params.id, req.body);
    if (!updated) {
      res.status(404).json({ error: 'Memory not found' });
      return;
    }
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update memory' });
  }
});

app.delete('/api/admin/memories/:id', requireAuth, (req: Request, res: Response) => {
  try {
    const ok = db.deleteMemory(req.params.id);
    if (!ok) {
      res.status(404).json({ error: 'Memory not found' });
      return;
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete memory' });
  }
});

// Upload image (accepts base64 data)
app.post('/api/admin/upload', requireAuth, (req: Request, res: Response) => {
  try {
    const { dataUrl, filename } = req.body;
    if (!dataUrl || !dataUrl.includes(';base64,')) {
      res.status(400).json({ error: 'Invalid image data. Expected base64 data URL.' });
      return;
    }

    const matches = dataUrl.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      res.status(400).json({ error: 'Malformed base64 data' });
      return;
    }

    const mimeType = matches[1];
    const base64Data = matches[2];
    const extension = mimeType.split('/')[1] || 'jpg';
    const cleanFilename = (filename ? filename.replace(/[^a-zA-Z0-9_-]/g, '') : 'photo') + `_${Date.now()}.${extension}`;
    const filePath = path.resolve(UPLOADS_DIR, cleanFilename);

    fs.writeFileSync(filePath, Buffer.from(base64Data, 'base64'));

    res.json({
      url: `/uploads/${cleanFilename}`
    });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ error: 'Failed to save image' });
  }
});

app.post('/api/admin/reset-defaults', requireAuth, (_req: Request, res: Response) => {
  try {
    const data = db.resetToDefaults();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to reset data' });
  }
});

// Setup Vite or Static Serving
async function startServer() {
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Birthday & Memories server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal server startup error:', err);
  process.exit(1);
});
