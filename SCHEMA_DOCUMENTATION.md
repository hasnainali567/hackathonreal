# MongoDB Schema Documentation - Helplytics AI

## Database Models Overview

### 1. **User Model**
Stores user information, skills, and contribution tracking.

**Fields:**
- `email` (String, unique) - User email
- `name` (String) - User full name
- `location` (String) - User location
- `bio` (String) - User bio
- `password` (String) - Encrypted password
- `role` (Enum) - "need-help", "can-help", or "both"
- `skills` (Array) - Skills the user can help with
- `interests` (Array) - Areas user wants to learn
- `trustScore` (Number) - 0-100 based on contributions
- `contributions` (Number) - Total help requests involved with
- `helpsGiven` (Number) - Number of successful helps
- `helpsSolved` (Number) - Requests solved by user
- `avgRating` (Number) - Average rating from recipients
- `badges` (Array) - Achievement badges earned
- `requestsCreated` (ObjectId Array) - References to created requests
- `requestsSolved` (ObjectId Array) - References to solved requests
- `isActive` (Boolean) - Account status
- `timestamps` - createdAt, updatedAt

**Indexes:**
- email
- trustScore
- contributions

---

### 2. **Request Model**
Stores help requests posted by users.

**Fields:**
- `title` (String, required) - Request title
- `description` (String, required) - Detailed description
- `category` (Enum) - web, mobile, design, backend, business, career, general
- `urgency` (Enum) - low, medium, high
- `tags` (Array) - Auto-generated or user-added tags
- `author` (ObjectId, ref: User) - Who created the request
- `status` (Enum) - open, in-progress, solved, closed
- `views` (Number) - Number of times viewed
- `helpersInterested` (ObjectId Array) - Users who offered help
- `solvedBy` (ObjectId, ref: User) - Who solved it
- `aiSummary` (String) - AI-generated summary
- `solvedAt` (Date) - When request was solved
- `timestamps` - createdAt, updatedAt

**Indexes:**
- category, urgency, status (compound)
- author
- createdAt (for sorting)

---

### 3. **Message Model**
Stores direct messages between users.

**Fields:**
- `from` (ObjectId, ref: User) - Sender
- `to` (ObjectId, ref: User) - Receiver
- `request` (ObjectId, ref: Request) - Related request (optional)
- `content` (String, required) - Message content
- `isRead` (Boolean) - Read status
- `readAt` (Date) - When message was read
- `timestamps` - createdAt, updatedAt

**Indexes:**
- from, to (for conversation threads)
- request
- createdAt

---

### 4. **Notification Model**
Stores user notifications.

**Fields:**
- `user` (ObjectId, ref: User) - Recipient
- `type` (Enum) - new-request, help-offer, status-change, message, trend, badge, follow
- `title` (String) - Notification title
- `message` (String) - Notification message
- `relatedRequest` (ObjectId, ref: Request) - Related request
- `relatedUser` (ObjectId, ref: User) - Related user
- `isRead` (Boolean) - Read status
- `actionUrl` (String) - Link to action
- `timestamps` - createdAt, updatedAt

**Indexes:**
- user, isRead (for fetching unread)
- createdAt

---

### 5. **Contribution Model**
Tracks helper contributions and ratings for each request.

**Fields:**
- `helper` (ObjectId, ref: User) - The helper
- `request` (ObjectId, ref: Request) - The request
- `requester` (ObjectId, ref: User) - The person who asked
- `status` (Enum) - interested, helping, completed
- `rating` (Number) - 1-5 rating from requester
- `ratingFeedback` (String) - Qualitative feedback
- `helpfulVotes` (Number) - Community votes on helpfulness
- `wasHelpful` (Boolean) - Quick feedback
- `completedAt` (Date) - When help was completed
- `timestamps` - createdAt, updatedAt

**Indexes:**
- helper (to find user's contributions)
- request (to see all contributions to a request)
- status

---

## Relationships

```
User
├─ 1 → ∞ Request (author)
├─ 1 → ∞ Message (from/to)
├─ 1 → ∞ Notification
└─ 1 → ∞ Contribution (helper)

Request
├─ 1 ← ∞ User (author)
├─ 1 → ∞ Message (request)
├─ 1 → ∞ Contribution
└─ * → * User (helpersInterested)

Contribution
├─ 1 ← User (helper)
├─ 1 ← Request (request)
└─ 1 ← User (requester)

Message
├─ 1 ← User (from)
├─ 1 ← User (to)
└─ 1 ← Request (request - optional)

Notification
├─ 1 ← User (user)
├─ 1 ← Request (relatedRequest - optional)
└─ 1 ← User (relatedUser - optional)
```

---

## Usage Examples

### Creating a User
```javascript
import { User } from '@/lib/models';

const newUser = await User.create({
  email: 'user@example.com',
  name: 'John Doe',
  password: 'hashed_password',
  role: 'both',
  location: 'Karachi'
});
```

### Creating a Request
```javascript
import { Request } from '@/lib/models';

const newRequest = await Request.create({
  title: 'Need help with React',
  description: 'I need help learning React hooks...',
  category: 'web',
  urgency: 'high',
  author: userId,
  tags: ['React', 'JavaScript']
});
```

### Finding Top Helpers
```javascript
const topHelpers = await User.find({ trustScore: { $gte: 80 } })
  .sort({ trustScore: -1 })
  .limit(10);
```

### Fetching User's Requests
```javascript
const userRequests = await Request.find({ author: userId })
  .populate('helpersInterested', 'name email')
  .sort({ createdAt: -1 });
```

### Recording a Contribution
```javascript
import { Contribution } from '@/lib/models';

const contribution = await Contribution.create({
  helper: helperId,
  request: requestId,
  requester: requesterId,
  status: 'completed',
  rating: 5,
  ratingFeedback: 'Very helpful!'
});
```

---

## Database Design Considerations

1. **Denormalization**: Trust score is stored on User model for faster queries
2. **Indexing**: Frequently queried fields are indexed for performance
3. **References**: Using MongoDB refs for relational integrity
4. **Timestamps**: All models include createdAt/updatedAt for auditing
5. **Validation**: Email format, length constraints, enum values
6. **Scalability**: Indexes optimized for common filter/sort operations

---

## Next Steps

1. Connect MongoDB using `mongodb.js` (already configured)
2. Implement CRUD operations in API routes
3. Add authentication middleware
4. Create data migration scripts if needed
