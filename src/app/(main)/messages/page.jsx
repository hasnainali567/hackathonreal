


const MessageThread = ({ from, to, message, time }) => (
    <div className="pb-5 bg-white p-4 rounded-2xl   shadow-soft">
        <p className="font-semibold text-foreground text-sm">{from} — {to}</p>
        <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{message}</p>
        <p className="text-xs text-primary mt-2 font-medium">{time}</p>
    </div>
);

const Messages = () => {
    return (
        <div className="min-h-screen bg-canvas-grad">
            <main className="max-w-[1280px] mx-auto px-6 lg:px-12 py-8 space-y-8">
                {/* Hero dark card */}
                <section className="bg-secondary text-primary-foreground rounded-3xl shadow-card px-10 lg:px-14 py-12 lg:py-14">
                    <p className="text-xs font-semibold tracking-[0.25em] text-primary-foreground/60 mb-5">
                        INTERACTION / MESSAGING
                    </p>
                    <h1 className="text-5xl lg:text-[64px] leading-[1.02] font-extrabold tracking-tight">
                        Keep support moving through direct communication.
                    </h1>
                    <p className="mt-5 text-primary-foreground/70 text-base">
                        Basic messaging gives helpers and requesters a clear follow-up path once a match happens.
                    </p>
                </section>

                {/* Two columns */}
                <section className="grid lg:grid-cols-2 gap-8">
                    {/* Conversation stream */}
                    <div className="bg-neutral rounded-3xl shadow-card p-10 lg:p-12">
                        <p className="text-xs font-semibold tracking-[0.25em] text-primary mb-5">
                            CONVERSATION STREAM
                        </p>
                        <h2 className="text-4xl lg:text-[44px] font-extrabold text-foreground tracking-tight">
                            Recent messages
                        </h2>

                        <div className="mt-8 space-y-6 border-b border-border/70 pb-6">
                            <MessageThread
                                from="Ayesha Khan"
                                to="Sara Noor"
                                message="I checked your portfolio request. Share the breakpoint screenshots and I can suggest fixes."
                                time="09:45 AM"
                            />
                        </div>

                        <div className="mt-6">
                            <MessageThread
                                from="Hassan Ali"
                                to="Ayesha Khan"
                                message="Your event poster concept is solid. I would tighten the CTA and reduce the background texture."
                                time="11:10 AM"
                            />
                        </div>
                    </div>

                    {/* Send message */}
                    <form className="bg-neutral rounded-3xl shadow-card p-10 lg:p-12">
                        <p className="text-xs font-semibold tracking-[0.25em] text-primary mb-5">
                            SEND MESSAGE
                        </p>
                        <h2 className="text-4xl lg:text-[44px] font-extrabold text-foreground tracking-tight">
                            Start a conversation
                        </h2>

                        <div className="mt-8 space-y-5">
                            <div>
                                <label className="block text-sm text-foreground/80 mb-2">To</label>
                                <select className="w-full px-5 py-3.5 rounded-full bg-background/60 border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
                                    <option>Ayesha Khan</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm text-foreground/80 mb-2">Message</label>
                                <textarea
                                    placeholder="Share support details, ask for files, or suggest next steps."
                                    className="w-full px-5 py-3.5 rounded-2xl bg-background/60 border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                                    rows="6"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="mt-8 w-full py-4 rounded-full bg-primary text-primary-foreground font-semibold text-base hover:opacity-90 transition-opacity shadow-soft"
                        >
                            Send
                        </button>
                    </form>
                </section>
            </main>
        </div>
    );
};

export default Messages;
