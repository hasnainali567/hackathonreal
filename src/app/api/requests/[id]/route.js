import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectDB } from '@/lib/mongoose';
import Request from '@/lib/models/Request';
import User from '@/lib/models/User';
import Message from '@/lib/models/Message';
import Notification from '@/lib/models/Notification';

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
      .populate('author', 'name email location trustScore contributions avgRating skills')
      .populate('helpersInterested', 'name email location trustScore contributions avgRating skills')
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
    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Request not found" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { status, action, helper, helperEmail, helperName, actorEmail, actorName } = body;

    const req = await Request.findById(id);
    if (!req) {
      return NextResponse.json(
        { error: "Request not found" },
        { status: 404 }
      );
    }

    // Update status
    if (status) {
      const normalizedStatus = String(status).toLowerCase();
      if (!['open', 'in-progress', 'solved', 'closed'].includes(normalizedStatus)) {
        return NextResponse.json(
          { error: 'Invalid status value' },
          { status: 400 }
        );
      }

      if (normalizedStatus === 'solved') {
        const ownerUser = req.author ? await User.findById(req.author).select('email name').lean() : null;
        const normalizedActorEmail = String(actorEmail || '').trim().toLowerCase();
        const normalizedActorName = String(actorName || '').trim().toLowerCase();

        if (ownerUser?.email && normalizedActorEmail !== ownerUser.email.toLowerCase()) {
          return NextResponse.json(
            { error: 'Only the request owner can mark this as solved' },
            { status: 403 }
          );
        }

        if (!ownerUser?.email && req.authorName && normalizedActorName !== String(req.authorName).toLowerCase()) {
          return NextResponse.json(
            { error: 'Only the request owner can mark this as solved' },
            { status: 403 }
          );
        }

        req.solvedAt = new Date();
      } else {
        req.solvedAt = undefined;
      }

      req.status = normalizedStatus;
    }

    // Add helper interest
    if (action === "add_helper") {
      let helperId = null;

      const candidateId = typeof helper === 'object' ? helper?._id : helper;
      if (candidateId && mongoose.Types.ObjectId.isValid(candidateId)) {
        helperId = candidateId.toString();
      }

      if (!helperId && helperEmail) {
        const normalizedEmail = String(helperEmail).trim().toLowerCase();
        if (!normalizedEmail) {
          return NextResponse.json(
            { error: 'helperEmail is required to register helper interest' },
            { status: 400 }
          );
        }

        const helperUser = await User.findOneAndUpdate(
          { email: normalizedEmail },
          {
            $set: {
              name: helperName || normalizedEmail.split('@')[0],
              role: 'can-help',
              isActive: true
            },
            $setOnInsert: {
              password: `demo-${Date.now()}`,
              location: 'Pakistan'
            }
          },
          { upsert: true, new: true, runValidators: true }
        );

        helperId = helperUser._id.toString();
      }

      if (!helperId || !mongoose.Types.ObjectId.isValid(helperId)) {
        return NextResponse.json(
          { error: 'Valid helper identity is required' },
          { status: 400 }
        );
      }

      if (req.author && req.author.toString() === helperId) {
        return NextResponse.json(
          { error: 'Request owner cannot add themselves as helper' },
          { status: 400 }
        );
      }

      req.helpersInterested = req.helpersInterested || [];
      const alreadyExists = req.helpersInterested.some(
        (existingId) => existingId.toString() === helperId.toString()
      );

      if (alreadyExists) {
        return NextResponse.json(
          { error: 'You have already marked interest on this request' },
          { status: 400 }
        );
      }

      req.helpersInterested.push(helperId);

      const ownerUser = req.author ? await User.findById(req.author).select('email name').lean() : null;
      const helperUser = await User.findById(helperId).select('email name').lean();

      if (ownerUser?.email && helperUser?.email) {
        await Message.create({
          from: helperUser._id,
          to: ownerUser._id,
          fromEmail: helperUser.email,
          fromName: helperUser.name || helperName || 'Helper',
          toEmail: ownerUser.email,
          toName: ownerUser.name || req.authorName || 'Requester',
          request: req._id,
          content: `${helperUser.name || 'A helper'} is interested in helping on your request: ${req.title}`,
          isRead: false
        });

        await Notification.create({
          user: ownerUser._id,
          userEmail: ownerUser.email,
          userName: ownerUser.name || req.authorName || 'Requester',
          type: 'help-offer',
          title: `${helperUser.name || 'A helper'} can help with your request`,
          message: `${helperUser.name || 'A helper'} clicked "I can help" on: ${req.title}`,
          relatedRequest: req._id,
          relatedUser: helperUser._id,
          actionUrl: `/request/${req._id}`,
          isRead: false
        });
      }
    }

    await req.save();

    const updated = await Request.findById(id)
      .populate('author', 'name email location trustScore contributions avgRating skills')
      .populate('helpersInterested', 'name email location trustScore contributions avgRating skills')
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
