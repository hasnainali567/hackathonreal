import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongoose';
import Request from '@/lib/models/Request';

const sampleRequests = [
    {
        title: "Need help with React hooks implementation",
        description: "I'm struggling to understand useContext and useReducer. Can someone explain with a practical example?",
        category: "web",
        urgency: "high",
        tags: ["React", "Hooks", "JavaScript"],
        authorName: "Ali Hassan",
        location: "Karachi",
        status: "open"
    },
    {
        title: "Backend API design best practices",
        description: "Looking for guidance on structuring REST APIs for scalability. What are the best practices?",
        category: "backend",
        urgency: "medium",
        tags: ["REST API", "Node.js", "Architecture"],
        authorName: "Sara Khan",
        location: "Islamabad",
        status: "open"
    },
    {
        title: "Mobile app UI/UX feedback needed",
        description: "Built a fitness tracking app and need design feedback. Specifically about the onboarding flow.",
        category: "design",
        urgency: "low",
        tags: ["UI/UX", "Mobile", "Design"],
        authorName: "Hamza Ahmed",
        location: "Lahore",
        status: "open"
    },
    {
        title: "Python data processing optimization",
        description: "Processing large CSV files takes too long. Need help optimizing pandas operations.",
        category: "backend",
        urgency: "high",
        tags: ["Python", "Pandas", "Performance"],
        authorName: "Fatima Ali",
        location: "Rawalpindi",
        status: "open"
    },
    {
        title: "Career guidance: Frontend vs Full-stack",
        description: "Starting my tech career and confused between specializing in frontend or becoming full-stack. Advice?",
        category: "career",
        urgency: "medium",
        tags: ["Career", "Learning Path"],
        authorName: "Hassan Khan",
        location: "Karachi",
        status: "open"
    },
    {
        title: "TypeScript generics explained",
        description: "Can someone help me understand how to use TypeScript generics effectively in real projects?",
        category: "web",
        urgency: "low",
        tags: ["TypeScript", "Generics"],
        authorName: "Ayesha Malik",
        location: "Islamabad",
        status: "open"
    }
];

export async function POST() {
    try {
        await connectDB();
        
        // Clear existing requests
        await Request.deleteMany({});
        
        // Create new sample requests
        const created = await Request.insertMany(sampleRequests);
        
        return NextResponse.json({
            success: true,
            message: `Created ${created.length} sample requests`,
            data: created
        }, { status: 201 });
    } catch (error) {
        console.error('Seed error:', error);
        return NextResponse.json(
            { error: error.message || "Failed to seed data" },
            { status: 500 }
        );
    }
}

export async function GET() {
    try {
        await connectDB();
        const count = await Request.countDocuments();
        
        return NextResponse.json({
            success: true,
            totalRequests: count,
            message: count === 0 ? 'No requests found. POST to /api/requests/seed to create sample data.' : `${count} requests in database`
        });
    } catch (error) {
        return NextResponse.json(
            { error: error.message || "Failed to check requests" },
            { status: 500 }
        );
    }
}
