import { NextResponse } from 'next/server';

// Category keywords mapping
const categoryKeywords = {
  web: ["react", "vue", "angular", "javascript", "typescript", "css", "html", "frontend", "web", "responsive", "site", "page", "layout", "design", "ui", "component"],
  mobile: ["react native", "flutter", "swift", "kotlin", "ios", "android", "mobile", "app", "cross-platform"],
  backend: ["node", "express", "api", "database", "mongodb", "sql", "server", "authentication", "jwt", "backend", "rest", "graphql", "python", "java"],
  design: ["figma", "design", "ui/ux", "wireframe", "prototype", "adobe", "illustration", "branding", "sketch", "photoshop", "logo"],
  business: ["startup", "marketing", "business", "sales", "product", "strategy", "growth", "analytics", "saas", "b2b", "ecommerce"],
  career: ["interview", "resume", "job", "portfolio", "networking", "career", "internship", "hiring", "promotion", "salary", "linkedin"]
};

function detectCategory(title, description) {
  const text = `${title} ${description}`.toLowerCase();
  const scores = {};

  // Initialize scores
  for (const category of Object.keys(categoryKeywords)) {
    scores[category] = 0;
  }

  // Score each category based on keyword matches
  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    for (const keyword of keywords) {
      if (text.includes(keyword)) {
        scores[category] += 1;
      }
    }
  }

  // Find category with highest score
  let bestCategory = 'general';
  let bestScore = 0;

  for (const [category, score] of Object.entries(scores)) {
    if (score > bestScore) {
      bestScore = score;
      bestCategory = category;
    }
  }

  return {
    category: bestCategory,
    confidence: Math.min(bestScore * 0.2, 1),
    reason: bestScore > 0 ? `Detected keywords related to ${bestCategory}` : 'No specific category detected'
  };
}

// POST /api/ai/category - Detect category based on title and description
export async function POST(request) {
  try {
    const body = await request.json();
    const { title, description } = body;

    if (!title) {
      return NextResponse.json(
        { error: "Title is required for category detection" },
        { status: 400 }
      );
    }

    const result = detectCategory(title, description || "");

    return NextResponse.json({
      success: true,
      category: result.category,
      confidence: result.confidence,
      reason: result.reason
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to detect category" },
      { status: 500 }
    );
  }
}
