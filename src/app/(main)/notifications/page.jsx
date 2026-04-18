'use client';

import { useState, useEffect } from 'react';

const Notification = ({ type, title, message, time, isRead, onRead }) => {
    const getIcon = () => {
        if (type === 'new-request') return '🆕';
        if (type === 'help-offer') return '🤝';
        if (type === 'status-change') return '✅';
        if (type === 'message') return '💬';
        return '📢';
    };

    const getBgColor = () => {
        if (isRead) return 'bg-background/40';
        return 'bg-primary/5 border-l-4 border-primary';
    };

    return (
        <div
            className={`${getBgColor()} rounded-2xl p-5 cursor-pointer hover:bg-background/60 transition`}
            onClick={onRead}
        >
            <div className="flex gap-4 items-start">
                <div className="text-2xl shrink-0">{getIcon()}</div>
                <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground text-sm">{title}</p>
                    <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{message}</p>
                    <p className="text-xs text-muted-foreground/60 mt-2">{time}</p>
                </div>
                {!isRead && <div className="w-2 h-2 rounded-full bg-primary shrink-0 mt-1" />}
            </div>
        </div>
    );
};

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                setLoading(true);
                const storedUser = localStorage.getItem('user');
                const userData = storedUser ? JSON.parse(storedUser) : null;
                setCurrentUser(userData);

                const userEmail = userData?.email || '';
                const res = await fetch(`/api/notifications${userEmail ? `?userEmail=${encodeURIComponent(userEmail)}` : ''}`);

                if (!res.ok) {
                    throw new Error('Failed to fetch notifications');
                }

                const data = await res.json();
                const source = Array.isArray(data) ? data : (data.notifications || data.data || []);

                const mappedNotifications = source.map((notif) => ({
                    id: notif.id || notif._id,
                    type: notif.type || 'notification',
                    title: notif.title || 'Notification',
                    message: notif.message || '',
                    time: notif.createdAt ? new Date(notif.createdAt).toLocaleDateString() : 'Recently',
                    isRead: notif.isRead || false,
                }));

                setNotifications(mappedNotifications);
            } catch (err) {
                console.error('Error fetching notifications:', err);
                setNotifications([]);
            } finally {
                setLoading(false);
            }
        };

        fetchNotifications();
    }, []);

    const handleMarkAsRead = async (id) => {
        try {
            await fetch(`/api/notifications/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isRead: true })
            });

            setNotifications(notifications.map((n) =>
                n.id === id ? { ...n, isRead: true } : n
            ));
        } catch (err) {
            console.error('Error updating notification:', err);
        }
    };

    const markAllAsRead = async () => {
        try {
            await fetch('/api/notifications', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userEmail: currentUser?.email || '' })
            });

            setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
        } catch (err) {
            console.error('Error marking all as read:', err);
        }
    };

    const unreadCount = notifications.filter((n) => !n.isRead).length;

    return (
        <div className="min-h-screen bg-canvas-grad">
            <main className="max-w-7xl mx-auto px-6 lg:px-12 py-8 space-y-8">
                <section className="bg-secondary text-primary-foreground rounded-3xl shadow-card px-10 lg:px-14 py-12 lg:py-14">
                    <p className="text-xs font-semibold tracking-[0.25em] text-primary-foreground/60 mb-5">
                        NOTIFICATIONS
                    </p>
                    <div className="flex items-start justify-between">
                        <div>
                            <h1 className="text-5xl lg:text-[64px] leading-[1.02] font-extrabold tracking-tight">
                                Stay in the loop
                            </h1>
                            <p className="mt-5 text-primary-foreground/70 text-base">
                                Get notified about new requests, help offers, messages, and updates from the community.
                            </p>
                        </div>
                        {unreadCount > 0 && (
                            <div className="px-4 py-2 rounded-full bg-primary text-primary-foreground font-bold">
                                {unreadCount} new
                            </div>
                        )}
                    </div>
                </section>

                {loading && (
                    <div className="space-y-3">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="bg-card rounded-2xl shadow-card p-5 h-20 animate-pulse" />
                        ))}
                    </div>
                )}

                {!loading && notifications.length > 0 && (
                    <section className="bg-card rounded-2xl shadow-card p-6 lg:p-8">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                            <div className="flex gap-3 flex-wrap">
                                {['All', 'New requests', 'Messages', 'Status updates'].map((filter) => (
                                    <button
                                        key={filter}
                                        className="px-4 py-2 rounded-full bg-background/60 text-foreground text-sm font-medium hover:bg-background transition"
                                    >
                                        {filter}
                                    </button>
                                ))}
                            </div>
                            {unreadCount > 0 && (
                                <button
                                    onClick={markAllAsRead}
                                    className="px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium hover:bg-primary/20 transition"
                                >
                                    Mark all as read
                                </button>
                            )}
                        </div>
                    </section>
                )}

                {!loading && (
                    <section className="space-y-3">
                        <h2 className="text-xl font-bold text-foreground">
                            {unreadCount > 0 ? `Unread notifications (${unreadCount})` : 'All notifications'}
                        </h2>

                        {notifications.length > 0 ? (
                            <div className="space-y-3">
                                {notifications.map((notif) => (
                                    <Notification
                                        key={notif.id}
                                        type={notif.type}
                                        title={notif.title}
                                        message={notif.message}
                                        time={notif.time}
                                        isRead={notif.isRead}
                                        onRead={() => handleMarkAsRead(notif.id)}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="bg-card rounded-2xl shadow-card p-8 text-center text-muted-foreground">
                                <p>No notifications yet.</p>
                            </div>
                        )}
                    </section>
                )}

                {!loading && (
                    <section className="bg-card rounded-3xl shadow-card p-10 lg:p-12">
                        <p className="text-xs font-semibold tracking-[0.25em] text-primary mb-5">
                            NOTIFICATION SETTINGS
                        </p>
                        <h2 className="text-2xl font-bold text-foreground mb-6">Customize what you get notified about</h2>

                        <div className="space-y-4">
                            {[
                                { label: 'New requests matching my skills', enabled: true },
                                { label: 'Help offers on my requests', enabled: true },
                                { label: 'Messages from helpers', enabled: true },
                                { label: 'Status updates on requests', enabled: true },
                                { label: 'Trending topics and insights', enabled: true },
                                { label: 'Weekly community digest', enabled: false },
                            ].map((setting, idx) => (
                                <div key={idx} className="flex items-center justify-between py-3 border-b border-border/40">
                                    <span className="text-foreground/80">{setting.label}</span>
                                    <input
                                        type="checkbox"
                                        checked={setting.enabled}
                                        className="w-5 h-5 cursor-pointer"
                                        readOnly
                                    />
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </main>
        </div>
    );
};

export default Notifications;
