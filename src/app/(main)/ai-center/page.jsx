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

const urgencyWeight = { high: 92, medium: 74, low: 58 };

const buildAiSignals = (request) => {
    const urgency = request.urgency || 'medium';
    const helpers = request.helpersInterested?.length || 0;
    const titleLengthBoost = Math.min((request.title || '').length / 8, 10);
    const confidence = Math.min(98, Math.round((urgencyWeight[urgency] || 70) + helpers * 2 + titleLengthBoost));
    const helperMatch = Math.max(20, Math.min(99, Math.round(55 + helpers * 9 + (request.category === 'web' ? 6 : 0))));

    const reasons = [
        `${toTitleCase(urgency)} urgency signal detected`,
        `${toTitleCase(request.category || 'general')} category trend is active`,
        `${helpers} helper interest ${helpers === 1 ? 'signal' : 'signals'} recorded`
    ];

    return { confidence, helperMatch, reasons };
};

const isValidObjectId = (value) => /^[a-f0-9]{24}$/i.test(String(value || ''));

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
    const openRequests = requests.filter((req) => (req.status || 'open') === 'open').length;
    const modelHealth = helperCount > 0 ? 'Stable' : 'Cold Start';
    const modelVersion = 'Assist-Lite v0.9';
    const lastInference = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

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

                <section className="grid lg:grid-cols-[1.1fr_1fr] gap-5">
                    <div className="bg-card rounded-2xl shadow-card p-6 lg:p-8">
                        <p className="text-xs font-semibold tracking-[0.2em] text-primary mb-4">MODEL SNAPSHOT</p>
                        <h3 className="text-2xl font-bold text-foreground">{modelVersion}</h3>
                        <p className="text-sm text-muted-foreground mt-2">
                            Lightweight scoring mode is active. Signals are generated from urgency, category frequency, request freshness, and helper activity.
                        </p>
                        <div className="grid grid-cols-3 gap-3 mt-6">
                            <div className="bg-background/50 rounded-xl p-3 border border-border/60">
                                <p className="text-[10px] tracking-[0.18em] text-primary">HEALTH</p>
                                <p className="text-sm font-semibold text-foreground mt-1">{modelHealth}</p>
                            </div>
                            <div className="bg-background/50 rounded-xl p-3 border border-border/60">
                                <p className="text-[10px] tracking-[0.18em] text-primary">OPEN REQUESTS</p>
                                <p className="text-sm font-semibold text-foreground mt-1">{openRequests}</p>
                            </div>
                            <div className="bg-background/50 rounded-xl p-3 border border-border/60">
                                <p className="text-[10px] tracking-[0.18em] text-primary">LAST INFERENCE</p>
                                <p className="text-sm font-semibold text-foreground mt-1">{lastInference}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-card rounded-2xl shadow-card p-6 lg:p-8">
                        <p className="text-xs font-semibold tracking-[0.2em] text-primary mb-4">AI LOGIC HINTS</p>
                        <div className="space-y-3">
                            {[
                                `Prioritize ${toTitleCase(topCategory)} requests with high urgency first`,
                                `Escalate requests with low helper interest but high urgency`,
                                `Boost matching for users tagged as can-help and both`
                            ].map((tip) => (
                                <div key={tip} className="rounded-xl bg-background/50 border border-border/60 px-4 py-3">
                                    <p className="text-xs text-muted-foreground leading-relaxed">{tip}</p>
                                </div>
                            ))}
                        </div>
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
                        {recommendations.map((request) => {
                            const signals = buildAiSignals(request);
                            const requestId = request._id?.toString() || request.id;
                            const canOpenRequest = isValidObjectId(requestId);
                            const requestLink = canOpenRequest ? `/request/${requestId}` : '/explore';

                            return (
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
                                    <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">AI confidence {signals.confidence}%</span>
                                </div>

                                <div className="mt-4 grid md:grid-cols-2 gap-4">
                                    <div className="bg-background/70 rounded-xl border border-border/60 px-4 py-3">
                                        <p className="text-[10px] tracking-[0.18em] text-primary mb-2">WHY THIS WAS PRIORITIZED</p>
                                        <div className="flex flex-wrap gap-2">
                                            {signals.reasons.map((reason) => (
                                                <span key={reason} className="px-2.5 py-1 rounded-full bg-card border border-border/70 text-[10px] text-foreground/80">
                                                    {reason}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="bg-background/70 rounded-xl border border-border/60 px-4 py-3">
                                        <p className="text-[10px] tracking-[0.18em] text-primary mb-2">HELPER MATCH SCORE</p>
                                        <div className="h-2.5 rounded-full bg-muted overflow-hidden">
                                            <div
                                                className="h-full bg-linear-to-r from-primary/70 to-primary"
                                                style={{ width: `${signals.helperMatch}%` }}
                                            />
                                        </div>
                                        <p className="text-xs text-muted-foreground mt-2">{signals.helperMatch}% estimated helper compatibility</p>
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <Link
                                        href={requestLink}
                                        className="inline-flex items-center px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition"
                                    >
                                        {canOpenRequest ? 'Open request' : 'View similar requests'}
                                    </Link>
                                </div>
                            </div>
                        )})}
                    </div>
                </section>
            </main>
        </div>
    );
};

export default AICenter;
