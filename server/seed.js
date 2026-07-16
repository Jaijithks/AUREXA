import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import Content from './models/Content.js';
import Service from './models/Service.js';
import Project from './models/Project.js';
import Admin from './models/Admin.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_PATH = path.join(__dirname, 'db.json');

const seedDB = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URL);
    console.log('✅ Connected to MongoDB for seeding');

    // Read existing db.json
    let dbData = {};
    if (fs.existsSync(DB_PATH)) {
      const raw = fs.readFileSync(DB_PATH, 'utf8');
      dbData = JSON.parse(raw);
      console.log('📄 Read db.json successfully');
    } else {
      console.log('⚠️  No db.json found, seeding with defaults');
    }

    // 1. Seed Content (hero, about, contact) — only if no content doc exists
    const existingContent = await Content.findOne();
    if (!existingContent) {
      const contentData = {
        hero: dbData.hero || {},
        about: dbData.about || {},
        contact: dbData.contact || {},
      };
      await Content.create(contentData);
      console.log('✅ Content seeded (hero, about, contact)');
    } else {
      console.log('⏭️  Content already exists, skipping');
    }

    // 2. Seed Services — only if collection is empty
    const serviceCount = await Service.countDocuments();
    if (serviceCount === 0 && dbData.services?.length > 0) {
      // Map old id fields but let MongoDB create _id
      const services = dbData.services.map((s) => ({
        name: s.name,
        desc: s.desc,
        iconType: s.iconType || 'design',
      }));
      await Service.insertMany(services);
      console.log(`✅ ${services.length} services seeded`);
    } else {
      console.log(`⏭️  Services already exist (${serviceCount}), skipping`);
    }

    // 3. Seed Projects — only if collection is empty
    const projectCount = await Project.countDocuments();
    if (projectCount === 0 && dbData.projects?.length > 0) {
      const projects = dbData.projects.map((p) => ({
        name: p.name,
        category: p.category,
        tag: p.tag || '',
        type: p.type || '',
        image: p.image || '',
        liveUrl: p.liveUrl || '',
      }));
      await Project.insertMany(projects);
      console.log(`✅ ${projects.length} projects seeded`);
    } else {
      console.log(`⏭️  Projects already exist (${projectCount}), skipping`);
    }

    // 4. Seed Admin — only if no admin exists
    const existingAdmin = await Admin.findOne();
    if (!existingAdmin) {
      await Admin.create({
        email: 'admin@gmail.com',
        password: 'admin@123',
      });
      console.log('✅ Default admin user created (admin@gmail.com / admin@123)');
    } else {
      console.log('⏭️  Admin user already exists, skipping');
    }

    console.log('\n🎉 Seeding complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  }
};

seedDB();
