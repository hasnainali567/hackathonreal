import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
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

// GET /api/requests/[id] - Get a single request
export async function GET(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;

    console.log('hitted with id ', id);
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Request not found" },
        { status: 404 }
      );
    }

    const req = await Request.findById(id)
      .populate('author', 'name location trustScore contributions avgRating skills')
      .populate('helpersInterested', 'name location trustScore contributions avgRating skills')
      .lean();

    if (!req) {
      return NextResponse.json(
        { error: "Request not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(toPlainRequest(req));
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch request" },
      { status: 500 }
    );
  }
}

// PUT /api/requests/[id] - Update request status or add helpers
export async function PUT(request, { params }) {
  try {
    await connectDB();
    const { id } = params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Request not found" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { status, action, helper } = body;

    const req = await Request.findById(id);
    if (!req) {
      return NextResponse.json(
        { error: "Request not found" },
        { status: 404 }
      );
    }

    // Update status
    if (status) {
      req.status = status;
    }

    // Add helper interest
    if (action === "add_helper" && helper) {
      const helperId = typeof helper === 'object' ? helper?._id : helper;
      if (mongoose.Types.ObjectId.isValid(helperId)) {
        req.helpersInterested = req.helpersInterested || [];
        const alreadyExists = req.helpersInterested.some(
          (existingId) => existingId.toString() === helperId.toString()
        );
        if (!alreadyExists) {
          req.helpersInterested.push(helperId);
        }
      }
    }

    await req.save();

    const updated = await Request.findById(id)
      .populate('author', 'name location trustScore contributions avgRating skills')
      .populate('helpersInterested', 'name location trustScore contributions avgRating skills')
      .lean();

    return NextResponse.json({
      success: true,
      message: "Request updated successfully",
      data: toPlainRequest(updated)
    });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Failed to update request" },
      { status: 500 }
    );
  }
}
