import { NextResponse } from 'next/server';

// Simple keyword-based tag suggestion (AI-like)
const tagKeywords = {
  frontend: ["react", "vue", "angular", "javascript", "typescript", "css", "html", "design", "ui", "component"],
  backend: ["node", "express", "api", "database", "mongodb", "sql", "server", "authentication", "jwt", "database"],
  mobile: ["react native", "flutter", "swift", "kotlin", "ios", "android", "mobile"],
  design: ["figma", "design", "ui/ux", "wireframe", "prototype", "adobe", "illustration", "branding"],
  devops: ["docker", "kubernetes", "aws", "deployment", "ci/cd", "git", "devops", "infrastructure"],
  career: ["interview", "resume", "job", "portfolio", "networking", "career", "internship"],
};

const MIN_TAGS = 4;
const MAX_TAGS = 5;

const fallbackTags = [
  "Help",
  "Support",
  "Community",
  "Guidance",
  "Problem Solving",
  "Collaboration",
  "Learning",
  "Assistance",
  "Best Practices"
];

const categoryTagMap = {
  frontend: "Frontend",
  backend: "Backend",
  mobile: "Mobile",
  design: "Design",
  devops: "DevOps",
  career: "Career"
};

function suggestTags(title, description) {
  const text = `${title} ${description}`.toLowerCase();
  const suggestedTags = new Set();

  // Scan for keywords
  for (const [category, keywords] of Object.entries(tagKeywords)) {
    for (const keyword of keywords) {
      if (text.includes(keyword)) {
        suggestedTags.add(keyword.charAt(0).toUpperCase() + keyword.slice(1));
        suggestedTags.add(categoryTagMap[category]);
      }
    }
  }

  const uniqueTags = Array.from(suggestedTags).filter(Boolean);

  for (const fallback of fallbackTags) {
    if (uniqueTags.length >= MAX_TAGS) break;
    if (!uniqueTags.includes(fallback)) {
      uniqueTags.push(fallback);
    }
  }

  // Always return at least 4 tags, up to 5 tags.
  return uniqueTags.slice(0, Math.max(MIN_TAGS, Math.min(MAX_TAGS, uniqueTags.length)));
}

// POST /api/ai/tags - Suggest tags based on title and description
export async function POST(request) {
  try {
    const body = await request.json();
    const { title, description } = body;

    if (!title) {
      return NextResponse.json(
        { error: "Title is required for tag suggestions" },
        { status: 400 }
      );
    }

    const suggestedTags = suggestTags(title, description || "");

    return NextResponse.json({
      success: true,
      suggested_tags: suggestedTags,
      message: suggestedTags.length > 0 
        ? `Suggested ${suggestedTags.length} tags based on your request`
        : "No specific tags detected. Add custom tags manually."
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to generate tag suggestions" },
      { status: 500 }
    );
  }
}
