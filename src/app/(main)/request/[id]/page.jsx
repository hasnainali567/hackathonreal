'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';

const TagPill = ({ label, color }) => {
  const cls =
    color === "red"
      ? "bg-tag-red-bg text-tag-red-fg"
      : color === "green"
      ? "bg-tag-green-bg text-tag-green-fg"
      : "bg-tag-teal-bg text-tag-teal-fg";
  return <span className={`px-3 py-1 rounded-full text-[11px] font-medium ${cls}`}>{label}</span>;
};

const HelperCard = ({ name, location, trustScore, helps, rating, skills }) => (
  <div className="bg-background/40 border border-border/60 rounded-2xl p-5">
    <div className="flex items-start justify-between mb-4">
      <div>
        <p className="font-semibold text-foreground">{name}</p>
        <p className="text-xs text-muted-foreground mt-1">{location}</p>
      </div>
      <span className="px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">{trustScore}</span>
    </div>

    <div className="grid grid-cols-2 gap-3 py-3 border-y border-border/40">
      <div>
        <p className="text-xs text-muted-foreground">Helps given</p>
        <p className="text-sm font-bold text-foreground">{helps}</p>
      </div>
      <div>
        <p className="text-xs text-muted-foreground">Avg rating</p>
        <p className="text-sm font-bold text-foreground">⭐ {rating}</p>
      </div>
    </div>

    <div className="mt-4">
      <p className="text-xs text-muted-foreground mb-2">Skills</p>
      <div className="flex flex-wrap gap-1.5">
        {skills.map((skill) => (
          <span key={skill} className="px-2 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-semibold">
            {skill}
          </span>
        ))}
      </div>
    </div>

    <button className="w-full mt-4 px-4 py-2 rounded-full bg-primary text-primary-foreground text-xs font-medium hover:opacity-90 transition">
      I can help
    </button>
  </div>
);

