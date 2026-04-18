'use client';

import { useState, useEffect } from 'react';

const FALLBACK_LEADERS = [
    {
        rank: 1,
        name: 'Ayesha Khan',
        location: 'Karachi',
        trustScore: '100%',
        contributions: 35,
        badges: ['Top Mentor', 'Fast Responder', 'Design Ally'],
        helpsGiven: 35,
        avgRating: 5.0,
    },
    {
        rank: 2,
        name: 'Hamza Ali',
        location: 'Lahore',
        trustScore: '98%',
        contributions: 28,
        badges: ['Great Communicator', 'Community Builder'],
        helpsGiven: 28,
        avgRating: 4.9,
    },
    {
        rank: 3,
        name: 'Sara Iqbal',
        location: 'Islamabad',
        trustScore: '96%',
        contributions: 24,
        badges: ['Fast Responder', 'Rising Star'],
        helpsGiven: 24,
        avgRating: 4.8,
    },
    {
        rank: 4,
        name: 'Bilal Ahmed',
        location: 'Rawalpindi',
        trustScore: '95%',
        contributions: 21,
        badges: ['Top Mentor'],
        helpsGiven: 21,
        avgRating: 4.7,
    },
    {
        rank: 5,
        name: 'Fatima Noor',
        location: 'Faisalabad',
        trustScore: '94%',
        contributions: 19,
        badges: ['Helpful Ally'],
        helpsGiven: 19,
        avgRating: 4.7,
    },
];

