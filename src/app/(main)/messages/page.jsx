
'use client';

import { useState, useEffect } from 'react';

const MessageThread = ({ from, to, message, time }) => (
    <div className="pb-5 bg-white p-4 rounded-2xl shadow-soft">
        <p className="font-semibold text-foreground text-sm">{from} — {to}</p>
        <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{message}</p>
        <p className="text-xs text-primary mt-2 font-medium">{time}</p>
    </div>
);

const Messages = () => {
    const [threads, setThreads] = useState([]);
    const [recipientOptions, setRecipientOptions] = useState([]);
    const [selectedRecipient, setSelectedRecipient] = useState('');
    const [messageText, setMessageText] = useState('');
    const [loading, setLoading] = useState(true);
    const [sendLoading, setSendLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);

    // Fetch message threads
    useEffect(() => {
        const fetchMessages = async () => {
            try {
                setLoading(true);
                const storedUser = localStorage.getItem('user');
                const userData = storedUser ? JSON.parse(storedUser) : null;
                setCurrentUser(userData);

                const viewerEmail = userData?.email || '';
                const res = await fetch(`/api/messages${viewerEmail ? `?viewerEmail=${encodeURIComponent(viewerEmail)}` : ''}`);
                if (!res.ok) throw new Error('Failed to fetch messages');
                const data = await res.json();
                
                const mappedThreads = (data.threads || data.data || []).map(t => ({
                    from: t.fromName || t.sender?.name || 'Unknown',
                    to: t.toName || t.recipient?.name || 'Unknown',
                    message: t.content || '',
                    time: t.createdAt ? new Date(t.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : new Date().toLocaleTimeString()
                }));
                
                setThreads(mappedThreads);
                
                const recipients = data.users || data.recipients || [];
                setRecipientOptions(recipients);
                if (recipients.length > 0) {
                    setSelectedRecipient(recipients[0].email || recipients[0].name || recipients[0].username);
                }
            } catch (err) {
                console.error('Error fetching messages:', err);
                setError(null);
                setThreads([]);
                setRecipientOptions([]);
            } finally {
                setLoading(false);
            }
        };

        fetchMessages();
    }, []);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        
        if (!messageText.trim() || !selectedRecipient) {
            setError('Please select a recipient and write a message');
            return;
        }

        setSendLoading(true);
        setError(null);

        try {
            const res = await fetch('/api/messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    senderEmail: currentUser?.email || '',
                    senderName: currentUser?.name || 'You',
                    recipientEmail: selectedRecipient,
                    recipientName: recipientOptions.find((user) => (user.email || user.name) === selectedRecipient)?.name || selectedRecipient,
                    content: messageText,
                })
            });

            if (!res.ok) throw new Error('Failed to send message');

            // Add new message to threads
            const newThread = {
                from: 'You',
                to: selectedRecipient,
                message: messageText,
                time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
            };

            setThreads([newThread, ...threads]);
            setMessageText('');
            setSuccess(true);
            setTimeout(() => setSuccess(false), 2000);
        } catch (err) {
            console.error('Error sending message:', err);
            setError('Failed to send message');
        } finally {
            setSendLoading(false);
        }
    };
    return (
        <div className="min-h-screen bg-canvas-grad">
            <main className="max-w-7xl mx-auto px-6 lg:px-12 py-8 space-y-8">
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

                {/* Success State */}
                {success && (
                    <div className="bg-green-50 border border-green-200 rounded-2xl p-6 text-green-700">
                        ✅ Message sent successfully!
                    </div>
                )}

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

                        {/* Loading State */}
                        {loading && (
                            <div className="mt-8 space-y-4">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="h-24 bg-muted rounded-2xl animate-pulse"></div>
                                ))}
                            </div>
                        )}

                        {/* Messages */}
                        {!loading && threads.length > 0 && (
                            <div className="mt-8 space-y-6 border-b border-border/70 pb-6">
                                {threads.map((thread, idx) => (
                                    <MessageThread key={idx} {...thread} />
                                ))}
                            </div>
                        )}

                        {/* No messages */}
                        {!loading && threads.length === 0 && (
                            <div className="mt-8 p-6 bg-background/40 rounded-2xl text-center text-muted-foreground">
                                <p>No messages yet. Start a conversation below!</p>
                            </div>
                        )}
                    </div>

                    {/* Send message */}
                    <form onSubmit={handleSendMessage} className="bg-neutral rounded-3xl shadow-card p-10 lg:p-12">
                        <p className="text-xs font-semibold tracking-[0.25em] text-primary mb-5">
                            SEND MESSAGE
                        </p>
                        <h2 className="text-4xl lg:text-[44px] font-extrabold text-foreground tracking-tight">
                            Start a conversation
                        </h2>

                        <div className="mt-8 space-y-5">
                            <div>
                                <label className="block text-sm text-foreground/80 mb-2">To</label>
                                <select 
                                    value={selectedRecipient}
                                    onChange={(e) => setSelectedRecipient(e.target.value)}
                                    className="w-full px-5 py-3.5 rounded-full bg-background/60 border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                                >
                                    <option value="">Select helper</option>
                                    {recipientOptions.map((user) => (
                                        <option key={user.id || user.email || user.name} value={user.email || user.name}>
                                            {user.name || user.username} {user.role ? `(${user.role})` : ''}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm text-foreground/80 mb-2">Message</label>
                                <textarea
                                    value={messageText}
                                    onChange={(e) => setMessageText(e.target.value)}
                                    placeholder="Share support details, ask for files, or suggest next steps."
                                    className="w-full px-5 py-3.5 rounded-2xl bg-background/60 border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                                    rows="6"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={sendLoading}
                            className="mt-8 w-full py-4 rounded-full bg-primary text-primary-foreground font-semibold text-base hover:opacity-90 transition-opacity shadow-soft disabled:opacity-60"
                        >
                            {sendLoading ? '⏳ Sending...' : '💬 Send'}
                        </button>
                    </form>
                </section>
            </main>
        </div>
    );
};

export default Messages;
