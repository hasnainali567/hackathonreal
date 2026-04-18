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

    const user = await User.findOneAndUpdate(
      { email },
      {
        $set: {
          name,
          location: body.location || '',
          role: normalizeRole(body.role),
          skills: normalizeArray(body.skills),
          interests: normalizeArray(body.interests),
          trustScore: Number.isFinite(body.trustScore) ? body.trustScore : 50,
          contributions: Number.isFinite(body.contributions) ? body.contributions : 0,
          avgRating: Number.isFinite(body.avgRating) ? body.avgRating : 0,
          badges: normalizeArray(body.badges),
          isActive: true
        },
        $setOnInsert: {
          password: body.password || `demo-${Date.now()}`
        }
      },
      { upsert: true, new: true, runValidators: true }
    ).select('-password');

    return NextResponse.json({ success: true, data: user });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Failed to sync user' }, { status: 500 });
  }
}