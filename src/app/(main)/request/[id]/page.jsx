'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

const normalizeRole = (role) => {
  if (!role) return 'both';
  const normalized = String(role).toLowerCase();
  if (normalized.includes('need')) return 'need-help';
  if (normalized.includes('can')) return 'can-help';
  return 'both';
};

const formatTimeAgo = (value) => {
  if (!value) return 'Recently';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Recently';

  const diffMs = Date.now() - date.getTime();
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (diffMs < minute) return 'Just now';
  if (diffMs < hour) return `${Math.floor(diffMs / minute)}m ago`;
  if (diffMs < day) return `${Math.floor(diffMs / hour)}h ago`;
  if (diffMs < 7 * day) return `${Math.floor(diffMs / day)}d ago`;
  return date.toLocaleDateString();
};

const TagPill = ({ label, color }) => {
  const cls =
    color === "red"
      ? "bg-tag-red-bg text-tag-red-fg"
      : color === "green"
      ? "bg-tag-green-bg text-tag-green-fg"
      : "bg-tag-teal-bg text-tag-teal-fg";
  return <span className={`px-3 py-1 rounded-full text-[11px] font-medium ${cls}`}>{label}</span>;
};

const HelperCard = ({ name, location, trustScore, helps, rating, skills, onMessageHelper }) => (
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

    <button
      onClick={onMessageHelper}
      className="w-full mt-4 px-4 py-2 rounded-full bg-primary text-primary-foreground text-xs font-medium hover:opacity-90 transition"
    >
      Message helper
    </button>
  </div>
);

