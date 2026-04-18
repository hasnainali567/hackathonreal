import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongoose';
import Notification from '@/lib/models/Notification';

export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const userEmail = String(searchParams.get('userEmail') || '').trim().toLowerCase();

    const query = userEmail ? { userEmail } : {};
    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      notifications: notifications.map((notification) => ({
        id: notification._id?.toString(),
        type: notification.type,
        title: notification.title,
        message: notification.message,
        isRead: notification.isRead,
        createdAt: notification.createdAt,
        actionUrl: notification.actionUrl || '',
        userEmail: notification.userEmail || '',
        userName: notification.userName || ''
      }))
    });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Failed to fetch notifications' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    const notification = await Notification.create({
      userEmail: String(body.userEmail || '').toLowerCase(),
      userName: body.userName || '',
      type: body.type,
      title: body.title,
      message: body.message,
      actionUrl: body.actionUrl || '',
      isRead: Boolean(body.isRead)
    });

    return NextResponse.json({ success: true, data: notification }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Failed to create notification' }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    await connectDB();
    const body = await request.json();
    const userEmail = String(body.userEmail || '').trim().toLowerCase();

    if (!userEmail) {
      return NextResponse.json({ error: 'userEmail is required' }, { status: 400 });
    }

    await Notification.updateMany({ userEmail }, { $set: { isRead: true } });

    return NextResponse.json({ success: true, message: 'All notifications marked as read' });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Failed to update notifications' }, { status: 500 });
  }
}