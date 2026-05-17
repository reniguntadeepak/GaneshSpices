import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { supabase } from '../db.js';
import { signToken } from '../middleware/auth.js';

const router = Router();

function normalizeUsername(value) {
  return value.trim().toLowerCase();
}

function toPublicUser(row) {
  return {
    id: row.id,
    username: row.username,
    name: row.name,
    role: row.role,
  };
}

router.post('/register', async (req, res, next) => {
  try {
    const { name, username, password } = req.body;
    const trimmedName = String(name || '').trim();
    const normalizedUsername = normalizeUsername(String(username || ''));

    if (!trimmedName) {
      return res.status(400).json({ error: 'Full name is required.' });
    }
    if (!normalizedUsername || normalizedUsername.length < 3) {
      return res.status(400).json({ error: 'Username must be at least 3 characters.' });
    }
    if (String(password || '').length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const { data, error } = await supabase
      .from('users')
      .insert({
        username: normalizedUsername,
        password_hash: passwordHash,
        name: trimmedName,
        role: 'customer',
      })
      .select('id, username, name, role')
      .single();

    if (error) {
      if (error.code === '23505') {
        return res.status(400).json({ error: 'This username is already taken.' });
      }
      throw error;
    }

    const user = toPublicUser(data);
    const token = signToken(user);
    res.status(201).json({ token, user });
  } catch (err) {
    next(err);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const normalizedUsername = normalizeUsername(String(username || ''));

    const { data, error } = await supabase
      .from('users')
      .select('id, username, name, role, password_hash')
      .eq('username', normalizedUsername)
      .maybeSingle();

    if (error) throw error;
    if (!data) {
      return res.status(401).json({ error: 'Invalid username or password.' });
    }

    const valid = await bcrypt.compare(String(password || ''), data.password_hash);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid username or password.' });
    }

    const user = toPublicUser(data);
    const token = signToken(user);
    res.json({ token, user });
  } catch (err) {
    next(err);
  }
});

export default router;
