import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User';
import Lead from '../models/Lead';

dotenv.config();

const sampleLeads = [
  { name: 'Priya Nair', email: 'priya.nair@techcorp.io', status: 'qualified', source: 'website' },
  { name: 'Rahul Sharma', email: 'rahul.sharma@innovate.com', status: 'new', source: 'instagram' },
  { name: 'Ananya Patel', email: 'ananya@startuphub.in', status: 'contacted', source: 'referral' },
  { name: 'Vikram Singh', email: 'vikram.s@enterprise.co', status: 'qualified', source: 'website' },
  { name: 'Sneha Reddy', email: 'sneha.reddy@cloudnine.com', status: 'new', source: 'website' },
  { name: 'Arjun Mehta', email: 'arjun.mehta@digital.io', status: 'contacted', source: 'instagram' },
  { name: 'Kavya Iyer', email: 'kavya.iyer@saasflow.com', status: 'lost', source: 'referral' },
  { name: 'Dev Malhotra', email: 'dev.m@buildfast.dev', status: 'new', source: 'website' },
  { name: 'Isha Gupta', email: 'isha.gupta@marketpro.in', status: 'qualified', source: 'instagram' },
  { name: 'Rohan Das', email: 'rohan.das@referral.net', status: 'contacted', source: 'referral' },
  { name: 'Meera Joshi', email: 'meera.j@healthplus.org', status: 'new', source: 'website' },
  { name: 'Aditya Verma', email: 'aditya.v@fintech.io', status: 'qualified', source: 'referral' },
  { name: 'Neha Kapoor', email: 'neha.kapoor@design.studio', status: 'contacted', source: 'instagram' },
  { name: 'Karan Pillai', email: 'karan.pillai@logistics.co', status: 'lost', source: 'website' },
  { name: 'Divya Krishnan', email: 'divya.k@edu.in', status: 'new', source: 'referral' },
];

async function seed() {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/smart-leads';
  await mongoose.connect(uri);
  console.log('Connected to MongoDB');

  await Lead.deleteMany({});
  await User.deleteMany({ email: { $in: ['admin@salesflow.io', 'sales@salesflow.io'] } });

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash('demo123456', salt);

  const admin = await User.create({
    name: 'Alice Smith',
    email: 'admin@salesflow.io',
    passwordHash,
    role: 'admin',
  });

  const sales = await User.create({
    name: 'Bob Sales',
    email: 'sales@salesflow.io',
    passwordHash,
    role: 'sales',
  });

  const creators = [admin._id, sales._id, admin._id, sales._id];
  for (let i = 0; i < sampleLeads.length; i++) {
    const lead = sampleLeads[i];
    await Lead.create({
      ...lead,
      createdBy: creators[i % creators.length],
    });
  }

  console.log('Seed complete!');
  console.log('  Admin: admin@salesflow.io / demo123456');
  console.log('  Sales: sales@salesflow.io / demo123456');
  console.log(`  Leads: ${sampleLeads.length} sample records`);
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
