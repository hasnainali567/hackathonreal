import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongoose';
import User from '@/lib/models/User';

export async function GET() {
  try {
    await connectDB();

    const users = await User.find({
      role: { $in: ['can-help', 'both'] },
      isActive: true
    })
      .select('name email location role skills trustScore contributions avgRating badges')
      .sort({ trustScore: -1, contributions: -1, createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      data: users.map((user) => ({
        id: user._id?.toString(),
        name: user.name,
        email: user.email,
        location: user.location || '',
        role: user.role || 'both',
        skills: user.skills || [],
        trustScore: user.trustScore || 0,
        contributions: user.contributions || 0,
        avgRating: user.avgRating || 0,
        badges: user.badges || []
      }))
    });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Failed to fetch helpers' }, { status: 500 });
  }
}