import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongoose';
import Request from '@/lib/models/Request';
import User from '@/lib/models/User';

const toPlainRequest = (doc) => {
  const request = doc.toObject ? doc.toObject() : doc;
  const populatedAuthor = request.author && typeof request.author === 'object' && request.author.name;
  const helpers = request.helpersInterested || [];

  return {
    ...request,
    id: request._id?.toString() || request.id,
    _id: request._id?.toString() || request._id,
    author: populatedAuthor
      ? {
          _id: request.author._id?.toString() || request.author._id,
          name: request.author.name,
          email: request.author.email || '',
          location: request.author.location || request.location || 'Unknown',
          trustScore: request.author.trustScore,
          contributions: request.author.contributions,
          avgRating: request.author.avgRating,
          skills: request.author.skills || []
        }
      : (request.authorName || 'Anonymous'),
    location: request.location || request.author?.location || 'Unknown',
    helpersInterested: helpers,
    interestedHelpers: helpers,
    postedTime: request.createdAt || null
  };
};

// POST /api/requests - Create a new request
export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    const { title, description, category, urgency, tags, author, authorName, authorEmail, location } = body;

    if (!title || !description) {
      return NextResponse.json(
        { error: "Title and description are required" },
        { status: 400 }
      );
    }

    let authorId = null;
    let resolvedAuthorName = authorName || author || 'Anonymous';

    const normalizedAuthorEmail = String(authorEmail || '').trim().toLowerCase();
    if (normalizedAuthorEmail) {
      const syncedUser = await User.findOneAndUpdate(
        { email: normalizedAuthorEmail },
        {
          $set: {
            name: resolvedAuthorName,
            location: location || 'Pakistan',
            role: 'both',
            isActive: true
          },
          $setOnInsert: {
            password: `demo-${Date.now()}`
          }
        },
        { upsert: true, new: true, runValidators: true }
      );

      authorId = syncedUser._id;
      resolvedAuthorName = syncedUser.name || resolvedAuthorName;
    }

    const created = await Request.create({
      title,
      description,
      category: category || "general",
      urgency: urgency || "medium",
      tags: tags || [],
      author: authorId,
      authorName: resolvedAuthorName,
      location: location || "Unknown",
      status: "open",
      views: 0,
      aiSummary: `${title.slice(0, 50)}...`
    });

    return NextResponse.json(toPlainRequest(created), { status: 201 });
  } catch (error) {
    if (error?.name === 'ValidationError') {
      const firstError = Object.values(error.errors || {})[0];
      return NextResponse.json(
        { error: firstError?.message || 'Validation failed' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: error.message || "Failed to create request" },
      { status: 500 }
    );
  }
}

// GET /api/requests - Get all requests with optional filters
export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const urgency = searchParams.get("urgency");
    const limit = searchParams.get("limit") || 10;

    const query = {};

    if (category && category !== "all") {
      query.category = category;
    }

    if (urgency && urgency !== "all") {
      query.urgency = urgency;
    }

    const parsedLimit = Number.parseInt(limit, 10);
    const safeLimit = Number.isNaN(parsedLimit) ? 10 : parsedLimit;

    const [requests, total] = await Promise.all([
      Request.find(query)
        .populate('author', 'name email location trustScore contributions avgRating skills')
        .sort({ createdAt: -1 })
        .limit(safeLimit)
        .lean(),
      Request.countDocuments(query)
    ]);

    return NextResponse.json({
      success: true,
      data: requests.map(toPlainRequest),
      total
    });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch requests" },
      { status: 500 }
    );
  }
}
