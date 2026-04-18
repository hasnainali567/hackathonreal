import { NextResponse } from 'next/server';

// Mock leaderboard data
const leaderboardData = [
  {
    rank: 1,
    userId: "user_1",
    name: "Ayesha Khan",
    location: "Karachi",
    trustScore: 100,
    contributions: 47,
    helpsGiven: 45,
    avgRating: 4.9,
    badges: ["Design Ally", "Fast Responder", "Top Mentor"]
  },
  {
    rank: 2,
    userId: "user_2",
    name: "Hassan Ali",
    location: "Islamabad",
    trustScore: 98,
    contributions: 38,
    helpsGiven: 35,
    avgRating: 4.8,
    badges: ["Code Master", "Great Communicator"]
  },
  {
    rank: 3,
    userId: "user_3",
    name: "Sara Noor",
    location: "Lahore",
    trustScore: 96,
    contributions: 32,
    helpsGiven: 30,
    avgRating: 4.7,
    badges: ["Fast Responder", "Patient Teacher"]
  },
  {
    rank: 4,
    userId: "user_4",
    name: "Ali Ahmed",
    location: "Karachi",
    trustScore: 94,
    contributions: 28,
    helpsGiven: 26,
    avgRating: 4.6,
    badges: ["Rising Star"]
  },
  {
    rank: 5,
    userId: "user_5",
    name: "Fatima Khan",
    location: "Rawalpindi",
    trustScore: 92,
    contributions: 24,
    helpsGiven: 22,
    avgRating: 4.5,
    badges: ["Newcomer Star"]
  },
  {
    rank: 6,
    userId: "user_6",
    name: "Muhammad Hassan",
    location: "Multan",
    trustScore: 90,
    contributions: 20,
    helpsGiven: 18,
    avgRating: 4.4,
    badges: ["Helpful"]
  },
];

// GET /api/users/leaderboard - Get top helpers
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "10");
    const category = searchParams.get("category"); // optional: filter by category

    // Return top helpers based on limit
    const topHelpers = leaderboardData.slice(0, Math.min(limit, leaderboardData.length));

    return NextResponse.json({
      success: true,
      data: topHelpers,
      total_helpers: leaderboardData.length,
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
