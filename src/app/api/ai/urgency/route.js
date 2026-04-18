import { NextResponse } from 'next/server';

// Urgency detection based on keywords and patterns
function detectUrgency(title, description) {
  const text = `${title} ${description}`.toLowerCase();

  const highUrgencyKeywords = [
    "urgent", "asap", "emergency", "immediately", "today", "tonight", "tomorrow", "deadline",
    "before", "before demo", "before interview", "before presentation", "now", "quickly",
    "by tonight", "by tomorrow", "urgent help needed"
  ];

  const mediumUrgencyKeywords = [
    "soon", "this week", "next few days", "coming up", "upcoming", "in a few days"
  ];

  // Check for high urgency keywords
  for (const keyword of highUrgencyKeywords) {
    if (text.includes(keyword)) {
      return {
        level: "high",
        score: 0.9,
        reason: `Detected keyword: "${keyword}"`
      };
    }
  }

  // Check for medium urgency keywords
  for (const keyword of mediumUrgencyKeywords) {
    if (text.includes(keyword)) {
      return {
        level: "medium",
        score: 0.6,
        reason: `Detected keyword: "${keyword}"`
      };
    }
  }

  // Check for specific patterns
  if (text.includes("demo day") || text.includes("demo")) {
    return {
      level: "high",
      score: 0.85,
      reason: "Demo day detected - high priority"
    };
  }

  if (text.includes("interview") || text.includes("internship")) {
    return {
      level: "high",
      score: 0.8,
      reason: "Interview/internship mentioned - time-sensitive"
    };
  }

  if (text.includes("project deadline") || text.includes("due")) {
    return {
      level: "high",
      score: 0.75,
      reason: "Deadline mentioned"
    };
  }

  // Default to low urgency
  return {
    level: "low",
    score: 0.3,
    reason: "No time-sensitive indicators detected"
  };
}

// POST /api/ai/urgency - Detect urgency level from request details
export async function POST(request) {
  try {
    const body = await request.json();
    const { title, description } = body;

    if (!title) {
      return NextResponse.json(
        { error: "Title is required for urgency detection" },
        { status: 400 }
      );
    }

    const urgencyResult = detectUrgency(title, description || "");

    return NextResponse.json({
      success: true,
      urgency: urgencyResult.level,
      confidence_score: urgencyResult.score,
      detection_reason: urgencyResult.reason,
      recommendation: `This request is ${urgencyResult.level} priority. ${
        urgencyResult.level === "high" ? "Quick response recommended." :
        urgencyResult.level === "medium" ? "Should be addressed within a few days." :
        "Can be addressed at normal pace."
      }`
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to detect urgency" },
      { status: 500 }
    );
  }
}
