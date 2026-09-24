import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import Admin from '../models/Admin.js';

dotenv.config();

const seedAdmin = async () => {
  try {
    await connectDB();

    const email = (process.env.ADMIN_EMAIL || 'admin@lighthut.com').toLowerCase().trim();
    const password = process.env.ADMIN_PASSWORD || 'admin123456';
    const name = process.env.ADMIN_NAME || 'LightHut Administrator';

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });

    if (existingAdmin) {
      console.log(`[Seed] Admin user '${email}' already exists. Updating credentials...`);
      existingAdmin.name = name;
      existingAdmin.password = password; // pre-save hook will hash it
      await existingAdmin.save();
      console.log(`[Seed] Admin user '${email}' credentials refreshed.`);
    } else {
      await Admin.create({
        name,
        email,
        password,
        role: 'admin',
      });
      console.log(`[Seed] Successfully created primary admin account: ${email}`);
    }

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]:', error);
    process.exit(1);
  }
};

seedAdmin();