const RequestDetail = () => {
  const params = useParams();
  const requestId = params?.id;
  
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!requestId) return;

    const fetchRequest = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/requests/${requestId}`);
        console.log(res);
        
        const data = await res.json();
        
        if (!res.ok) {
          throw new Error(data?.error || (res.status === 404 ? 'Request not found' : 'Failed to fetch request'));
        }
        
        // Map API response to component structure
        setRequest({
          title: data.title || 'Untitled Request',
          description: data.description || '',
          tags: [
            { label: data.category || 'General', color: 'teal' },
            { label: data.urgency ? data.urgency.charAt(0).toUpperCase() + data.urgency.slice(1) : 'Medium', 
              color: data.urgency === 'high' ? 'red' : data.urgency === 'low' ? 'green' : 'teal' },
            { label: data.status || 'Open', color: 'teal' },
          ],
          author: data.author || 'Anonymous',
          location: data.location || 'Pakistan',
          postedTime: data.createdAt ? new Date(data.createdAt).toLocaleDateString() : 'Recently',
          views: data.views || 0,
          helpers: data.interestedHelpers?.length || 0,
          chips: data.tags || [],
          aiSummary: data.aiSummary || 'AI summary not available yet.',
          helpers: (data.interestedHelpers || []).map((h) => ({
            name: h.name || 'Helper',
            location: h.location || 'Pakistan',
            trustScore: `${h.trustScore || 100}%`,
            helps: h.contributions || 0,
            rating: h.avgRating || 4.5,
            skills: h.skills || [],
          })),
          status: data.status || 'Open',
          urgency: data.urgency || 'medium',
        });
      } catch (err) {
        console.error('Error fetching request:', err);
        setError(err.message || 'Failed to load request details');
      } finally {
        setLoading(false);
      }
    };

    fetchRequest();
  }, [requestId]);

  return (
    <div className="min-h-screen bg-canvas-grad">
      <main className="max-w-[1280px] mx-auto px-6 lg:px-12 py-8 space-y-8">
        {/* Loading State */}
        {loading && (
          <div className="space-y-4">
            <div className="bg-secondary rounded-3xl shadow-card p-10 h-48 animate-pulse">
              <div className="h-8 bg-primary-foreground/20 w-3/4 rounded mb-3"></div>
              <div className="h-4 bg-primary-foreground/10 w-1/2 rounded"></div>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-red-700">
            ❌ {error}
          </div>
        )}

        {/* Content */}
        {!loading && request && (
          <>
            {/* Hero dark card with request title */}
            <section className="bg-secondary text-primary-foreground rounded-3xl shadow-card px-10 lg:px-14 py-12 lg:py-14">
              <div className="flex flex-wrap gap-2 mb-6">
                {request.tags.map((t) => (
                  <TagPill key={t.label} {...t} />
                ))}
              </div>
              <h1 className="text-5xl lg:text-[64px] leading-[1.02] font-extrabold tracking-tight">
                {request.title}
              </h1>
              <div className="mt-6 flex flex-wrap gap-6 text-primary-foreground/70">
                <div>
                  <p className="text-xs text-primary-foreground/60">POSTED BY</p>
                  <p className="text-sm font-semibold">{request.author}</p>
                  <p className="text-xs mt-1">{request.location} • {request.postedTime}</p>
                </div>
                <div>
                  <p className="text-xs text-primary-foreground/60">ENGAGEMENT</p>
                  <p className="text-sm font-semibold">{request.views} views • {request.helpers} interested</p>
                </div>
              </div>
            </section>

            {/* Two column layout */}
            <section className="grid lg:grid-cols-3 gap-8">
              {/* Main content - 2 columns */}
              <div className="lg:col-span-2 space-y-8">
                {/* Full description */}
                <div className="bg-card rounded-3xl shadow-card p-10 lg:p-12">
                  <p className="text-xs font-semibold tracking-[0.25em] text-primary mb-5">
                    REQUEST DETAILS
                  </p>
                  <h2 className="text-2xl font-bold text-foreground mb-5">Full description</h2>
                  <p className="text-foreground/80 leading-relaxed whitespace-pre-line text-sm">
                    {request.description}
                  </p>

                  <div className="mt-8 pt-6 border-t border-border/60">
                    <p className="text-xs font-semibold text-foreground mb-3">Tags</p>
                    <div className="flex flex-wrap gap-2">
                      {request.chips.map((chip) => (
                        <span
                          key={chip}
                          className="px-3 py-1.5 rounded-full text-[11px] font-medium bg-tag-teal-bg/30 text-tag-teal-fg"
                        >
                          {chip}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* AI Summary */}
                <div className="bg-card rounded-3xl shadow-card p-10 lg:p-12">
                  <p className="text-xs font-semibold tracking-[0.25em] text-primary mb-5">
                    AI SUMMARY
                  </p>
                  <h2 className="text-2xl font-bold text-foreground mb-5">AI Insights</h2>
                  <div className="bg-background/40 border border-border/60 rounded-2xl p-6">
                    <p className="text-foreground/80 leading-relaxed text-sm">
                      {request.aiSummary}
                    </p>
                  </div>
                </div>

                {/* Helper list */}
                {request.helpers.length > 0 && (
                  <div className="bg-card rounded-3xl shadow-card p-10 lg:p-12">
                    <div className="mb-8">
                      <p className="text-xs font-semibold tracking-[0.25em] text-primary mb-5">
                        INTERESTED HELPERS
                      </p>
                      <h2 className="text-2xl font-bold text-foreground">
                        {request.helpers.length} helpers want to assist
                      </h2>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      {request.helpers.map((helper) => (
                        <HelperCard key={helper.name} {...helper} />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar - 1 column */}
              <div className="space-y-5">
                {/* Action buttons */}
                <div className="bg-card rounded-3xl shadow-card p-7 space-y-3">
                  <button className="w-full px-6 py-4 rounded-full bg-primary text-primary-foreground font-semibold text-base hover:opacity-90 transition shadow-soft">
                    I can help
                  </button>
                  <button className="w-full px-6 py-4 rounded-full bg-foreground text-background font-semibold text-base hover:opacity-90 transition">
                    Contact requester
                  </button>
                  <button className="w-full px-6 py-4 rounded-full bg-background border border-border text-foreground font-semibold text-base hover:bg-background/80 transition">
                    Mark as solved
                  </button>
                </div>

                {/* Request stats */}
                <div className="bg-card rounded-3xl shadow-card p-7 space-y-4">
                  <div className="text-center py-3 border-b border-border/40">
                    <p className="text-xs text-primary font-semibold mb-1">REQUEST STATUS</p>
                    <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                      {request.status}
                    </span>
                  </div>

                  <div className="text-center py-3 border-b border-border/40">
                    <p className="text-xs text-primary font-semibold mb-1">URGENCY</p>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      request.urgency === 'high' ? 'bg-tag-red-bg text-tag-red-fg' :
                      request.urgency === 'low' ? 'bg-tag-green-bg text-tag-green-fg' :
                      'bg-tag-teal-bg text-tag-teal-fg'
                    }`}>
                      {request.urgency.charAt(0).toUpperCase() + request.urgency.slice(1)}
                    </span>
                  </div>

                  <div className="text-center py-3">
                    <p className="text-xs text-primary font-semibold mb-1">BEST FOR</p>
                    <p className="text-sm text-foreground">Experts interested in {request.tags[0]?.label}</p>
                  </div>
                </div>

                {/* Share */}
                <div className="bg-card rounded-3xl shadow-card p-7">
                  <p className="text-xs font-semibold tracking-[0.25em] text-primary mb-4">SHARE</p>
                  <div className="space-y-2">
                    <button className="w-full px-4 py-2 rounded-full bg-background border border-border text-foreground text-sm font-medium hover:bg-background/80 transition">
                      Share
                    </button>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}

        {/* No data state */}
        {!loading && !request && !error && (
          <div className="bg-card rounded-2xl shadow-card p-12 text-center">
            <p className="text-lg text-muted-foreground">Request not found.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default RequestDetail;
