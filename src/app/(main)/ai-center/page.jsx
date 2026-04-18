import Link from 'next/link';
import { connectDB } from '@/lib/mongoose';
import Request from '@/lib/models/Request';
import User from '@/lib/models/User';

export const dynamic = 'force-dynamic';

const FALLBACK_REQUESTS = [
    {
        _id: 'fallback-ai-1',
        title: 'Need help making my portfolio responsive before demo day',
        description: 'Responsive layout issue with a short deadline. Need help with CSS grid and breakpoints.',
        category: 'web',
        urgency: 'high',
        status: 'open'
    },
    {
        _id: 'fallback-ai-2',
        title: 'Looking for Figma feedback on a volunteer event poster',
        description: 'Need design critique on hierarchy, spacing, and messaging clarity for a community poster.',
        category: 'design',
        urgency: 'medium',
        status: 'open'
    }
];

const urgencyBadgeClass = (urgency) => {
    if (urgency === 'high') return 'bg-tag-red-bg text-tag-red-fg';
    if (urgency === 'low') return 'bg-tag-green-bg text-tag-green-fg';
    return 'bg-tag-teal-bg text-tag-teal-fg';
};

const toTitleCase = (value) => {
    if (!value) return 'General';
    return value.charAt(0).toUpperCase() + value.slice(1);
};

const AICenter = async () => {
    await connectDB();

    const [requestsFromDb, helperCount] = await Promise.all([
        Request.find({})
            .sort({ urgency: -1, createdAt: -1 })
            .limit(6)
            .lean(),
        User.countDocuments({ role: { $in: ['can-help', 'both'] }, isActive: true })
    ]);

    const requests = requestsFromDb.length > 0 ? requestsFromDb : FALLBACK_REQUESTS;
    const recommendations = requests.slice(0, 4);

    const trendMap = requests.reduce((acc, req) => {
        const key = req.category || 'general';
        acc[key] = (acc[key] || 0) + 1;
        return acc;
    }, {});

    const topCategory = Object.entries(trendMap).sort((a, b) => b[1] - a[1])[0]?.[0] || 'general';
    const highUrgencyCount = requests.filter((req) => req.urgency === 'high').length;

    return (
        <div className="min-h-screen bg-canvas-grad">
            <main className="max-w-7xl mx-auto px-6 lg:px-12 py-8 space-y-8">
                <section className="bg-secondary text-primary-foreground rounded-3xl shadow-card px-10 lg:px-14 py-12 lg:py-14">
                    <p className="text-xs font-semibold tracking-[0.25em] text-primary-foreground/60 mb-5">
                        AI CENTER
                    </p>
                    <h1 className="text-5xl lg:text-[64px] leading-[1.02] font-extrabold tracking-tight">
                        See what the platform intelligence is noticing.
                    </h1>
                    <p className="mt-5 text-primary-foreground/70 text-base">
                        AI-like insights summarize demand trends, helper readiness, urgency signals, and request recommendations.
                    </p>
                </section>

                <section className="grid md:grid-cols-3 gap-5">
                    <div className="bg-card rounded-2xl shadow-card p-6">
                        <p className="text-xs font-semibold tracking-[0.2em] text-primary mb-3">TREND PULSE</p>
                        <h3 className="text-3xl font-bold text-foreground">{toTitleCase(topCategory)}</h3>
                        <p className="text-sm text-muted-foreground mt-2 leading-relaxed">Most common support area based on active community requests.</p>
                    </div>

                    <div className="bg-card rounded-2xl shadow-card p-6">
                        <p className="text-xs font-semibold tracking-[0.2em] text-primary mb-3">URGENCY WATCH</p>
                        <h3 className="text-3xl font-bold text-foreground">{highUrgencyCount}</h3>
                        <p className="text-sm text-muted-foreground mt-2 leading-relaxed">Requests currently flagged high priority by the urgency detector.</p>
                    </div>

                    <div className="bg-card rounded-2xl shadow-card p-6">
                        <p className="text-xs font-semibold tracking-[0.2em] text-primary mb-3">MENTOR POOL</p>
                        <h3 className="text-3xl font-bold text-foreground">{helperCount}</h3>
                        <p className="text-sm text-muted-foreground mt-2 leading-relaxed">Trusted helpers with strong response history and contribution signals.</p>
                    </div>
                </section>

                <section className="bg-card rounded-3xl shadow-card p-10 lg:p-12">
                    <p className="text-xs font-semibold tracking-[0.25em] text-primary mb-5">
                        AI RECOMMENDATIONS
                    </p>
                    <h2 className="text-3xl lg:text-[42px] font-extrabold text-foreground tracking-tight">
                        Requests needing attention
                    </h2>

                    <div className="mt-8 space-y-4">
                        {recommendations.map((request) => (
                            <div key={request._id?.toString() || request.id} className="bg-background/40 border border-border/60 rounded-2xl p-6">
                                <p className="font-semibold text-foreground text-sm">{request.title || 'Need help'}</p>
                                <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                                    {request.aiSummary || request.description || 'This request is currently active and may benefit from quick community attention.'}
                                </p>
                                <div className="flex flex-wrap items-center gap-2 mt-3">
                                    <span className="px-3 py-1 rounded-full bg-tag-teal-bg text-tag-teal-fg text-xs font-medium">{toTitleCase(request.category || 'general')}</span>
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${urgencyBadgeClass(request.urgency)}`}>
                                        {toTitleCase(request.urgency || 'medium')}
                                    </span>
                                    <span className="px-3 py-1 rounded-full bg-tag-teal-bg text-tag-teal-fg text-xs font-medium">{toTitleCase(request.status || 'open')}</span>
                                </div>
                                <div className="mt-4">
                                    <Link
                                        href={`/request/${request._id?.toString() || request.id || 'fallback-ai-1'}`}
                                        className="inline-flex items-center px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition"
                                    >
                                        Open request
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </main>
        </div>
    );
};

export default AICenter;
