#!/usr/bin/env node
import bcrypt from 'bcryptjs';

const hash = await bcrypt.hash(process.argv[2] || 'admin123', 10);
console.log(hash);
