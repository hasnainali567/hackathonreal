


const Chip = ({ children }) => (
    <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-tag-green/40 text-primary text-sm font-medium">
        {children}
    </span>
);

const BadgeChip = ({ children }) => (
    <span className="inline-flex items-center px-4 py-1.5 rounded-full border border-primary/30 text-primary text-sm font-medium bg-card">
        {children}
    </span>
);

const Profile = () => {


    return (
        <div className="min-h-screen bg-canvas-grad">

            <main className="max-w-[1280px] mx-auto px-6 lg:px-12 py-8 space-y-8">
                {/* Hero dark card */}
                <section className="bg-secondary text-primary-foreground rounded-3xl shadow-card px-10 lg:px-14 py-12 lg:py-14">
                    <p className="text-xs font-semibold tracking-[0.25em] text-primary-foreground/60 mb-5">
                        PROFILE
                    </p>
                    <h1 className="text-5xl lg:text-[64px] leading-[1.02] font-extrabold tracking-tight">
                        Hasnain
                    </h1>
                    <p className="mt-5 text-primary-foreground/70 text-base">
                        Both • {'San Francisco, CA'} • Joined Jan 2024
                    </p>
                </section>

                {/* Two columns */}
                <section className="grid lg:grid-cols-2 gap-8">
                    {/* Public profile */}
                    <div className="bg-card rounded-3xl shadow-card p-10 lg:p-12">
                        <p className="text-xs font-semibold tracking-[0.25em] text-primary mb-5">
                            PUBLIC PROFILE
                        </p>
                        <h2 className="text-4xl lg:text-[44px] font-extrabold text-foreground tracking-tight">
                            Skills and reputation
                        </h2>

                        <div className="mt-8 space-y-4">
                            <div className="flex items-center justify-between py-3 border-b border-border/70">
                                <span className="text-foreground/80">Trust score</span>
                                <span className="text-foreground font-medium">100%</span>
                            </div>
                            <div className="flex items-center justify-between py-3 border-b border-border/70">
                                <span className="text-foreground/80">Contributions</span>
                                <span className="text-foreground font-medium">35</span>
                            </div>
                        </div>

                        <div className="mt-6">
                            <p className="text-foreground font-semibold mb-3">Skills</p>
                            <div className="flex flex-wrap gap-2.5">
                                    <Chip >figma</Chip>
                                    <Chip >figma</Chip>
                                    <Chip >figma</Chip>
                            </div>
                        </div>

                        <div className="mt-6">
                            <p className="text-foreground font-semibold mb-3">Badges</p>
                            <div className="flex flex-wrap gap-2.5">
                                <BadgeChip>Design Ally</BadgeChip>
                                <BadgeChip>Fast Responder</BadgeChip>
                                <BadgeChip>Top Mentor</BadgeChip>
                            </div>
                        </div>
                    </div>

                    {/* Edit profile */}
                    <form
                        className="bg-card rounded-3xl shadow-card p-10 lg:p-12"
                    >
                        <p className="text-xs font-semibold tracking-[0.25em] text-primary mb-5">
                            EDIT PROFILE
                        </p>
                        <h2 className="text-4xl lg:text-[44px] font-extrabold text-foreground tracking-tight">
                            Update your identity
                        </h2>

                        <div className="mt-8 grid grid-cols-2 gap-5">
                            <Field label="Name"  />
                            <Field label="Location" />
                        </div>

                        <div className="mt-5">
                            <Field label="Skills"  />
                        </div>
                        <div className="mt-5">
                            <Field label="Interests"  />
                        </div>

                        <button
                            type="submit"
                            className="mt-8 w-full py-4 rounded-full bg-primary text-primary-foreground font-semibold text-base hover:opacity-90 transition-opacity shadow-soft"
                        >
                            Save profile
                        </button>
                    </form>
                </section>
            </main>
        </div>
    );
};

const Field = ({
    label,
    value,
    onChange,
}) => (
    <label className="block">
        <span className="block text-sm text-foreground/80 mb-2">{label}</span>
        <input
            className="w-full px-5 py-3.5 rounded-full bg-background/60 border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
    </label>
);

export default Profile;
