import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongoose';
import Message from '@/lib/models/Message';
import Notification from '@/lib/models/Notification';
import User from '@/lib/models/User';

export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const viewerEmail = String(searchParams.get('viewerEmail') || '').trim().toLowerCase();

    const query = viewerEmail
      ? { $or: [{ fromEmail: viewerEmail }, { toEmail: viewerEmail }] }
      : {};

    const messages = await Message.find(query).sort({ createdAt: -1 }).lean();
    const helperQuery = { role: { $in: ['can-help', 'both'] }, isActive: true };
    if (viewerEmail) {
      helperQuery.email = { $ne: viewerEmail };
    }

    const helpers = await User.find(helperQuery)
      .select('name email role location skills trustScore contributions avgRating badges')
      .sort({ trustScore: -1, contributions: -1, createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      threads: messages.map((message) => ({
        id: message._id?.toString(),
        sender: { name: message.fromName || 'Unknown', email: message.fromEmail || '' },
        recipient: { name: message.toName || 'Unknown', email: message.toEmail || '' },
        fromName: message.fromName || 'Unknown',
        toName: message.toName || 'Unknown',
        content: message.content,
        createdAt: message.createdAt,
        isRead: message.isRead || false
      })),
      users: helpers.map((user) => ({
        id: user._id?.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        location: user.location || '',
        skills: user.skills || [],
        trustScore: user.trustScore || 0,
        contributions: user.contributions || 0,
        avgRating: user.avgRating || 0,
        badges: user.badges || []
      }))
    });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Failed to fetch messages' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();

    const senderEmail = String(body.senderEmail || '').trim().toLowerCase();
    const recipientEmail = String(body.recipientEmail || '').trim().toLowerCase();
    const senderName = String(body.senderName || '').trim();
    const recipientName = String(body.recipientName || '').trim();

    if (!senderEmail || !recipientEmail || !body.content) {
      return NextResponse.json({ error: 'senderEmail, recipientEmail and content are required' }, { status: 400 });
    }

    if (senderEmail === recipientEmail) {
      return NextResponse.json({ error: 'You cannot send a message to yourself' }, { status: 400 });
    }

    const created = await Message.create({
      fromEmail: senderEmail,
      fromName: senderName,
      toEmail: recipientEmail,
      toName: recipientName,
      content: body.content,
      isRead: false
    });

    await Notification.create({
      userEmail: recipientEmail,
      userName: recipientName,
      type: 'message',
      title: `New message from ${senderName || 'a helper'}`,
      message: body.content.slice(0, 120),
      actionUrl: '/messages',
      isRead: false
    });

    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Failed to send message' }, { status: 500 });
  }
}