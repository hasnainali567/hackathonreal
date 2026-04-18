import { NextResponse } from 'next/server';

// Mock user profiles database
const userProfiles = {
  user_1: {
    userId: "user_1",
    name: "Ayesha Khan",
    email: "ayesha@example.com",
    location: "Karachi",
    bio: "Design enthusiast and web developer",
    skills: ["React", "CSS", "Design", "Figma"],
    interests: ["UI/UX", "Web Development", "Teaching"],
    role: "both",
    trustScore: 100,
    contributions: 47,
    badges: ["Design Ally", "Fast Responder", "Top Mentor"]
  },
  user_2: {
    userId: "user_2",
    name: "Hassan Ali",
    email: "hassan@example.com",
    location: "Islamabad",
    bio: "Full-stack developer passionate about open source",
    skills: ["Node.js", "Express", "MongoDB", "React"],
    interests: ["Backend", "DevOps", "Mentoring"],
    role: "both",
    trustScore: 98,
    contributions: 38,
    badges: ["Code Master", "Great Communicator"]
  }
};

// PUT /api/users/profile - Update user profile (skills, interests, role)
export async function PUT(request) {
  try {
    const body = await request.json();
    const { userId, name, location, skills, interests, role, bio } = body;

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      );
    }

    // Get existing user or create new profile
    const user = userProfiles[userId] || {
      userId,
      name: "New User",
      email: `user_${userId}@example.com`,
      location: "Unknown",
      bio: "",
      skills: [],
      interests: [],
      role: "need-help",
      trustScore: 50,
      contributions: 0,
      badges: []
    };

    // Update fields
    if (name) user.name = name;
    if (location) user.location = location;
    if (bio) user.bio = bio;
    if (skills && Array.isArray(skills)) user.skills = skills;
    if (interests && Array.isArray(interests)) user.interests = interests;
    if (role) user.role = role; // "need-help", "can-help", or "both"

    userProfiles[userId] = user;

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
      data: user
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}

// GET /api/users/profile/:userId - Get user profile
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      );
    }

    const user = userProfiles[userId];

    if (!user) {
      return NextResponse.json(
        { error: "User profile not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: user
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}

// POST /api/users/profile - Batch update skills/role
export async function POST(request) {
  try {
    const body = await request.json();
    const { userId, updateType, value } = body;

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      );
    }

    const user = userProfiles[userId];
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Handle specific update types
    if (updateType === "add_skill" && value) {
      if (!user.skills.includes(value)) {
        user.skills.push(value);
      }
    }

    if (updateType === "remove_skill" && value) {
      user.skills = user.skills.filter(s => s !== value);
    }

    if (updateType === "add_interest" && value) {
      if (!user.interests.includes(value)) {
        user.interests.push(value);
      }
    }

    if (updateType === "remove_interest" && value) {
      user.interests = user.interests.filter(i => i !== value);
    }

    if (updateType === "set_role" && value) {
      user.role = value;
    }

    return NextResponse.json({
      success: true,
      message: `Profile updated: ${updateType}`,
      data: user
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}
