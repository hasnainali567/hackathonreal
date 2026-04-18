import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongoose';
import User from '@/lib/models/User';

// GET /api/users/leaderboard - Get top helpers
export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10', 10);

    const topHelpers = await User.find({ isActive: true })
      .select('name location trustScore contributions helpsGiven avgRating badges role skills')
      .sort({ trustScore: -1, contributions: -1, createdAt: -1 })
      .limit(Number.isNaN(limit) ? 10 : limit)
      .lean();

    return NextResponse.json({
      success: true,
      data: topHelpers.map((user, index) => ({
        rank: index + 1,
        userId: user._id?.toString(),
        name: user.name,
        location: user.location || 'Pakistan',
        trustScore: user.trustScore || 0,
        contributions: user.contributions || 0,
        helpsGiven: user.helpsGiven || user.contributions || 0,
        avgRating: user.avgRating || 0,
        badges: user.badges || [],
        role: user.role || 'both',
        skills: user.skills || []
      })),
      total_helpers: topHelpers.length,
      message: `Showing top ${topHelpers.length} helpers ranked by contributions and trust score`
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch leaderboard" },
      { status: 500 }
    );
  }
}

// POST - Get helper stats by user ID
export async function POST(request) {
  try {
    const body = await request.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      );
    }

    const helper = leaderboardData.find(h => h.userId === userId);

    if (!helper) {
      return NextResponse.json(
        { error: "Helper not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: helper,
      message: `Stats for ${helper.name}`
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch helper stats" },
      { status: 500 }
    );
  }
}
