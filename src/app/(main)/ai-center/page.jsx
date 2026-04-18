const AICenter = () => {
    return (
        <div className="min-h-screen bg-canvas-grad">
            <main className="max-w-[1280px] mx-auto px-6 lg:px-12 py-8 space-y-8">
                {/* Hero dark card */}
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

                {/* Stats cards */}
                <section className="grid md:grid-cols-3 gap-5">
                    <div className="bg-card rounded-2xl shadow-card p-6">
                        <p className="text-xs font-semibold tracking-[0.2em] text-primary mb-3">TREND PULSE</p>
                        <h3 className="text-3xl font-bold text-foreground">Web</h3>
                        <p className="text-sm text-muted-foreground mt-2 leading-relaxed">Most common support area based on active community requests.</p>
                    </div>

                    <div className="bg-card rounded-2xl shadow-card p-6">
                        <p className="text-xs font-semibold tracking-[0.2em] text-primary mb-3">URGENCY WATCH</p>
                        <h3 className="text-3xl font-bold text-foreground">2</h3>
                        <p className="text-sm text-muted-foreground mt-2 leading-relaxed">Requests currently flagged high priority by the urgency detector.</p>
                    </div>

                    <div className="bg-card rounded-2xl shadow-card p-6">
                        <p className="text-xs font-semibold tracking-[0.2em] text-primary mb-3">MENTOR POOL</p>
                        <h3 className="text-3xl font-bold text-foreground">2</h3>
                        <p className="text-sm text-muted-foreground mt-2 leading-relaxed">Trusted helpers with strong response history and contribution signals.</p>
                    </div>
                </section>

                {/* Recommendations */}
                <section className="bg-card rounded-3xl shadow-card p-10 lg:p-12">
                    <p className="text-xs font-semibold tracking-[0.25em] text-primary mb-5">
                        AI RECOMMENDATIONS
                    </p>
                    <h2 className="text-3xl lg:text-[42px] font-extrabold text-foreground tracking-tight">
                        Requests needing attention
                    </h2>

                    <div className="mt-8 space-y-4">
                        {/* Recommendation 1 */}
                        <div className="bg-background/40 border border-border/60 rounded-2xl p-6">
                            <p className="font-semibold text-foreground text-sm">Need help</p>
                            <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                                AI summary: Web Development request with high urgency. Best suited for members with relevant expertise.
                            </p>
                            <div className="flex flex-wrap gap-2 mt-3">
                                <span className="px-3 py-1 rounded-full bg-tag-teal-bg text-tag-teal-fg text-xs font-medium">Web Development</span>
                                <span className="px-3 py-1 rounded-full bg-tag-red-bg text-tag-red-fg text-xs font-medium">High</span>
                            </div>
                        </div>

                        {/* Recommendation 2 */}
                        <div className="bg-background/40 border border-border/60 rounded-2xl p-6">
                            <p className="font-semibold text-foreground text-sm">Need help making my portfolio responsive before demo day</p>
                            <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                                Responsive layout issue with a short deadline. Best helpers are Frontend mentors comfortable with CSS grids and media queries.
                            </p>
                            <div className="flex flex-wrap gap-2 mt-3">
                                <span className="px-3 py-1 rounded-full bg-tag-teal-bg text-tag-teal-fg text-xs font-medium">Web Development</span>
                                <span className="px-3 py-1 rounded-full bg-tag-red-bg text-tag-red-fg text-xs font-medium">High</span>
                            </div>
                        </div>

                        {/* Recommendation 3 */}
                        <div className="bg-background/40 border border-border/60 rounded-2xl p-6">
                            <p className="font-semibold text-foreground text-sm">Looking for Figma feedback on a volunteer event poster</p>
                            <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                                A visual design critique request where feedback on hierarchy, spacing, and messaging would create the most value.
                            </p>
                            <div className="flex flex-wrap gap-2 mt-3">
                                <span className="px-3 py-1 rounded-full bg-tag-teal-bg text-tag-teal-fg text-xs font-medium">Design</span>
                                <span className="px-3 py-1 rounded-full bg-tag-teal-bg text-tag-teal-fg text-xs font-medium">Medium</span>
                            </div>
                        </div>

                        {/* Recommendation 4 */}
                        <div className="bg-background/40 border border-border/60 rounded-2xl p-6">
                            <p className="font-semibold text-foreground text-sm">Need mock interview support for internship applications</p>
                            <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                                Career coaching request focused on confidence building, behavioral answers, and entry-level frontend interviews.
                            </p>
                            <div className="flex flex-wrap gap-2 mt-3">
                                <span className="px-3 py-1 rounded-full bg-tag-teal-bg text-tag-teal-fg text-xs font-medium">Career</span>
                                <span className="px-3 py-1 rounded-full bg-tag-teal-bg text-tag-teal-fg text-xs font-medium">Low</span>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default AICenter;