const Leaderboard = () => {
    const [leaders, setLeaders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                setLoading(true);
                const res = await fetch('/api/users/leaderboard');

                if (!res.ok) throw new Error('Failed to fetch leaderboard');

                const data = await res.json();
                const source = Array.isArray(data) ? data : (data.users || data.data || []);

                const mappedData = source.map((user, index) => ({
                    rank: index + 1,
                    name: user.name || user.username || 'Unknown',
                    location: user.location || 'Pakistan',
                    trustScore: `${Math.round(user.trustScore || 100 - (index * 2))}%`,
                    contributions: user.contributions || 0,
                    badges: user.badges || [],
                    helpsGiven: user.contributions || 0,
                    avgRating: user.avgRating || (5 - (index * 0.1))
                }));

                setLeaders(mappedData.length > 0 ? mappedData : FALLBACK_LEADERS);
            } catch (err) {
                console.error('Error fetching leaderboard:', err);
                setLeaders(FALLBACK_LEADERS);
            } finally {
                setLoading(false);
            }
        };

        fetchLeaderboard();
    }, []);

    const displayLeaders = leaders.length > 0 ? leaders : FALLBACK_LEADERS;

    return (
        <div className="min-h-screen bg-canvas-grad">
            <main className="max-w-[1280px] mx-auto px-6 lg:px-12 py-8 space-y-8">
                {/* Hero dark card */}
                <section className="bg-secondary text-primary-foreground rounded-3xl shadow-card px-10 lg:px-14 py-12 lg:py-14">
                    <p className="text-xs font-semibold tracking-[0.25em] text-primary-foreground/60 mb-5">
                        LEADERBOARD
                    </p>
                    <h1 className="text-5xl lg:text-[64px] leading-[1.02] font-extrabold tracking-tight">
                        Top community helpers
                    </h1>
                    <p className="mt-5 text-primary-foreground/70 text-base">
                        Recognize the helpers who are making the biggest impact. Rankings based on contributions, trust score, and community feedback.
                    </p>
                </section>

                {/* Loading State */}
                {loading && (
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-card rounded-2xl shadow-card p-6 h-24 animate-pulse">
                                <div className="h-4 bg-muted w-1/4 rounded mb-2"></div>
                                <div className="h-4 bg-muted w-1/2 rounded"></div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Podium - Top 3 */}
                {!loading && displayLeaders.length > 0 && (
                    <section className="hidden lg:grid lg:grid-cols-3 gap-6 mt-12">
                        {/* 2nd place */}
                        {displayLeaders[1] && (
                            <div className="lg:h-52 bg-card rounded-2xl shadow-card p-7 flex flex-col justify-end order-first">
                                <div className="text-center">
                                    <div className="text-4xl font-bold text-gray-400 mb-2">🥈</div>
                                    <p className="text-lg font-bold text-foreground">{displayLeaders[1].name}</p>
                                    <p className="text-xs text-muted-foreground mt-1">{displayLeaders[1].location}</p>
                                    <div className="mt-3 pt-3 border-t border-border/60">
                                        <p className="text-xs text-primary font-semibold mb-1">{displayLeaders[1].contributions} Contributions</p>
                                        <p className="text-sm font-bold text-foreground">{displayLeaders[1].trustScore}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* 1st place */}
                        {displayLeaders[0] && (
                            <div className="lg:h-64 bg-gradient-to-br from-primary/20 to-primary/5 border-2 border-primary rounded-2xl shadow-lg p-7 flex flex-col justify-end">
                                <div className="text-center">
                                    <div className="text-5xl mb-2">👑</div>
                                    <p className="text-xl font-bold text-foreground">{displayLeaders[0].name}</p>
                                    <p className="text-xs text-muted-foreground mt-1">{displayLeaders[0].location}</p>
                                    <div className="mt-4 pt-4 border-t border-primary/30">
                                        <p className="text-xs text-primary font-semibold mb-1">{displayLeaders[0].contributions} Contributions</p>
                                        <p className="text-lg font-bold text-primary">{displayLeaders[0].trustScore}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* 3rd place */}
                        {displayLeaders[2] && (
                            <div className="lg:h-48 bg-card rounded-2xl shadow-card p-7 flex flex-col justify-end order-last">
                                <div className="text-center">
                                    <div className="text-4xl font-bold text-orange-600 mb-2">🥉</div>
                                    <p className="text-lg font-bold text-foreground">{displayLeaders[2].name}</p>
                                    <p className="text-xs text-muted-foreground mt-1">{displayLeaders[2].location}</p>
                                    <div className="mt-3 pt-3 border-t border-border/60">
                                        <p className="text-xs text-primary font-semibold mb-1">{displayLeaders[2].contributions} Contributions</p>
                                        <p className="text-sm font-bold text-foreground">{displayLeaders[2].trustScore}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </section>
                )}

                {/* Full Leaderboard Table */}
                {!loading && displayLeaders.length > 0 && (
                    <section className="bg-card rounded-3xl shadow-card overflow-hidden">
                        <div className="px-8 py-6 border-b border-border/60">
                            <p className="text-xs font-semibold tracking-[0.25em] text-primary mb-2">
                                RANKINGS
                            </p>
                            <h2 className="text-2xl font-bold text-foreground">All helpers</h2>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-background/40 border-b border-border/60">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-primary/80 tracking-wider">RANK</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-primary/80 tracking-wider">HELPER</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-primary/80 tracking-wider">CONTRIBUTIONS</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-primary/80 tracking-wider">TRUST SCORE</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-primary/80 tracking-wider">AVG RATING</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-primary/80 tracking-wider">BADGES</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {displayLeaders.map((leader) => (
                                        <tr key={leader.rank} className="border-b border-border/40 hover:bg-background/20 transition">
                                            <td className="px-6 py-4">
                                                <span className={`text-xl font-bold ${
                                                    leader.rank === 1 ? "text-yellow-500" :
                                                    leader.rank === 2 ? "text-gray-400" :
                                                    leader.rank === 3 ? "text-orange-600" :
                                                    "text-foreground/60"
                                                }`}>
                                                    #{leader.rank}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div>
                                                    <p className="font-semibold text-foreground">{leader.name}</p>
                                                    <p className="text-xs text-muted-foreground">{leader.location}</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="font-semibold text-foreground">{leader.contributions}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                                    leader.trustScore === "100%" ? "bg-primary/10 text-primary" :
                                                    leader.trustScore === "98%" ? "bg-primary/20 text-primary" :
                                                    "bg-primary/5 text-primary/70"
                                                }`}>
                                                    {leader.trustScore}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="font-semibold text-foreground">⭐ {leader.avgRating.toFixed(1)}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-wrap gap-1.5">
                                                    {leader.badges.length > 0 ? (
                                                        leader.badges.map((badge) => (
                                                            <span
                                                                key={badge}
                                                                className="px-2.5 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-semibold"
                                                            >
                                                                {badge}
                                                            </span>
                                                        ))
                                                    ) : (
                                                        <span className="text-xs text-muted-foreground">—</span>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>
                )}

                {/* Badge Info */}
                {!loading && (
                    <section className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
                        {[
                            { badge: "👑 Top Mentor", desc: "50+ successful contributions" },
                            { badge: "⚡ Fast Responder", desc: "Responds within 24 hours" },
                            { badge: "💬 Great Communicator", desc: "Highly rated by community" },
                            { badge: "🌟 Rising Star", desc: "Consistent quality contributions" },
                        ].map((item) => (
                            <div key={item.badge} className="bg-card rounded-2xl shadow-card p-5">
                                <p className="text-lg mb-2">{item.badge}</p>
                                <p className="text-xs text-muted-foreground">{item.desc}</p>
                            </div>
                        ))}
                    </section>
                )}
            </main>
        </div>
    );
};

export default Leaderboard;
