import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongoose';
import User from '@/lib/models/User';

const normalizeRole = (role) => {
  if (!role) return 'both';
  const normalized = String(role).toLowerCase();
  if (normalized.includes('need')) return 'need-help';
  if (normalized.includes('can')) return 'can-help';
  return 'both';
};

const normalizeArray = (value) => {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (typeof value === 'string') {
    return value.split(',').map((item) => item.trim()).filter(Boolean);
  }
  return [];
};

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    const email = String(body.email || '').trim().toLowerCase();
    const name = String(body.name || '').trim();

    if (!email || !name) {
      return NextResponse.json({ error: 'name and email are required' }, { status: 400 });
    }

    const updates = {
      $set: {
        name,
        isActive: true
      },
      $setOnInsert: {
        password: body.password || `demo-${Date.now()}`
      }
    };

    if (Object.prototype.hasOwnProperty.call(body, 'location')) {
      updates.$set.location = body.location || '';
    }

    if (Object.prototype.hasOwnProperty.call(body, 'role')) {
      updates.$set.role = normalizeRole(body.role);
    }

    if (Object.prototype.hasOwnProperty.call(body, 'skills')) {
      updates.$set.skills = normalizeArray(body.skills);
    }

    if (Object.prototype.hasOwnProperty.call(body, 'interests')) {
      updates.$set.interests = normalizeArray(body.interests);
    }

    if (Object.prototype.hasOwnProperty.call(body, 'trustScore')) {
      updates.$set.trustScore = Number.isFinite(body.trustScore) ? body.trustScore : 50;
    }

    if (Object.prototype.hasOwnProperty.call(body, 'contributions')) {
      updates.$set.contributions = Number.isFinite(body.contributions) ? body.contributions : 0;
    }

    if (Object.prototype.hasOwnProperty.call(body, 'avgRating')) {
      updates.$set.avgRating = Number.isFinite(body.avgRating) ? body.avgRating : 0;
    }

    if (Object.prototype.hasOwnProperty.call(body, 'badges')) {
      updates.$set.badges = normalizeArray(body.badges);
    }

    const user = await User.findOneAndUpdate(
      { email },
      updates,
      { upsert: true, new: true, runValidators: true }
    ).select('-password');

    return NextResponse.json({ success: true, data: user });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Failed to sync user' }, { status: 500 });
  }
}