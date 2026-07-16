import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import connectDB from './config/db.js';
import cloudinary from './config/cloudinary.js';
import auth from './middleware/auth.js';
import Content from './models/Content.js';
import Service from './models/Service.js';
import Project from './models/Project.js';
import Admin from './models/Admin.js';

const app = express();
const PORT = process.env.PORT || 5002;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Multer — store in memory buffer (will upload to Cloudinary, not disk)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|svg|webp/;
    const extOk = allowedTypes.test(file.originalname.toLowerCase().split('.').pop());
    const mimeOk = allowedTypes.test(file.mimetype);
    if (extOk && mimeOk) {
      return cb(null, true);
    }
    cb(new Error('Only images (jpg, png, gif, svg, webp) are allowed'));
  },
});

// Helper: Upload buffer to Cloudinary
const uploadToCloudinary = (fileBuffer, folder = 'aurexa') => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'image' },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    stream.end(fileBuffer);
  });
};

// --- AUTH ROUTES ---

// Login — returns JWT token
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const admin = await Admin.findOne({ email: email.toLowerCase() });
    if (!admin) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE || '7d',
    });

    res.json({
      success: true,
      message: 'Login successful',
      token,
      admin: { id: admin._id, email: admin.email },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Verify token validity
app.get('/api/auth/verify', auth, (req, res) => {
  res.json({ success: true, message: 'Token is valid' });
});

// --- PUBLIC CONTENT ROUTES ---

// Get all content (public — used by frontend SiteContent)
app.get('/api/content', async (req, res) => {
  try {
    // Fetch content, services, and projects in parallel
    const [contentDoc, services, projects] = await Promise.all([
      Content.findOne().lean(),
      Service.find().lean(),
      Project.find().lean(),
    ]);

    // Build response in the same shape as the old db.json
    const response = {
      hero: contentDoc?.hero || {},
      about: contentDoc?.about || {},
      contact: contentDoc?.contact || {},
      services: services.map((s) => ({
        id: s._id.toString(),
        name: s.name,
        desc: s.desc,
        iconType: s.iconType,
      })),
      projects: projects.map((p) => ({
        id: p._id.toString(),
        name: p.name,
        category: p.category,
        tag: p.tag,
        type: p.type,
        image: p.image,
        liveUrl: p.liveUrl,
      })),
    };

    res.json(response);
  } catch (error) {
    console.error('Failed to fetch content:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch content' });
  }
});

// --- PROTECTED CONTENT ROUTES (require JWT) ---

// Update general section content (Hero, About, Contact)
app.post('/api/content', auth, async (req, res) => {
  try {
    const { hero, about, contact } = req.body;

    let contentDoc = await Content.findOne();
    if (!contentDoc) {
      contentDoc = new Content({});
    }

    if (hero) {
      contentDoc.hero = { ...contentDoc.hero.toObject?.() || contentDoc.hero, ...hero };
    }
    if (about) {
      contentDoc.about = { ...contentDoc.about.toObject?.() || contentDoc.about, ...about };
    }
    if (contact) {
      contentDoc.contact = { ...contentDoc.contact.toObject?.() || contentDoc.contact, ...contact };
    }

    contentDoc.markModified('hero');
    contentDoc.markModified('about');
    contentDoc.markModified('contact');
    await contentDoc.save();

    // Re-fetch full data to return
    const [savedContent, services, projects] = await Promise.all([
      Content.findOne().lean(),
      Service.find().lean(),
      Project.find().lean(),
    ]);

    const db = {
      hero: savedContent?.hero || {},
      about: savedContent?.about || {},
      contact: savedContent?.contact || {},
      services: services.map((s) => ({ id: s._id.toString(), name: s.name, desc: s.desc, iconType: s.iconType })),
      projects: projects.map((p) => ({ id: p._id.toString(), name: p.name, category: p.category, tag: p.tag, type: p.type, image: p.image, liveUrl: p.liveUrl })),
    };

    res.json({ success: true, message: 'Content updated successfully', db });
  } catch (error) {
    console.error('Failed to update content:', error);
    res.status(500).json({ success: false, message: 'Failed to update content' });
  }
});

// Upload file to Cloudinary
app.post('/api/upload', auth, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const result = await uploadToCloudinary(req.file.buffer, 'aurexa');
    res.json({ success: true, url: result.secure_url });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ success: false, message: 'Failed to upload image' });
  }
});

// --- PROJECTS ---

// Add project
app.post('/api/projects', auth, async (req, res) => {
  try {
    const { name, category, tag, type, image, liveUrl } = req.body;

    if (!name || !category) {
      return res.status(400).json({ success: false, message: 'Name and category are required' });
    }

    const project = await Project.create({ name, category, tag, type, image, liveUrl });

    res.json({
      success: true,
      message: 'Project added successfully',
      project: {
        id: project._id.toString(),
        name: project.name,
        category: project.category,
        tag: project.tag,
        type: project.type,
        image: project.image,
        liveUrl: project.liveUrl,
      },
    });
  } catch (error) {
    console.error('Failed to add project:', error);
    res.status(500).json({ success: false, message: 'Failed to save project' });
  }
});

// Delete project
app.delete('/api/projects/:id', auth, async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }
    res.json({ success: true, message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Failed to delete project:', error);
    res.status(500).json({ success: false, message: 'Failed to delete project' });
  }
});

// --- SERVICES ---

// Add or update service
app.post('/api/services', auth, async (req, res) => {
  try {
    const { id, name, desc, iconType } = req.body;

    if (!name || !desc) {
      return res.status(400).json({ success: false, message: 'Name and description are required' });
    }

    let service;
    if (id) {
      // Update existing
      service = await Service.findByIdAndUpdate(id, { name, desc, iconType }, { new: true });
      if (!service) {
        return res.status(404).json({ success: false, message: 'Service not found' });
      }
    } else {
      // Create new
      service = await Service.create({ name, desc, iconType: iconType || 'design' });
    }

    res.json({
      success: true,
      message: 'Service saved successfully',
      service: {
        id: service._id.toString(),
        name: service.name,
        desc: service.desc,
        iconType: service.iconType,
      },
    });
  } catch (error) {
    console.error('Failed to save service:', error);
    res.status(500).json({ success: false, message: 'Failed to save service' });
  }
});

// Delete service
app.delete('/api/services/:id', auth, async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }
    res.json({ success: true, message: 'Service deleted successfully' });
  } catch (error) {
    console.error('Failed to delete service:', error);
    res.status(500).json({ success: false, message: 'Failed to delete service' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
});