const mapRequestForView = (data) => ({
  title: data.title || 'Untitled Request',
  description: data.description || '',
  tags: [
    { label: data.category || 'General', color: 'teal' },
    {
      label: data.urgency ? data.urgency.charAt(0).toUpperCase() + data.urgency.slice(1) : 'Medium',
      color: data.urgency === 'high' ? 'red' : data.urgency === 'low' ? 'green' : 'teal'
    },
    { label: data.status || 'Open', color: 'teal' },
  ],
  author: typeof data.author === 'object' ? (data.author?.name || 'Anonymous') : (data.author || 'Anonymous'),
  authorName: typeof data.author === 'object' ? data.author?.name : data.author,
  authorEmail: typeof data.author === 'object' ? data.author?.email || '' : '',
  location: data.location || 'Pakistan',
  createdAt: data.createdAt || null,
  postedTime: formatTimeAgo(data.createdAt),
  views: data.views || 0,
  helpersCount: data.interestedHelpers?.length || data.helpersInterested?.length || 0,
  chips: data.tags || [],
  aiSummary: data.aiSummary || 'AI summary not available yet.',
  helpers: (data.interestedHelpers || data.helpersInterested || []).map((h) => ({
    id: h._id?.toString?.() || h._id || '',
    email: h.email || '',
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

const RequestDetail = () => {
  const params = useParams();
  const router = useRouter();
  const requestId = params?.id;
  
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState('');

  useEffect(() => {
    try {
      const stored = localStorage.getItem('user');
      if (!stored) return;
      setCurrentUser(JSON.parse(stored));
    } catch (err) {
      console.error('Failed to parse current user:', err);
    }
  }, []);

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

        setRequest(mapRequestForView(data));
      } catch (err) {
        console.error('Error fetching request:', err);
        setError(err.message || 'Failed to load request details');
      } finally {
        setLoading(false);
      }
    };

    fetchRequest();
  }, [requestId]);

  useEffect(() => {
    if (!request?.createdAt) return;

    const timer = setInterval(() => {
      setRequest((prev) => (prev ? { ...prev, postedTime: formatTimeAgo(prev.createdAt) } : prev));
    }, 60 * 1000);

    return () => clearInterval(timer);
  }, [request?.createdAt]);

  const role = normalizeRole(currentUser?.role);
  const currentName = String(currentUser?.name || '').toLowerCase();
  const currentEmail = String(currentUser?.email || '').toLowerCase();
  const authorName = String(request?.authorName || '').toLowerCase();
  const authorEmail = String(request?.authorEmail || '').toLowerCase();
  const isOwner = Boolean(
    (currentEmail && authorEmail && currentEmail === authorEmail) ||
    (currentName && authorName && currentName === authorName)
  );
  const canHelp = role === 'can-help' || role === 'both';
  const canRequestHelp = role === 'need-help' || role === 'both';
  const hasExpressedInterest = Boolean(
    currentUser?.email && request?.helpers?.some((helper) => (helper.email || '').toLowerCase() === currentUser.email.toLowerCase())
  );

  const handleCanHelp = async () => {
    if (!currentUser?.email || !requestId) {
      setActionMessage('Sign in with a valid account to help on requests.');
      return;
    }

    if (hasExpressedInterest) {
      setActionMessage('You already marked interest on this request.');
      return;
    }

    setActionLoading(true);
    setActionMessage('');

    try {
      const res = await fetch(`/api/requests/${requestId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'add_helper',
          helperEmail: currentUser.email,
          helperName: currentUser.name,
        })
      });

      const payload = await res.json();
      if (!res.ok) {
        throw new Error(payload.error || 'Failed to register helper interest');
      }

      if (payload?.data) {
        setRequest(mapRequestForView(payload.data));
      }
      setActionMessage('Great! You are now marked as interested to help.');
    } catch (err) {
      setActionMessage(err.message || 'Failed to register helper interest');
    } finally {
      setActionLoading(false);
    }
  };

  const handleMarkAsSolved = async () => {
    if (!requestId || !currentUser) {
      setActionMessage('Sign in to update request status.');
      return;
    }

    setActionLoading(true);
    setActionMessage('');

    try {
      const res = await fetch(`/api/requests/${requestId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'solved',
          actorEmail: currentUser.email,
          actorName: currentUser.name,
        })
      });

      const payload = await res.json();
      if (!res.ok) {
        throw new Error(payload.error || 'Failed to mark request as solved');
      }

      if (payload?.data) {
        setRequest(mapRequestForView(payload.data));
      }
      setActionMessage('Request marked as solved.');
    } catch (err) {
      setActionMessage(err.message || 'Failed to mark request as solved');
    } finally {
      setActionLoading(false);
    }
  };

  const handleContactRequester = () => {
    const requesterEmail = String(request?.authorEmail || '').trim().toLowerCase();
    const requesterName = String(request?.author || '').trim();

    if (!requesterEmail) {
      setActionMessage('Requester contact is not available for this request.');
      return;
    }

    const params = new URLSearchParams({
      toEmail: requesterEmail,
      toName: requesterName || 'Requester',
    });

    router.push(`/messages?${params.toString()}`);
  };

  const handleMessageHelper = (helper) => {
    const helperEmail = String(helper?.email || '').trim().toLowerCase();
    const helperName = String(helper?.name || '').trim();
    const currentEmailValue = String(currentUser?.email || '').trim().toLowerCase();

    if (!helperEmail) {
      setActionMessage('Helper contact is not available.');
      return;
    }

    if (currentEmailValue && helperEmail === currentEmailValue) {
      setActionMessage('You cannot message yourself.');
      return;
    }

    const params = new URLSearchParams({
      toEmail: helperEmail,
      toName: helperName || 'Helper',
    });

    router.push(`/messages?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-canvas-grad">
      <main className="max-w-7xl mx-auto px-6 lg:px-12 py-8 space-y-8">
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
                    <p className="text-sm font-semibold">{request.views} views • {request.helpersCount} interested</p>
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
                        <HelperCard
                          key={`${helper.email || helper.name}`}
                          {...helper}
                          onMessageHelper={() => handleMessageHelper(helper)}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar - 1 column */}
              <div className="space-y-5">
                {/* Action buttons */}
                <div className="bg-card rounded-3xl shadow-card p-7 space-y-3">
                  {!currentUser && (
                    <button className="w-full px-6 py-4 rounded-full bg-background border border-border text-foreground font-semibold text-base opacity-70 cursor-not-allowed">
                      Sign in to take action
                    </button>
                  )}

                  {currentUser && !isOwner && canHelp && (
                    <button
                      onClick={handleCanHelp}
                      disabled={actionLoading || hasExpressedInterest}
                      className="w-full px-6 py-4 rounded-full bg-primary text-primary-foreground font-semibold text-base hover:opacity-90 transition shadow-soft disabled:opacity-60"
                    >
                      {actionLoading ? 'Updating...' : hasExpressedInterest ? 'Already helping' : 'I can help'}
                    </button>
                  )}

                  {currentUser && !isOwner && (
                    <button
                      onClick={handleContactRequester}
                      className="w-full px-6 py-4 rounded-full bg-foreground text-background font-semibold text-base hover:opacity-90 transition"
                    >
                      Contact requester
                    </button>
                  )}

                  {currentUser && isOwner && canRequestHelp && request.status !== 'solved' && (
                    <button
                      onClick={handleMarkAsSolved}
                      disabled={actionLoading}
                      className="w-full px-6 py-4 rounded-full bg-background border border-border text-foreground font-semibold text-base hover:bg-background/80 transition disabled:opacity-60"
                    >
                      {actionLoading ? 'Updating...' : 'Mark as solved'}
                    </button>
                  )}

                  {currentUser && isOwner && request.status === 'solved' && (
                    <button className="w-full px-6 py-4 rounded-full bg-tag-green-bg text-tag-green-fg font-semibold text-base cursor-default">
                      Solved
                    </button>
                  )}

                  {actionMessage && (
                    <p className="text-xs text-muted-foreground px-2 pt-1">{actionMessage}</p>
                  )}
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
