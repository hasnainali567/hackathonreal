'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

const TagPill = ({ label, color }) => {
    const cls =
        color === "red"
            ? "bg-tag-red-bg text-tag-red-fg"
            : color === "green"
                ? "bg-tag-green-bg text-tag-green-fg"
                : "bg-tag-teal-bg text-tag-teal-fg";
    return <span className={`px-3 py-1 rounded-full text-[11px] font-medium ${cls}`}>{label}</span>;
};

const RequestCard = ({ id, tags, title, body, chips, author, meta }) => {
    return (
        <div className="bg-card rounded-2xl p-6 shadow-card flex flex-col hover:shadow-lg transition">
            <div className="flex flex-wrap gap-2">
                {tags && tags.map((t) => (
                    <TagPill key={t.label} {...t} />
                ))}
            </div>
            <p className="font-semibold text-foreground mt-4">{title}</p>
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{body}</p>
            {chips && (
                <div className="flex flex-wrap gap-2 mt-4">
                    {chips.map((c) => (
                        <span
                            key={c}
                            className="px-3 py-1 rounded-full text-[11px] font-medium bg-tag-teal-bg/30 text-tag-teal-fg"
                        >
                            {c}
                        </span>
                    ))}
                </div>
            )}
            <div className="flex items-end justify-between mt-6 pt-2">
                <div>
                    <p className="font-semibold text-foreground text-sm">{author}</p>
                    <p className="text-xs text-muted-foreground mt-1">{meta}</p>
                </div>
                <Link href={`/request/${id}`} className="px-4 py-2 rounded-full bg-primary text-primary-foreground text-xs font-medium hover:opacity-90 transition shrink-0 inline-block">
                    View details
                </Link>
            </div>
        </div>
    )
};

const Explore = () => {
    const [filters, setFilters] = useState({ category: 'all', urgency: 'all' });
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let ignore = false;

        const fetchRequests = async () => {
            try {
                setLoading(true);
                const query = new URLSearchParams();
                if (filters.category !== 'all') query.append('category', filters.category);
                if (filters.urgency !== 'all') query.append('urgency', filters.urgency);
                query.append('limit', '10');

                const res = await fetch(`/api/requests?${query}`);
                const data = await res.json();
                if (!ignore) {
                    setRequests(data.data || []);
                    setError(null);
                }
            } catch (err) {
                if (!ignore) {
                    setError('Failed to fetch requests');
                }
                console.error(err);
            } finally {
                if (!ignore) {
                    setLoading(false);
                }
            }
        };

        fetchRequests();

        return () => {
            ignore = true;
        };
    }, [filters]);

    const handleFilterChange = (filterName, value) => {
        setFilters({ ...filters, [filterName]: value });
    };

    return (
        <div className="min-h-screen bg-canvas-grad">
            <main className="max-w-7xl mx-auto px-6 lg:px-12 py-8 space-y-8">
                {/* Hero dark card */}
                <section className="bg-secondary text-primary-foreground rounded-3xl shadow-card px-10 lg:px-14 py-12 lg:py-14">
                    <p className="text-xs font-semibold tracking-[0.25em] text-primary-foreground/60 mb-5">
                        COMMUNITY FEED
                    </p>
                    <h1 className="text-5xl lg:text-[64px] leading-[1.02] font-extrabold tracking-tight">
                        Explore help requests
                    </h1>
                    <p className="mt-5 text-primary-foreground/70 text-base">
                        Browse requests from the community. {loading ? 'Loading...' : `Found ${requests.length} requests`}
                    </p>
                </section>

                <section className="flex flex-col lg:flex-row gap-6 lg:items-start">
                    {/* Filters */}
                    <aside className="bg-card rounded-2xl shadow-card p-6 lg:p-8 lg:w-[320px] lg:shrink-0">
                        <p className="text-sm font-semibold text-foreground mb-5">FILTERS</p>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs text-foreground/60 mb-2">Category</label>
                                <select
                                    value={filters.category}
                                    onChange={(e) => handleFilterChange('category', e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-full bg-background/60 border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                                >
                                    <option value="all">All Categories</option>
                                    <option value="web">Web Development</option>
                                    <option value="mobile">Mobile Development</option>
                                    <option value="design">Design</option>
                                    <option value="backend">Backend Development</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs text-foreground/60 mb-2">Urgency</label>
                                <select
                                    value={filters.urgency}
                                    onChange={(e) => handleFilterChange('urgency', e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-full bg-background/60 border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                                >
                                    <option value="all">All Urgency</option>
                                    <option value="high">High</option>
                                    <option value="medium">Medium</option>
                                    <option value="low">Low</option>
                                </select>
                            </div>
                        </div>
                    </aside>

                    <div className="flex-1 min-w-0">
                        {/* Error State */}
                        {error && (
                            <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-red-700 mb-6">
                                {error}
                            </div>
                        )}

                        {/* Loading State */}
                        {loading && (
                            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
                                {[...Array(6)].map((_, i) => (
                                    <div key={i} className="bg-card rounded-2xl p-6 shadow-card animate-pulse">
                                        <div className="h-4 bg-background/40 rounded mb-3 w-3/4"></div>
                                        <div className="h-6 bg-background/40 rounded mb-4"></div>
                                        <div className="h-12 bg-background/40 rounded"></div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Requests grid */}
                        {!loading && (
                            <section>
                        <div className="flex items-center justify-between mb-1">
                            <p className="text-sm font-semibold text-foreground">
                                Showing {requests.length} requests
                            </p>
                        </div>

                        {requests.length === 0 ? (
                            <div className="text-center py-12">
                                <p className="text-muted-foreground">No requests found. Try adjusting your filters.</p>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-4">
                                {requests.map((request) => (
                                    <RequestCard
                                        key={request.id || request._id}
                                        id={request.id || request._id}
                                        tags={[
                                            { label: request.category || "General", color: "teal" },
                                            { label: (request.urgency || "medium").charAt(0).toUpperCase() + (request.urgency || "medium").slice(1), color: request.urgency === 'high' ? 'red' : 'teal' },
                                            { label: request.status === 'solved' ? 'Solved' : 'Open', color: request.status === 'solved' ? 'green' : 'teal' },
                                        ]}
                                        title={request.title}
                                        body={request.description || request.body}
                                        chips={request.tags}
                                        author={request.author?.name || request.author || "Anonymous"}
                                        meta={`${request.location || "Unknown"} • ${request.helpersInterested?.length || 0} helpers interested`}
                                    />
                                ))}
                            </div>
                        )}
                            </section>
                        )}
                    </div>
                </section>
            </main>
        </div>
    );
};

export default Explore;
