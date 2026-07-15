import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5002;

app.use(cors());
app.use(express.json());

// Setup database paths
const DB_PATH = path.join(__dirname, 'db.json');

// Check if we are running in local monorepo or deployed standalone on Render
const localPublicDir = path.join(__dirname, '..', 'public');
const UPLOADS_DIR = fs.existsSync(localPublicDir)
  ? path.join(localPublicDir, 'uploads')
  : path.join(__dirname, 'uploads');

// Create uploads directory if it does not exist
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Serve uploaded images statically
app.use('/uploads', express.static(UPLOADS_DIR));

// Helper: Read database
const readDB = () => {
  try {
    const data = fs.readFileSync(DB_PATH, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Failed to read db.json:', err);
    return {};
  }
};

// Helper: Write database
const writeDB = (data) => {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error('Failed to write to db.json:', err);
    return false;
  }
};

// Configure Multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|svg|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Only images (jpg, png, gif, svg, webp) are allowed'));
  },
});

// --- API ROUTES ---

// 1. Get all content
app.get('/api/content', (req, res) => {
  const db = readDB();
  res.json(db);
});

// 2. Update general section content (Hero, About, Contact info)
app.post('/api/content', (req, res) => {
  const db = readDB();
  const { hero, about, contact } = req.body;

  if (hero) db.hero = { ...db.hero, ...hero };
  if (about) db.about = { ...db.about, ...about };
  if (contact) db.contact = { ...db.contact, ...contact };

  if (writeDB(db)) {
    res.json({ success: true, message: 'Content updated successfully', db });
  } else {
    res.status(500).json({ success: false, message: 'Failed to update content' });
  }
});

// 3. Upload file API
app.post('/api/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded' });
  }
  // Store path relative to root directory (public assets)
  const relativePath = `/uploads/${req.file.filename}`;
  res.json({ success: true, url: relativePath });
});

// 4. Projects: Add project
app.post('/api/projects', (req, res) => {
  const db = readDB();
  const newProject = req.body;

  if (!newProject.name || !newProject.category) {
    return res.status(400).json({ success: false, message: 'Name and category are required' });
  }

  newProject.id = 'project-' + Date.now();
  db.projects = db.projects || [];
  db.projects.push(newProject);

  if (writeDB(db)) {
    res.json({ success: true, message: 'Project added successfully', project: newProject });
  } else {
    res.status(500).json({ success: false, message: 'Failed to save project' });
  }
});

// 5. Projects: Delete project
app.delete('/api/projects/:id', (req, res) => {
  const db = readDB();
  const projectId = req.params.id;

  const originalLength = db.projects?.length || 0;
  db.projects = (db.projects || []).filter((p) => p.id !== projectId);

  if (db.projects.length === originalLength) {
    return res.status(404).json({ success: false, message: 'Project not found' });
  }

  if (writeDB(db)) {
    res.json({ success: true, message: 'Project deleted successfully' });
  } else {
    res.status(500).json({ success: false, message: 'Failed to delete project' });
  }
});

// 6. Services: Add/Update service
app.post('/api/services', (req, res) => {
  const db = readDB();
  const service = req.body;

  if (!service.name || !service.desc) {
    return res.status(400).json({ success: false, message: 'Name and description are required' });
  }

  db.services = db.services || [];

  if (service.id) {
    // Update existing
    db.services = db.services.map((s) => (s.id === service.id ? service : s));
  } else {
    // Add new
    service.id = 'service-' + Date.now();
    db.services.push(service);
  }

  if (writeDB(db)) {
    res.json({ success: true, message: 'Service saved successfully', service });
  } else {
    res.status(500).json({ success: false, message: 'Failed to save service' });
  }
});

// 7. Services: Delete service
app.delete('/api/services/:id', (req, res) => {
  const db = readDB();
  const serviceId = req.params.id;

  const originalLength = db.services?.length || 0;
  db.services = (db.services || []).filter((s) => s.id !== serviceId);

  if (db.services.length === originalLength) {
    return res.status(404).json({ success: false, message: 'Service not found' });
  }

  if (writeDB(db)) {
    res.json({ success: true, message: 'Service deleted successfully' });
  } else {
    res.status(500).json({ success: false, message: 'Failed to delete service' });
  }
});

// Admin authentication middleware
const adminAuth = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    res.setHeader('WWW-Authenticate', 'Basic realm="Admin Access"');
    return res.status(401).send('Authentication required');
  }
  const base64Credentials = authHeader.split(' ')[1] || '';
  const credentials = Buffer.from(base64Credentials, 'base64').toString('utf8');
  const [email, password] = credentials.split(':');
  if (email === 'admin@gmail.com' && password === 'admin@123') {
    return next();
  }
  res.setHeader('WWW-Authenticate', 'Basic realm="Admin Access"');
  return res.status(403).send('Invalid credentials');
};

// Hidden admin route to update any content in db.json
app.post('/admin/update', adminAuth, (req, res) => {
  const updates = req.body; // Expect an object with fields to merge
  const db = readDB();
  const newDb = { ...db, ...updates };
  if (writeDB(newDb)) {
    return res.json({ success: true, message: 'Database updated', db: newDb });
  }
  return res.status(500).json({ success: false, message: 'Failed to write database' });
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
