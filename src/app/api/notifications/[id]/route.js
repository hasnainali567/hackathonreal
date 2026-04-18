import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongoose';
import Notification from '@/lib/models/Notification';
import mongoose from 'mongoose';

export async function PATCH(request, { params }) {
  try {
    await connectDB();
    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Notification not found' }, { status: 404 });
    }

    const body = await request.json();
    const updated = await Notification.findByIdAndUpdate(
      id,
      { $set: { isRead: Boolean(body.isRead) } },
      { new: true }
    ).lean();

    if (!updated) {
      return NextResponse.json({ error: 'Notification not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Failed to update notification' }, { status: 500 });
  }
}