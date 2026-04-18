# MongoDB Connection & API Testing Guide

## 1. **Setup MongoDB Connection**

### Install Dependencies
```bash
npm install mongoose dotenv
```

### Create `.env.local` file (in root directory)
```env
MONGODB_URI=mongodb://localhost:27017/helplytics
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/helplytics?retryWrites=true&w=majority
```

### Update `src/lib/mongoose.js`
The connection file already exists. Make sure it looks like this:

```javascript
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Please define MONGODB_URI in .env.local");
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    console.log("Using cached MongoDB connection");
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then((mongoose) => {
        console.log("✅ MongoDB connected successfully");
        return mongoose;
      })
      .catch((err) => {
        console.error("❌ MongoDB connection error:", err);
        throw err;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default dbConnect;
```

---

## 2. **Connect API Routes to Database**

### Example: Update `src/app/api/requests/route.js`

```javascript
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import Request from '@/lib/models/Request';
import User from '@/lib/models/User';

// POST /api/requests - Create a new request
export async function POST(request) {
  try {
    await dbConnect();
    
    const body = await request.json();
    const { title, description, category, urgency, tags, userId } = body;

    // Create request with real DB
    const newRequest = await Request.create({
      title,
      description,
      category: category || "general",
      urgency: urgency || "medium",
      tags: tags || [],
      author: userId,
    });

    // Populate author details
    await newRequest.populate('author', 'name email location');

    return NextResponse.json(newRequest, { status: 201 });
  } catch (error) {
    console.error("Request creation error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create request" },
      { status: 500 }
    );
  }
}

// GET /api/requests - Get all requests with filters
export async function GET(request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const urgency = searchParams.get("urgency");
    const limit = parseInt(searchParams.get("limit") || "10");

    let query = {};
    if (category && category !== "all") query.category = category;
    if (urgency && urgency !== "all") query.urgency = urgency;

    const requests = await Request.find(query)
      .populate('author', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit);

    return NextResponse.json({
      success: true,
      data: requests,
      total: await Request.countDocuments(query)
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch requests" },
      { status: 500 }
    );
  }
}
```

---

## 3. **Test the Endpoints**

### Using cURL

```bash
# Create a Request
curl -X POST http://localhost:3000/api/requests \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Help with React hooks",
    "description": "I need help understanding useEffect...",
    "category": "web",
    "urgency": "high",
    "tags": ["React", "Hooks"],
    "userId": "YOUR_USER_ID"
  }'

# Get All Requests
curl http://localhost:3000/api/requests

# Get Filtered Requests
curl "http://localhost:3000/api/requests?category=web&urgency=high"

# Get Single Request
curl http://localhost:3000/api/requests/REQUEST_ID
```

### Using Postman / Thunder Client

1. **Create Request (POST)**
   - URL: `http://localhost:3000/api/requests`
   - Body (JSON):
   ```json
   {
     "title": "Need help with Node.js",
     "description": "Learning Node.js and stuck on middleware...",
     "category": "backend",
     "urgency": "medium",
     "tags": ["Node.js", "Express"],
     "userId": "USER_ID"
   }
   ```

2. **Get All Requests (GET)**
   - URL: `http://localhost:3000/api/requests`

3. **Test AI Endpoints (POST)**
   - URL: `http://localhost:3000/api/ai/tags`
   - Body:
   ```json
   {
     "title": "React component library",
     "description": "Building shared components with Storybook"
   }
   ```

---

## 4. **Test with Mock Data**

### Create Sample Users & Requests

```bash
# Create a test user entry
curl -X POST http://localhost:3000/api/users/profile \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user_test_1",
    "name": "Test User",
    "location": "Karachi",
    "skills": ["React", "Node.js"],
    "interests": ["Web Development"],
    "role": "both"
  }'

# Create multiple test requests
# Repeat for each request...
curl -X POST http://localhost:3000/api/requests \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Need help with CSS Grid",
    "description": "Learning CSS Grid layout, stuck on auto-placement...",
    "category": "web",
    "urgency": "high",
    "tags": ["CSS", "Grid"],
    "userId": "user_test_1"
  }'
```

---

## 5. **MongoDB Atlas Setup (Optional)**

If using MongoDB Atlas instead of local MongoDB:

1. Go to https://www.mongodb.com/cloud/atlas
2. Create a cluster
3. Get connection string
4. Update `.env.local`:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/helplytics?retryWrites=true&w=majority
   ```

---

## 6. **Testing Workflow**

```bash
# 1. Start your Next.js app
npm run dev

# 2. Test API endpoints (use Postman or cURL above)

# 3. Check MongoDB (using MongoDB Compass or mongo CLI)
mongo
use helplytics
db.users.find()
db.requests.find()

# 4. View in browser
# All pages at: http://localhost:3000
# API responses: http://localhost:3000/api/requests
```

---

## 7. **Frontend Integration Example**

Update your pages to fetch real data:

```javascript
// pages/explore/page.jsx
import { useEffect, useState } from 'react';

export default function Explore() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await fetch('/api/requests?limit=10');
        const data = await res.json();
        setRequests(data.data);
      } catch (error) {
        console.error("Failed to fetch requests:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {requests.map((request) => (
        <div key={request._id}>
          <h3>{request.title}</h3>
          <p>{request.description}</p>
        </div>
      ))}
    </div>
  );
}
```

---

## 8. **Common Issues & Solutions**

### Issue: "MONGODB_URI not defined"
**Solution:** Make sure `.env.local` exists with MONGODB_URI set

### Issue: Connection timeout
**Solution:** Check if MongoDB is running locally or verify Atlas credentials

### Issue: Model not found
**Solution:** Import models correctly:
```javascript
import Request from '@/lib/models/Request';
// NOT: import Request from '@/models/request'
```

### Issue: ObjectId validation error
**Solution:** Ensure userIds are valid MongoDB ObjectIds when creating records

---

## ✅ You're Ready to Go!

Once MongoDB is connected:
- ✅ All pages will fetch real data
- ✅ APIs will save to database
- ✅ Leaderboard shows actual top helpers
- ✅ Full platform is functional

---

**Next Steps:**
1. Connect MongoDB following steps 1-2
2. Update API routes to use models (step 3)
3. Test with cURL or Postman (step 4)
4. Update frontend components (step 7)
5. Deploy!
