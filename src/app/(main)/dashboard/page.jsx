
import Link from "next/link";
import { Suspense } from "react";
import { connectDB } from '@/lib/mongoose';
import Request from '@/lib/models/Request';

export const dynamic = 'force-dynamic';

const Hero = () => (
  <section className="grid lg:grid-cols-[1.35fr_1fr] gap-6 px-6 lg:px-12 mt-8 ">
    {/* Left light card */}
    <div className="bg-card rounded-3xl shadow-card p-10 lg:p-14 bg-linear-to-br from-neutral to-neutral/80">
      <p className="text-xs font-semibold tracking-[0.2em] text-primary mb-6">
        SMIT GRAND CODING NIGHT 2026
      </p>
      <h1 className="text-5xl lg:text-[64px] leading-[1.02] font-extrabold text-foreground tracking-tight">
        Find help faster.
        <br />
        Become help that
        <br />
        matters.
      </h1>
      <p className="mt-7 text-muted-foreground text-[15px] max-w-lg leading-relaxed">
        HelpHub AI is a community-powered support network for students, mentors,
        creators, and builders. Ask for help, offer help, track impact, and let AI surface
        smarter matches across the platform.
      </p>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/ai-center" className="px-6 py-3 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition inline-block">
          AI Center
        </Link>
        <Link href="/create-request" className="px-6 py-3 rounded-full bg-foreground text-background text-sm font-medium hover:opacity-90 transition inline-block">
          Post a request
        </Link>
      </div>

      <div className="mt-12 grid grid-cols-3 gap-4">
        {[
          { label: "MEMBERS", value: "384+", desc: "Students, mentors, and helpers in the loop." },
          { label: "REQUESTS", value: "72+", desc: "Support posts shared across learning journeys." },
          { label: "SOLVED", value: "69+", desc: "Problems resolved through fast community action." },
        ].map((s) => (
          <div key={s.label} className="bg-background/70 rounded-2xl p-5 border border-border/60">
            <p className="text-[11px] font-semibold tracking-[0.18em] text-primary">{s.label}</p>
            <p className="text-3xl font-bold text-foreground mt-2">{s.value}</p>
            <p className="text-xs text-muted-foreground mt-3 leading-relaxed">{s.desc}</p>
          </div>
        ))}
      </div>
    </div>

    {/* Right dark card */}
    <div className="relative bg-secondary text-white rounded-3xl shadow-card p-8 lg:p-10 overflow-hidden">
      <div className="absolute top-6 right-6 h-24 w-24 rounded-full bg-amber-200/25 blur-xl pointer-events-none" />
      <div
        className="absolute top-8 right-8 h-16 w-16 rounded-full orb-yellow shadow-lg border border-amber-100/40 z-10 pointer-events-none"
        aria-hidden="true"
      />
      <p className="text-xs font-semibold tracking-[0.2em] text-primary mb-5">LIVE PRODUCT FEEL</p>
      <h2 className="text-3xl lg:text-[40px] leading-[1.05] font-extrabold tracking-tight">
        More than a form.
        <br />
        More like an
        <br />
        ecosystem.
      </h2>
      <p className="mt-5 text-sm text-dark-card-foreground/70 leading-relaxed">
        A polished multi-page experience inspired by product platforms, with AI summaries,
        trust scores, contribution signals, notifications, and leaderboard momentum built
        directly in HTML, CSS, JavaScript, and LocalStorage.
      </p>

      <div className="mt-7 space-y-3">
        {[
          {
            t: "AI request intelligence",
            d: "Auto-categorization, urgency detection, tags, rewrite suggestions, and trend snapshots.",
          },
          {
            t: "Community trust graph",
            d: "Badges, helper rankings, trust score boosts, and visible contribution history.",
          },
          {
            t: "100%",
            d: "Top trust score currently active across the sample mentor network.",
          },
        ].map((b) => (
          <div key={b.t} className="bg-neutral text-secondary-foreground rounded-2xl p-5">
            <p className="font-semibold text-[15px]">{b.t}</p>
            <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{b.d}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const CoreFlow = () => (
  <section className="px-6 lg:px-12 mt-24">
    <p className="text-xs font-semibold tracking-[0.2em] text-primary">CORE FLOW</p>
    <div className="flex flex-wrap items-end justify-between gap-4 mt-3">
      <h2 className="text-3xl lg:text-[42px] font-extrabold text-foreground tracking-tight">
        From struggling alone to solving together
      </h2>
      <Link href="/create-request" className="px-5 py-2.5 rounded-full bg-card border border-border text-sm font-medium hover:bg-secondary transition inline-block">
        Start now
      </Link>
    </div>

    <div className="grid md:grid-cols-3 gap-5 mt-8">
      {[
        {
          t: "Ask for help clearly",
          d: "Create structured requests with category, urgency, AI suggestions, and tags that attract the right people.",
        },
        {
          t: "Discover the right people",
          d: "Use the explore feed, helper lists, notifications, and messaging to move quickly once a match happens.",
        },
        {
          t: "Track real contribution",
          d: "Trust scores, badges, solved requests, and rankings help the community recognize meaningful support.",
        },
      ].map((c) => (
        <div key={c.t} className="bg-neutral rounded-2xl p-7 shadow-card">
          <p className="font-semibold text-foreground text-[15px]">{c.t}</p>
          <p className="text-sm text-muted-foreground mt-3 leading-relaxed">{c.d}</p>
        </div>
      ))}
    </div>
  </section>
);

const TagPill = ({ label, color }) => {
  const cls =
    color === "red"
      ? "bg-tag-red-bg text-tag-red-fg"
      : color === "green"
      ? "bg-tag-green-bg text-tag-green-fg"
      : "bg-tag-teal-bg text-tag-teal-fg";
  return <span className={`px-3 py-1 rounded-full text-[11px] font-medium ${cls}`}>{label}</span>;
};

const RequestCard = ({
  id,
  tags,
  title,
  body,
  chips,
  author,
  meta,
}) => (
  <Link href={`/request/${id}`}>
    <div className="bg-neutral rounded-2xl p-6 shadow-card flex flex-col hover:shadow-lg transition cursor-pointer h-full">
      <div className="flex flex-wrap gap-2">
        {tags.map((t) => (
          <TagPill key={t.label} {...t} />
        ))}
      </div>
      <p className="font-semibold text-foreground mt-4">{title}</p>
      <p className="text-sm text-muted-foreground mt-2 leading-relaxed flex-1">{body}</p>
      {chips && (
        <div className="flex flex-wrap gap-2 mt-4">
          {chips.map((c) => (
            <span
              key={c}
              className="px-3 py-1 rounded-full text-[11px] font-medium bg-tag-teal-bg text-tag-teal-fg"
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
      </div>
    </div>
  </Link>
);

const FALLBACK_REQUESTS = [
  {
    _id: 'fallback-1',
    id: 'fallback-1',
    category: 'web',
    urgency: 'high',
    status: 'open',
    title: 'Need help with React hooks implementation',
    description: 'I\'m struggling to understand useContext and useReducer. Can someone explain with a practical example?',
    tags: ['React', 'Hooks', 'JavaScript'],
    author: 'Ayesha Khan',
    location: 'Karachi',
    helpersInterested: [1, 2],
  },
  {
    _id: 'fallback-2',
    id: 'fallback-2',
    category: 'backend',
    urgency: 'medium',
    status: 'open',
    title: 'Backend API design best practices',
    description: 'Looking for guidance on structuring REST APIs for scalability. What are the best practices?',
    tags: ['REST API', 'Node.js', 'Architecture'],
    author: 'Hassan Ali',
    location: 'Islamabad',
    helpersInterested: [1],
  },
  {
    _id: 'fallback-3',
    id: 'fallback-3',
    category: 'design',
    urgency: 'low',
    status: 'open',
    title: 'Mobile app UI/UX feedback needed',
    description: 'Built a fitness tracking app and need design feedback. Specifically about the onboarding flow.',
    tags: ['UI/UX', 'Mobile', 'Design'],
    author: 'Sara Iqbal',
    location: 'Lahore',
    helpersInterested: [],
  },
];

async function FeaturedRequests() {
  await connectDB();

  const requestsFromDb = await Request.find({})
    .populate('author', 'name location trustScore contributions avgRating skills')
    .sort({ createdAt: -1 })
    .limit(3)
    .lean();

  const requests = (requestsFromDb.length > 0 ? requestsFromDb : FALLBACK_REQUESTS).map((req) => ({
    ...req,
    id: req._id?.toString() || req.id,
    _id: req._id?.toString() || req.id,
  }));

  return (
    <div className="grid md:grid-cols-3 gap-5 mt-8">
      {requests.map((req) => (
        <RequestCard
          key={req._id || req.id}
          id={req._id || req.id}
          tags={[
            { label: req.category || 'General', color: 'teal' },
            { label: (req.urgency || 'medium').charAt(0).toUpperCase() + (req.urgency || 'medium').slice(1), 
              color: req.urgency === 'high' ? 'red' : req.urgency === 'low' ? 'green' : 'teal' },
            { label: req.status || 'Open', color: req.status === 'solved' ? 'green' : 'teal' },
          ]}
          title={req.title}
          body={req.description?.substring(0, 80) + '...'}
          chips={req.tags}
          author={typeof req.author === 'object' ? req.author?.name : (req.author || 'Anonymous')}
          meta={`${req.location || 'Pakistan'} • ${req.helpersInterested?.length || req.interestedHelpers?.length || 0} interested`}
        />
      ))}
    </div>
  );
}

const Featured = () => (
  <section className="px-6 lg:px-12 mt-20">
    <p className="text-xs font-semibold tracking-[0.2em] text-primary">FEATURED REQUESTS</p>
    <div className="flex flex-wrap items-end justify-between gap-4 mt-3">
      <h2 className="text-3xl lg:text-[42px] font-extrabold text-foreground tracking-tight">
        Community problems currently in motion
      </h2>
      <Link href="/explore" className="px-5 py-2.5 rounded-full bg-card border border-border text-sm font-medium hover:bg-secondary transition inline-block">
        View full feed
      </Link>
    </div>

    <Suspense fallback={
      <div className="grid md:grid-cols-3 gap-5 mt-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-neutral rounded-2xl p-6 shadow-card h-64 animate-pulse"></div>
        ))}
      </div>
    }>
      <FeaturedRequests />
    </Suspense>

    <p className="text-xs text-muted-foreground text-center mt-16 pb-10">
      HelpHub AI is built as a premium-feel, multi-page community support product using Next.js,
      MongoDB, and modern web technologies.
    </p>
  </section>
);

const Index = () => (
  <main className="min-h-screen bg-linear-to-br from-tertiary from-5% to-neutral to-90%">
    <Hero />
    <CoreFlow />
    <Featured />
  </main>
);

export default Index;
